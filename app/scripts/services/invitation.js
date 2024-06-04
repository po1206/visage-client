'use strict';

/**
 * @ngdoc service
 * @name visageClientApp.invitation
 * @description
 * # invitation
 * Factory in the visageClientApp.
 */
angular.module('visageClientApp')
  .factory('Invitation', function (cachedResource, endpointsApi, ENV) {

    var Invitation = cachedResource(ENV.apiEndpoint + endpointsApi.invitations + "/:inviteId",
      {inviteId: '@_id'});
    return angular.extend(Invitation, {});
  });

