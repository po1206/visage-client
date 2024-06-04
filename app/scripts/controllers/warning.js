'use strict';

/**
 * @ngdoc function
 * @name visageClientApp.controller:WarningCtrl
 * @description
 * # WarningCtrl
 * Controller of the visageClientApp
 */
angular.module('visageClientApp')
  .controller('WarningCtrl', function ($scope, $mdToast) {
    $scope.closeToast = function () {
      $mdToast.hide();
    };
  });
