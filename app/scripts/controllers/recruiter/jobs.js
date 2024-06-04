'use strict';

/**
 * @ngdoc function
 * @name visageClientApp.controller:RecruiterJobsCtrl
 * @description
 * # RecruiterJobsCtrl
 * Controller of the visageClientApp
 */
angular.module('visageClientApp')
  .controller('RecruiterJobsCtrl', function ($scope, JobOffer, $location, user) {
    $scope.setHome(false);
    $scope.setForm(false);
    $scope.setProgress(null);
    var newThresholdInDays = 3;

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

    $scope.user = user;

    JobOffer.getSourcingJobs().then(
      function (sourcingJobs) {

        if (sourcingJobs && sourcingJobs.length > 0) {
          $scope.jobsData = {};
          sourcingJobs.forEach(function (job) {
            if (moment(job.launchedAt) > moment().subtract(newThresholdInDays, 'days')) {
              job.new = true;
            }
            if (!$scope.jobsData[job.location]) {
              $scope.jobsData[job.location] = [];
            }
            $scope.jobsData[job.location].push(job);
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

  });
