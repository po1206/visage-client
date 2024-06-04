'use strict';

/**
 * @ngdoc function
 * @name visageClientApp.controller:EmployerReviewCandidatesCtrl
 * @description
 * # EmployerReviewCandidatesCtrl
 * Controller of the visageClientApp
 */
angular.module('visageClientApp')
  .controller('EmployerReviewCandidatesCtrl',
    function ($scope,
      CandidateSubmission,
      JobOffer,
      $routeParams,
      $q,
      user,
      Loader,
      $location,
      $window,
      OrderService,
      apiSettings) {

      function validateCalibration() {
        $scope.validatingCalibration = {loading: 'indeterminate'};
        //new javascript loop to display the walkthrough end before updating the job
        $scope.$applyAsync(function () {
          OrderService.validateJob($scope.job)
            .finally(function () {
              $scope.validatingCalibration.loading = null;
            });
        });
      }

      $scope.employerHome = function () {
        $location.path('/employer');
      };

      $scope.refreshSubmissions = function () {
        var queriesByStatus = $scope.status.reduce(function (queriesByStatus, status) {
          queriesByStatus[status] = CandidateSubmission.queryByJob({
            jobId: $routeParams.jobId,
            status: status,
            limit: apiSettings.candidatesReviewLimit
          }).$promise;
          return queriesByStatus;
        }, {});

        var countQueriesByStatus = $scope.status.reduce(function (countQueriesByStatus, status) {
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

        return $q.all([promiseJob,promisesQueries, promisesCountQueries])
          .then(function () {
            //TODO validate that on the backend
            if ($scope.job.status === 'Calibrated' && $scope.candidateSubmissionsCount.Sourced.count === 0) {
              validateCalibration();
            }
            return true;
          })
          .finally(function () {
            Loader.globalLoader(false);
          });
      };

      $scope.viewJob = function () {
        $location.path('/employer/job-offer/' + $scope.job._id);
      };

      $scope.highlightCandidate = function (candidateSubmission) {
        $scope.selectedCandidateSubmission.selected = candidateSubmission;
      };

      $scope.isOpen = false;
      $scope.user = user;
      $scope.status = ($routeParams.status) ? [$routeParams.status] : ['Sourced', 'Approved'];

      var reportQuery = {
        jobId: $routeParams.jobId,
        status: $scope.status
      };

      Loader.globalLoader(true);
      $scope.refreshSubmissions();

      $scope.selectedCandidateSubmission = {};

      CandidateSubmission.generateReportSign(reportQuery)
        .$promise
        .then(function (urlObject) {
          $scope.csvDownloadUrl = urlObject.signedUrl;
        });
    });
