'use strict';

/**
 * @ngdoc filter
 * @name visageBoApp.filter:filters
 * @function
 * @description
 * # filters
 * Filter in the visageBoApp.
 */
angular.module('visageClientApp')
  .filter('removeTrailingEquals', function () {
    return function (input) {
      if (input) {
        return input.replace(new RegExp("=", 'g'), "");
      }
    };
  });
