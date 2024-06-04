'use strict';

/**
 * @ngdoc service
 * @name visageClientApp.Loader
 * @description
 * # Loader
 * Factory in the visageClientApp.
 */
angular.module('visageClientApp')
  .factory('Loader', function ($rootScope) {

    // Public API here
    return {
      globalLoader: function (loading) {
        if (loading) {
          $rootScope.$broadcast("loading:show");
        }
        else {
          $rootScope.$broadcast("loading:hide");
        }

      }
    };
  });
