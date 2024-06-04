'use strict';

/**
 * @ngdoc service
 * @name visageClientApp.RecruiterSubmission
 * @description
 * # RecruiterSubmission
 * Factory in the visageClientApp.
 */
angular.module('visageClientApp')
  .factory('RecruiterSubmission', function ($resource, endpointsApi, ENV) {

    //don't cache this one
    var RecruiterSubmission = $resource(ENV.apiEndpoint +
      endpointsApi.recruiters + '/:recruiterId/submissions',
      {recruiterId: '@_id'});

    return RecruiterSubmission;
  });
