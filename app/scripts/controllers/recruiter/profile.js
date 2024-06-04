'use strict';

/**
 * @ngdoc function
 * @name visageClientApp.controller:RecruiterRecruiterprofileCtrl
 * @description
 * # RecruiterRecruiterprofileCtrl
 * Controller of the visageClientApp
 */
angular.module('visageClientApp')
  .controller('RecruiterProfileCtrl', function ($scope,
    StaticData,
    Preference,
    $q,
    $mdToast,
    Loader,
    $location,
    auth,
    CustomerService,
    RecruiterService,
    EMailFactory,
    Invitation) {
    var invitation;

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(location) {
        var cnty = angular.lowercase(location);
        return (cnty.indexOf(lowercaseQuery) !== -1);
      };
    }

    function showToast(text) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .position('top right')
          .hideDelay(3000)
      );
    }

    function checkInvitation(responses) {
      var deferred = $q.defer();
      var preferences = responses.update.resource;
      //Recruiters are now validated by default
      CustomerService.updateCustomerIntercom({validatedRecruiter: true});
      RecruiterService.assignJobsOnWorkable(preferences);
      EMailFactory.recruiterValidated(preferences);
      if (invitation) {
        invitation.status = 'Confirmed';
        invitation.confirmedOn = new Date();
        return invitation.$update();
      }
      else {
        deferred.resolve();
      }
      return deferred.promise;
    }

    $scope.saveProfile = function () {
      $scope.pending = 'indeterminate';
      //Workaround because autocomplete directive save null values when empty
      $scope.preferences.recruiter.industries = $scope.preferences.recruiter.industries.filter(
        function (industry) {
          return !!industry;
        }
      );
      var calls = {};
      if ($scope.preferences.roles.indexOf('recruiter') === -1) {
        $scope.preferences.roles.push('recruiter');
        calls.intercom = CustomerService.updateCustomerIntercom({recruiter: true});
      }
      //Recruiters are now validated by default
      //if (invitation) {
      //  $scope.preferences.recruiter.validated = true;
      //}
      calls.update = $scope.preferences.$update();
      $q.all(calls)
        .then(checkInvitation)
        .then(function () {
          showToast('Profile updated');
          $location.path('/recruiter/jobs');
        })
        .catch(function (err) {
          console.error(err);
        })
        .finally(function () {
          $location.search('inviteRecruiter', null);
          $location.search('key', null);
          $scope.pending = false;
        });
    };

    $scope.searchIndustry = function (query) {
      return query ? $scope.industries.filter(createFilterFor(query)) : [];
    };

    $scope.searchLocation = function (query) {
      return query ? $scope.locations.filter(createFilterFor(query)) : [];
    };

    $scope.setHome(false);
    $scope.setForm({
      title: 'Your details'
    });
    $scope.setProgress(null);

    Loader.globalLoader(true);

    var calls = [StaticData.init(), Preference.getPreferences()];

    $scope.params = $location.search();

    if ($scope.params.inviteRecruiter && $scope.params.key) {
      calls.push(Invitation.get({
        inviteId: $scope.params.inviteRecruiter,
        key: $scope.params.key
      }).$promise);
    }
    $q.all(calls)
      .then(function (result) {
        if (result[2] && result[2].role === 'recruiter') {
          invitation = result[2];
        }
        $scope.preferences = result[1];
        if ($scope.preferences.recruiter &&
          !Array.isArray($scope.preferences.recruiter.industries)) {
          $scope.preferences.recruiter.industries = [];
        }
        if (!$scope.preferences.recruiter) {
          $scope.preferences.recruiter = {
            industries : []
          };
        }
        //helper, if user logged with a social and name is not an email
        if (!$scope.preferences.name && auth.profile.name.indexOf('@') === -1) {
          $scope.preferences.name = auth.profile.name;
        }
        $scope.locations = result[0][0].data.geonames.map(function (location) {
          return location.countryName;
        });
        $scope.jobRoles = result[0][1].data;
        $scope.industries = result[0][4].data;

        $scope.areas = result[0][7].data;
        $scope.availabilities = result[0][8].data;
        Loader.globalLoader(false);
      }, function (err) {
        console.error(err);
        Loader.globalLoader(false);
      });
  });
