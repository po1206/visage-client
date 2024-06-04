'use strict';

/**
 * @ngdoc function
 * @name visageClientApp.controller:ExpertProfileCtrl
 * @description
 * # ExpertProfileCtrl
 * Controller of the visageClientApp
 */
angular.module('visageClientApp')
  .controller('ExpertProfileCtrl', function ($scope,
    StaticData,
    Preference,
    $q,
    $mdToast,
    Loader,
    $location,
    auth,
    CustomerService,
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

    function checkInvitation() {
      var deferred = $q.defer();
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
      if ($scope.authorized) {
        $scope.pending = 'indeterminate';
        //Workaround because autocomplete directive save null values when empty
        $scope.preferences.expert.industries = $scope.preferences.expert.industries.filter(
          function (industry) {
            return !!industry;
          }
        );
        var calls = {};
        if ($scope.preferences.roles.indexOf('expert') === -1) {
          $scope.preferences.roles.push('expert');
          calls.intercom = CustomerService.updateCustomerIntercom({expert: true});
        }
        calls.update = $scope.preferences.$update();
        $q.all(calls)
          .then(checkInvitation)
          .then(function () {
            showToast('Profile updated');
            $location.path('/expert/my-jobs');
          })
          .catch(function (err) {
            console.error(err);
          })
          .finally(function () {
            $location.search('inviteExpert', null);
            $location.search('key', null);
            $scope.pending = false;
          });
      }

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

    var calls = [StaticData.init(),
      Preference.getPreferences()
    ];

    $scope.params = $location.search();

    if ($scope.params.inviteExpert && $scope.params.key) {
      calls.push(
        Invitation.get({
          inviteId: $scope.params.inviteExpert,
          key: $scope.params.key
        }).$promise);
    }

    Loader.globalLoader(true);
    $q.all(calls)
      .then(function (result) {
        //Experts are only on invitation
        $scope.preferences = result[1];
        if ((result[2] && result[2].role === 'expert') ||
          $scope.preferences.roles.indexOf('expert') !== -1) {
          if(!$scope.preferences.expert){
            $scope.preferences.expert = {
              industries:[]
            };
          }
          $scope.authorized = true;
          if (result[2] && result[2].role === 'expert') {
            invitation = result[2];
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
        }

      })
      .catch(function (err) {
        console.error(err);
      })
      .finally(function () {
        Loader.globalLoader(false);
      });
  });
