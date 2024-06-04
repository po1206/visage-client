'use strict';

/**
 * @ngdoc function
 * @name visageClientApp.controller:RecruiterReferCandidateCtrl
 * @description
 * # RecruiterReferCandidateCtrl
 * Controller of the visageClientApp
 */
angular.module('visageClientApp')
  .controller('RecruiterReferCandidateCtrl',
    function ($scope,
      CandidateSubmission,
      RecruiterAssignment,
      JobOffer,
      $location,
      $routeParams,
      $q,
      user,
      apiSettings,
      RecruiterSubmission) {
      function refreshSubmissions() {

        var queriesByStatus = ['Sourced', 'Approved',
          'Disqualified'].reduce(function (queriesByStatus, status) {
          queriesByStatus[status] = CandidateSubmission.queryByJob({
            jobId: $routeParams.jobId,
            recruiter: $scope.user._id,
            status: status,
            limit: apiSettings.candidatesReviewLimit
          }).$promise;
          return queriesByStatus;
        }, {});

        var recruiterSubmissionsPromise = RecruiterSubmission.query({
            recruiterId: $scope.user._id,
            jobs: $routeParams.jobId
          })
          .$promise
          .then(function (allRecruiterSubmissions) {
            $scope.candidateSubmissionsCount = {};
            allRecruiterSubmissions.forEach(function (recruiterSubmissions) {
              if (recruiterSubmissions._id.status === 'Sourced') {
                $scope.indicators.pendingCVs = recruiterSubmissions.count;
                $scope.candidateSubmissionsCount.Sourced = recruiterSubmissions.count;
              }
              if (recruiterSubmissions._id.status === 'Approved') {
                $scope.indicators.approvedCVs = recruiterSubmissions.count;
                $scope.candidateSubmissionsCount.Approved = recruiterSubmissions.count;
              }
              if (recruiterSubmissions._id.status === 'Disqualified') {
                $scope.candidateSubmissionsCount.Disqualified = recruiterSubmissions.count;
              }
            });
            return true;
          });

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

        return $q.all([promiseJob, promisesQueries, recruiterSubmissionsPromise]);
      }

      function refreshSubscription() {
        return RecruiterAssignment.queryByJob({
            id: $routeParams.jobId,
            recruiter: $scope.user._id
          })
          .$promise
          .then(function (result) {
            $scope.subscribed = !!result[0] && !!result[0]._id;
            $scope.assignment = result[0];
          });
      }

      $scope.refreshSubmissionsAndSubscription = function () {
        $q.all([refreshSubmissions(), refreshSubscription()])
          .then(function () {
            $scope.indicators.slots =
              $scope.assignment.maxSlots -
              $scope.indicators.pendingCVs;
          });
      };

      $scope.isOpen = false;
      $scope.user = user;

      $scope.indicators = {
        pendingCVs: 0,
        approvedCVs: 0
      };
      $scope.selectedCandidateSubmission = {};

      $scope.viewJob = function () {
        $location.path('/recruiter/job-offer/' + $scope.job._id);
      };

      CandidateSubmission.generateReportSign({
          jobId: $routeParams.jobId,
          recruiter: $scope.user._id
        })
        .$promise
        .then(function (urlObject) {
          $scope.csvDownloadUrl = urlObject.signedUrl;
        });

      $scope.refreshSubmissionsAndSubscription();
    });
