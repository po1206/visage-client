'use strict';

/**
 * @ngdoc directive
 * @name visageClientApp.directive:globalLoading
 * @description
 * # globalLoading
 */
angular.module('visageClientApp')
  .directive('globalLoading', function ($compile) {
    return {
      restrict: 'A',
      scope: {
        globalLoading: '='
      },
      link: function postLink(scope, element) {
        scope.$watch('globalLoading', function (value) {
          if (value) {
            var globalLoaderELement = angular.element('' +
              '<div class=\'global-loader\' layout=\'column\' layout-align=\'center center\'>' +
                '<div>' +
                  '<img src=\'images/Visage_green_logo.svg\' alt=\'visage loading\'>' +
                  '<div layout=\'row\' layout-align=\'center center\'>' +
                    '<md-progress-circular md-mode=\'indeterminate\'></md-progress-circular>' +
                  '</div>' +
                '</div>' +
              '</div>');
            $compile(globalLoaderELement)(scope);
            element.append(globalLoaderELement);
          }
          else {
            angular.element(document.querySelector('.global-loader')).remove();
          }
        });

      }
    };
  });
