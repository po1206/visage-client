'use strict';

/**
 * @ngdoc function
 * @name visageClientApp.controller:ExpertRateCandidateCtrl
 * @description
 * # ExpertRateCandidateCtrl
 * Controller of the visageClientApp
 */
angular.module('visageClientApp')
  .controller('ExpertRateCandidateCtrl',
    function ($scope,
      CandidateSubmission,
      JobOffer,
      $routeParams,
      $q,
      apiSettings,
      user) {

      $scope.refreshSubmissions = function () {
        var queriesByStatus = ['Sourced', 'Approved', 'Disqualified'].reduce(function (queriesByStatus, status) {
          queriesByStatus[status] = CandidateSubmission.queryByJob({
            jobId: $routeParams.jobId,
            status: status,
            limit: apiSettings.candidatesReviewLimit
          }).$promise;
          return queriesByStatus;
        }, {});

        var countQueriesByStatus = ['Sourced', 'Approved', 'Disqualified'].reduce(function (countQueriesByStatus, status) {
          countQueriesByStatus[status] = CandidateSubmission.queryByJobCount({
            jobId: $routeParams.jobId,
            status: status
          }).$promise;
          return countQueriesByStatus;
        }, {});


        var promiseJob = JobOffer.get({_id: $routeParams.jobId}).$promise
          .then(function (result) {
            $scope.job = result;
          });
        var promisesQueries = $q.all(queriesByStatus)
          .then(function (resultQueries) {
            $scope.candidateSubmissions = resultQueries;
            //$scope.selectedCandidateSubmission.selected = $scope.candidateSubmissions[0] ||
            // null;
          });

        var promisesCountQueries = $q.all(countQueriesByStatus)
          .then(function (resultQueries) {
            if (resultQueries.Sourced !== undefined && resultQueries.Approved !== undefined) {
              $scope.indicators = {
                pendingCVs: resultQueries.Sourced.count,
                approvedCVs: resultQueries.Approved.count
              };

            }
            $scope.candidateSubmissionsCount = Object.keys(resultQueries).reduce(function(previous, current) {
              previous[current] = resultQueries[current].count;
              return previous;
            }, {});
          });

        return $q.all([promiseJob,promisesQueries, promisesCountQueries]);
      };

      $scope.highlightCandidate = function(candidateSubmission) {
        $scope.selectedCandidateSubmission.selected = candidateSubmission;
      };

      $scope.refreshSubmissions();

      $scope.selectedCandidateSubmission = {};
      $scope.isOpen = false;
      $scope.user = user;
    });
