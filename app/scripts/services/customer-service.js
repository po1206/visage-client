'use strict';

/**
 * @ngdoc service
 * @name visageClientApp.CustomerService
 * @description
 * # CustomerService
 * Service in the visageClientApp.
 */
angular.module('visageClientApp')
  .service('CustomerService',
    function (auth, ThirdParties, $http, auth0constants, TempLocalStorage, UserBehavior, $q) {
      // AngularJS will instantiate a singleton by calling "new" on this function

      //For now the async is useless but Intercom will implement a callback in next version
      this.updateCustomerIntercom = function (details) {
        var deferred = $q.defer();
        UserBehavior.update(details);
        deferred.resolve();
        return deferred.promise;
      };

      this.getCurrentCompany = function () {
        var company = null;
        if (auth.profile.positions) {
          var positions = auth.profile.positions.values;
          if (positions) {
            positions.forEach(function (position) {
              if (position.isCurrent) {
                company = position.company.name;
              }
            });
          }
        }
        return company;
      };
    });
