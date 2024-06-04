'use strict';

/**
 * @ngdoc service
 * @name visageClientApp.RecruiterAssignment
 * @description
 * # RecruiterAssignment
 * Factory in the visageClientApp.
 */
angular.module('visageClientApp')
  .factory('RecruiterAssignment', function (cachedResource, endpointsApi, ENV) {

    var RecruiterAssignment = cachedResource(ENV.apiEndpoint +
      '/:path/:id' +
      endpointsApi.recruiters + '/:subId',
      {subId: '@_id'},
      {
        queryByJob: {
          method: 'GET',
          params: {
            path: 'job-offers',
            id: '@id'
          },
          isArray: true
        },
        queryByRecruiter: {
          url: ENV.apiEndpoint +
          '/:path/:id' +
          endpointsApi.recruiterAssignments,
          method: 'GET',
          params: {
            path: 'users',
            id: '@id'
          },
          isArray: true
        }
      });

    return RecruiterAssignment;
  });
