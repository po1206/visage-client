'use strict';

/**
 * @ngdoc function
 * @name visageClientApp.controller:RecruiterMyJobsCtrl
 * @description
 * # RecruiterMyJobsCtrl
 * Controller of the visageClientApp
 */
angular.module('visageClientApp')
  .controller('RecruiterMyJobsCtrl',
    function ($scope, JobOffer, $location, RecruiterAssignment, auth,
      removeTrailingEqualsFilter, $window,
      $mdMedia,
      $mdDialog,
      user,
      RecruiterSubmission) {

      function loadSubmissionsStatus(results) {
        results.forEach(function (recruiterSubmission) {
          if (recruiterSubmission._id.status === 'Sourced') {
            $scope.allActiveAssignments[recruiterSubmission._id.job].pendingCVs =
              recruiterSubmission.count;
          }
          else if (recruiterSubmission._id.status === 'Approved') {
            $scope.allActiveAssignments[recruiterSubmission._id.job].approvedCVs =
              recruiterSubmission.count;
          }
        });
      }

      $scope.setHome(false);
      $scope.setForm(false);
      $scope.setProgress(null);

      $scope.pendingJobs = 'indeterminate';

      $scope.viewJob = function (job) {
        var route;
        switch (job.status) {
          default:
            route = '/recruiter/job-offer/' + job._id;
            break;
        }
        $location.path(route);
      };

      $scope.getSlotsLeft = function (assignment) {
        return assignment.maxSlots -
        assignment.approvedCVs -
        assignment.pendingCVs ;
      };

      $scope.referWorkable = function (event, assignment) {
        if (assignment.job.syncedWith) {
          $window.open(JobOffer.getReferralUrl(assignment.job), '_blank');
        }
      };

      $scope.refer = function (ev, assignment) {
        $location.path('/recruiter/job-offer/' + assignment.job._id + '/refer');
      };

      $scope.user = user;
      // Form data for the post job process
      RecruiterAssignment
        .queryByRecruiter({
          id: removeTrailingEqualsFilter(btoa(auth.profile.user_id))
        })
        .$promise.then(
        function (assignments) {
          if (assignments && assignments.length > 0) {
            $scope.activeAssignmentsByLocation = {};
            $scope.inactiveAssignmentsByLocation = {};
            $scope.allActiveAssignments = {};
            $scope.allActiveJobsId = [];
            $scope.actives = false;
            $scope.inactives = false;
            assignments.forEach(function (assignment) {
              var job = assignment.job;
              if (!job.launched || job.sourcing === false || job.status === 'Closed') {
                $scope.inactives = true;
                if (!$scope.inactiveAssignmentsByLocation[job.location]) {
                  $scope.inactiveAssignmentsByLocation[job.location] = [];
                }
                $scope.inactiveAssignmentsByLocation[job.location].push(assignment);
              }
              else {
                $scope.actives = true;
                $scope.allActiveAssignments[job._id] = assignment;
                $scope.allActiveJobsId.push(job._id);
                //FIXME We will update the database in the next release
                assignment.pendingCVs=0;
                assignment.approvedCVs=0;

                if (!$scope.activeAssignmentsByLocation[job.location]) {
                  $scope.activeAssignmentsByLocation[job.location] = [];
                }
                $scope.activeAssignmentsByLocation[job.location].push(assignment);
              }
            });

            RecruiterSubmission.query({
                recruiterId: user._id,
                jobs: $scope.allActiveJobsId
              })
              .$promise
              .then(loadSubmissionsStatus);

          }
        },
        function (err) {
          console.error(err);
        }
        )
        .finally(function () {
          $scope.pendingJobs = null;
        });

    });
