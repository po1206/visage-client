'use strict';

/**
 * @ngdoc function
 * @name visageClientApp.controller:ExpertMyJobsCtrl
 * @description
 * # ExpertMyJobsCtrl
 * Controller of the visageClientApp
 */
angular.module('visageClientApp')
  .controller('ExpertMyJobsCtrl',
    function ($scope, JobOffer, $location, auth, removeTrailingEqualsFilter, ExpertAssignment, $window, CandidateSubmission) {

      function loadPendingCVs (job) {
        CandidateSubmission.queryByJobCount({jobId:job._id, status:'Sourced'})
          .$promise
          .then(function (result) {
            $scope.pendingCVs[job._id] = result.count;
          });
      }

      function loadAssignments() {
        // Form data for the post job process
        ExpertAssignment
          .queryByExpert({
            id: removeTrailingEqualsFilter(btoa(auth.profile.user_id))
          })
          .$promise.then(
          function (assignments) {
            if (assignments && assignments.length > 0) {
              $scope.activeAssignmentsByLocation = {};
              $scope.inactiveAssignmentsByLocation = {};
              $scope.inactives = false;
              $scope.actives = false;
              assignments.forEach(function (assignment) {
                var job = assignment.job;
                loadPendingCVs(job);
                if(!job.launched || job.status ==='Closed') {
                  $scope.inactives = true;
                  if (!$scope.inactiveAssignmentsByLocation[job.location]) {
                    $scope.inactiveAssignmentsByLocation[job.location] = [];
                  }
                  $scope.inactiveAssignmentsByLocation[job.location].push(assignment);
                }
                else {
                  $scope.actives = true;
                  if (!$scope.activeAssignmentsByLocation[job.location]) {
                    $scope.activeAssignmentsByLocation[job.location] = [];
                  }
                  $scope.activeAssignmentsByLocation[job.location].push(assignment);
                }
              });
            }
          },
          function (err) {
            console.error(err);
          }
          )
          .finally(function () {
            $scope.pendingJobs = null;
          });
      }

      $scope.setHome(false);
      $scope.setForm(false);
      $scope.setProgress(null);

      $scope.pendingJobs = 'indeterminate';
      $scope.pendingCVs = {};


      $scope.viewJob = function (job) {
        var route;
        switch (job.status) {
          default:
            route = '/expert/job-offer/' + job._id;
            break;
        }
        $location.path(route);
      };

      $scope.evaluateWorkable = function (job) {
        if(job.syncedWith){
          $window.open(JobOffer.getEvaluateUrl(job),'_blank');
        }
      };
      $scope.evaluate = function (job) {
        $location.path('/expert/job-offer/' + job._id + '/rate');
      };


      loadAssignments();

    });
