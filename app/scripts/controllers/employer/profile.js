'use strict';

/**
 * @ngdoc function
 * @name visageClientApp.controller:CheckoutCtrl
 * @description
 * # CheckoutCtrl
 * Controller of the visageClientApp
 */

/**
 * Created by T0138890 on 03/09/15.
 */

angular.module('visageClientApp')

  .controller('EmployerProfileCtrl', function ($scope,
    auth,
    $location,
    JobOffer,
    CustomerService,
    $q,
    Loader,
    Preference,
    $mdToast,
    user) {

    $scope.save = function () {
      $scope.submitted = true;
      if ($scope.form.$valid) {
        $scope.pending = 'indeterminate';

        if ($scope.prefs.roles.indexOf('employer') === -1) {
          $scope.prefs.roles.push('employer');
          CustomerService.updateCustomerIntercom({employer: true});
        }

        $scope.prefs.$update().then(function () {
          $scope.pending = null;
          showToast('Profile updated');
          $location.path('/employer/jobs');
        }, function (err) {
          console.error(err);
          $scope.pending = null;
        });
      }
    };

    function showToast(text) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .position('top right')
          .hideDelay(3000)
      );
    }

    $scope.setHome(false);
    $scope.setForm({
      title: 'Your details'
    });
    $scope.setProgress(null);

    $scope.prefs = user;
    $scope.details = {};
    if (!$scope.prefs.name) {
      $scope.warningNameModified = true;
      //helper, if user logged with a social and name is not an email
      if (auth.profile.name.indexOf('@') === -1) {
        $scope.prefs.name = auth.profile.name;
      }
    }
    $scope.details.email = auth.profile.email;
    if (!$scope.prefs.employer) {
      $scope.prefs.employer = {};
    }
    if (!$scope.prefs.employer.company) {
      $scope.prefs.employer.company = CustomerService.getCurrentCompany();
    }

  });
