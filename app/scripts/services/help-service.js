'use strict';

/**
 * @ngdoc service
 * @name visageClientApp.ShepherdService
 * @description
 * # ShepherdService
 * Service in the visageClientApp.
 */
angular.module('visageClientApp')
  .factory('HelpService', function ($cookies) {
    function checkCookie(f) {
      return function () {
        if (!$cookies.get('alreadyThere')) {
          f.apply(this, arguments);
        }
      };
    }

    function setCookieWhenComplete(f) {
      return function () {
        f.apply(this, arguments);
        $cookies.put('alreadyThere', true);
      };
    }

    return {
      checkCookie: checkCookie,
      setCookieWWhenComplete: setCookieWhenComplete
    };

  });
