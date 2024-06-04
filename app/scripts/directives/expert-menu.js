'use strict';

/**
 * @ngdoc directive
 * @name visageClientApp.directive:visageExpertMenu
 * @description
 * # visageExpertMenu
 */
angular.module('visageClientApp')
  .directive('visageExpertMenu', function ($location) {
    return {
      templateUrl: 'views/templates/expert-menu.tmpl.html',
      restrict: 'E',
      link: function postLink(scope) {
        scope.navigateTo = function (path) {
          $location.path(path);
        };
      }
    };
  });
