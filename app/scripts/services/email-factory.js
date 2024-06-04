'use strict';

/**
 * @ngdoc service
 * @name visageClientApp.EMailFactory
 * @description
 * # EMailFactory
 * Factory in the visageClientApp.
 */
angular.module('visageClientApp')
  .factory('EMailFactory', function (ENV, endpointsApi, $http) {

    // Public API here
    return {
      jobConfirmation: function (user, job) {
        return $http.post(ENV.apiEndpoint +
          endpointsApi.mail +
          '/job-confirmation',
          {
            'client': user,
            'job': job
          });
      },
      orderConfirmation: function (email, receipt) {
        return $http.post(ENV.apiEndpoint +
          endpointsApi.mail +
          '/order-confirmation',
          {
            email: email,
            receipt: receipt
          });
      },
      calibrationValidated: function (job) {
        return $http.post(ENV.apiEndpoint +
          endpointsApi.mail +
          '/calibration-validated',
          {
            job: job
          });
      },
      recruiterValidated: function (recruiter) {
        return $http.post(ENV.apiEndpoint +
          endpointsApi.mail +
          '/recruiter-validated',
          {
            recruiter: recruiter
          });
      },
      messageCandidate: function (client, candidate, originEmail, messageContent) {
        return $http.post(ENV.apiEndpoint + endpointsApi.mail + '/message-candidate',
          {
            client: client,
            email: originEmail,
            message: messageContent,
            candidate: candidate
          });
      }
    };
  });
