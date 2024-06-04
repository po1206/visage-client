'use strict';

/**
 * @ngdoc directive
 * @name visageClientApp.directive:visageRecruiterMenu
 * @description
 * # visageRecruiterMenu
 */
angular.module('visageClientApp')
  .directive('visageRecruiterMenu', function ($location) {
    return {
      templateUrl: 'views/templates/recruiter-menu.tmpl.html',
      restrict: 'E',
      link: function postLink(scope) {
        scope.navigateTo = function (path) {
          $location.path(path);
        };
      }
    };
  });
