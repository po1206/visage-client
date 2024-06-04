'use strict';

/**
 * @ngdoc directive
 * @name visageClientApp.directive:visageEmployerMenu
 * @description
 * # visageEmployerMenu
 */
angular.module('visageClientApp')
  .directive('visageEmployerMenu', function ($location, $window) {
    return {
      templateUrl: 'views/templates/employer-menu.tmpl.html',
      restrict: 'E',
      link: function postLink(scope) {
        scope.navigateTo = function (path) {
          $location.path(path);
        };
        scope.open = function (uri) {
          $window.open(uri, "_blank");
        };
      }
    };
  });
