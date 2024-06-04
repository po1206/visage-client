'use strict';

/**
 * @ngdoc service
 * @name visageClientApp.JobOffer
 * @description
 * # JobOffer
 * Factory in the visageClientApp.
 */
angular.module('visageClientApp')
  .factory('JobOffer', function (cachedResource,
    endpointsApi,
    ENV,
    $q,
    auth,
    removeTrailingEqualsFilter) {

    var JobOffer = cachedResource(ENV.apiEndpoint +
      '/:path/:userId' +
      endpointsApi.jobOffers +
      '/:state/:_id',
      {_id: '@_id'}, {
        getOnlyMine: {
          method: 'GET',
          params: {
            path: 'users',
            userId: '@userId'
          },
          isArray: true
        },
        queryByState: {
          method: 'GET',
          params: {
            state: '@state'
          },
          isArray: true
        }
      });

    var getJobsByStatus = function (status) {
      var defered = $q.defer();
      JobOffer.queryAll().$promise.then(function (results) {
        defered.resolve(results.filter(function (job) {
          return (job.status === status);
        }, function (err) {
          defered.reject(err);
        }));
      });
      //just for consistency with $resource API
      return {
        $promise: defered.promise
      };
    };

    return angular.extend(JobOffer,
      {
        queryAll: function (params) {
          var baseParams = {userId: removeTrailingEqualsFilter(btoa(auth.profile.user_id))};
          if (params) {
            baseParams = angular.extend(baseParams, params);
          }
          return JobOffer.getOnlyMine(baseParams);
        },
        getSourcingJobs: function () {
          return JobOffer.queryByState({state: 'active', launched: true, sourcing: true}).$promise;
        },
        getUnpaids: function () {
          var defered = $q.defer();
          JobOffer.queryAll({paid: ''}).$promise.then(function (results) {
              defered.resolve(results);
            },
            function (err) {
              defered.reject(err);
            });
          //just for consistency with $resource API
          return {
            $promise: defered.promise
          };
        },
        getWorkableId: function (job) {
          if (job.syncedWith) {
            var arraySplit = job.syncedWith.url.split('/');
            return arraySplit.pop();
          }
        },
        getEvaluateUrl : function (job) {
          return 'https://visage.workable.com/backend/jobs/'+
            JobOffer.getWorkableId(job)+
            '/browser/sourced';
        },
        getReferralUrl : function (job) {
          return 'https://visage.workable.com/backend/jobs/'+
            JobOffer.getWorkableId(job)+
            '/browser/sourced';
        }
      }
    );
  });
