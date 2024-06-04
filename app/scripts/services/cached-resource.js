'use strict';

/**
 * @ngdoc service
 * @name visageClientApp.cachedResource
 * @description
 * # cachedResource
 * Factory in the visageClientApp.
 */
angular.module('visageClientApp')
  .factory('cachedResource', function ($resource, $cacheFactory) {
    var cache = $cacheFactory('resourceCache');

    var interceptor = {
      response: function (response) {
        cache.remove(response.config.url);
        if (response.config.method === 'POST') {
          if (response.data._id) {
            cache.remove(response.config.url + '/' + response.data._id);
          }
        }
        if (response.config.method === 'PUT' || response.config.method === 'DELETE') {
          var removeGetCache = response.config.url.split('/').slice(0, -1).join('/') + '/';
          cache.remove(removeGetCache);
        }
        return response;
      }
    };

    return function (url, paramDefaults, actions, options) {
      actions = angular.merge({}, {/* default options get, query, etc. */}, actions);

      actions = angular.merge({}, {
        'get': {method: 'GET', cache: cache},
        'query': {method: 'GET', cache: cache, isArray: true},
        'save': {method: 'POST', interceptor: interceptor},
        'update': {method: 'PUT', interceptor: interceptor},
        'remove': {method: 'DELETE', interceptor: interceptor},
        'delete': {method: 'DELETE', interceptor: interceptor}
      }, actions);

      return $resource(url, paramDefaults, actions, options);
    };
  });
