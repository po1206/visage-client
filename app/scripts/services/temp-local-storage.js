'use strict';

/**
 * @ngdoc service
 * @name visageClientApp.TempLocalStorage
 * @description
 * # TempLocalStorage
 * Factory in the visageClientApp.
 */
angular.module('visageClientApp')
  .factory('TempLocalStorage', function (auth, store) {

    var requestedUrl = null;

    // Public API here
    return {
      setRequestedUrl: function (newRequestedUrl) {
        requestedUrl = newRequestedUrl;
      },
      getRequestedUrl: function () {
        return requestedUrl;
      },
      save: function () {
        if (auth.profile) {
          store.set('profile', auth.profile);
          store.set('requestedUrl', requestedUrl);
        }
      },
      load: function () {
        auth.profile = store.get('profile');
        requestedUrl = store.get('requestedUrl');
      },
      destroy: function () {
        store.remove('profile');
        store.remove('requestedUrl');
      }
    };
  });
