'use strict';

/**
 * @ngdoc function
 * @name visageClientApp.controller:ForbiddenCtrl
 * @description
 * # ForbiddenCtrl
 * Controller of the visageClientApp
 */
angular.module('visageClientApp')
  .controller('ForbiddenCtrl', function ($scope, $location, auth) {

    var checkLogin = function () {
      if (!auth.isAuthenticated) {
        $scope.$emit('visage.promptLogin');
      }
      else {
        if (auth.profilePromise) {
          $scope.$emit('visage.login');
        }
      }
    };

    $scope.setHome(false);
    $scope.setForm(false);
    var params = $location.search();

    if (params.logout) {
      $location.search('logout', null);
      $scope.$emit('visage.logout');
    }
    else {
      checkLogin();
    }

  });
