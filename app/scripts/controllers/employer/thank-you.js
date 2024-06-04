'use strict';

/**
 * @ngdoc function
 * @name visageClientApp.controller:ThankyouCtrl
 * @description
 * # ThankyouCtrl
 * Controller of the visageClientApp
 */
angular.module('visageClientApp')
  .controller('ThankYouCtrl', function ($scope, $location) {
    $scope.setHome(false);
    $scope.setForm({
      title: 'Thank You'
    });
    $scope.setProgress(100);
    var params = $location.search();
    if (params.offlinepayment) {
      $scope.waitingForPayment = true;
      //$location.search({});
    }

  });
