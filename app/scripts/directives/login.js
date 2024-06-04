'use strict';

/**
 * @ngdoc directive
 * @name visageClientApp.directive:login
 * @description
 * # login
 */
angular.module('visageClientApp')
  .directive('login', function () {
    return {
      templateUrl: 'views/templates/login.tmpl.html',
      restrict: 'E',
      controller: 'LoginCtrl',
      replace: true
    };
  });
