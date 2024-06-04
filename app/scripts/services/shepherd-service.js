'use strict';

/**
 * @ngdoc service
 * @name visageClientApp.ShepherdService
 * @description
 * # ShepherdService
 * Service in the visageClientApp.
 */
angular.module('visageClientApp')
  .factory('ShepherdService', function ($cookies) {
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
        $cookies.put('alreadyThere', "true");
      };
    }

    var tour;

    tour = new Shepherd.Tour({
      defaults: {
        classes: 'shepherd-theme-arrows',
        scrollTo: true
      }
    });

    for (var tourAtt in tour) {
      if (tour.hasOwnProperty(tourAtt)) {
        var tourProtoFct = tour[tourAtt];
        //we decorate every Shepherd functions
        if (tour.hasOwnProperty(tourAtt) && typeof tourProtoFct === "function") {
          tour[tourAtt] = checkCookie(tourProtoFct);
          if (tourAtt === "complete" || tourAtt === "cancel") {
            tour[tourAtt] = setCookieWhenComplete(tourProtoFct);
          }
        }
      }
    }

    return tour;

  });
