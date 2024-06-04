'use strict';

/**
 * @ngdoc directive
 * @name visageClientApp.directive:visageCandidateMenu
 * @description
 * # visageCandidateMenu
 */
angular.module('visageClientApp')
  .directive('visageCandidateMenu', function ($location) {
    return {
      templateUrl: 'views/templates/candidate-menu.tmpl.html',
      restrict: 'E',
      link: function postLink(scope) {
        scope.navigateTo = function (path) {
          $location.path(path);
        };
      }
    };
  });
