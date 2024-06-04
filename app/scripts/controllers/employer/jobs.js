'use strict';

/**
 * @ngdoc function
 * @name visageClientApp.controller:JobsCtrl
 * @description
 * # JobsCtrl
 * Controller of the visageClientApp
 */
angular.module('visageClientApp')
  .controller('EmployerJobsCtrl', function ($scope, JobOffer, $location) {

    $scope.setHome(false);
    $scope.setForm(false);
    //$scope.setProgress(25);

    $scope.newJobOffer = function () {
      $location.path('/employer/job-offer/edit');
    };

    $scope.viewJob = function (job) {
      var route;
      switch (job.status) {
        case 'Draft':
          route = '/employer/job-offer/' + job._id + '/edit';
          break;
        case 'LonglistReady':
          route = '/employer/job-offer/' + job._id + '/candidates/Approved';
          break;
        case 'Calibrated':
          route = '/employer/job-offer/' + job._id + '/candidates';
          break;
        case 'ShortlistReady':
          route = '/employer/job-offer/' + job._id + '/candidates/Shortlisted';
          break;
        default:
          route = '/employer/job-offer/' + job._id;
          break;
      }
      $location.path(route);
    };

    $scope.checkout = function () {
      if ($scope.payment) {
        $location.path('/employer/checkout');
      }
    };

    $scope.pendingJobs = 'indeterminate';
    // Form data for the post job process
    JobOffer.queryAll().$promise.then(
      function (results) {
        if (results && results.length > 0) {
          $scope.jobsData = {
            'Calibrated' : {
              label : 'Review sample profiles',
              items :[]
            },
            'LonglistReady' : {
              label : 'Review crowsourced profiles',
              items :[]
            },
            'ShortlistReady' : {
              label : 'Review applicants',
              items :[]
            },
            'Draft' : {
              label : 'Draft',
              items :[]
            },
            'Approved' : {
              label : 'Preparing your profiles sample ',
              items :[]
            },
            'Validated' : {
              label : 'Sourcing for candidates',
              items :[]
            },
            'Closed' : {
              label : 'Closed',
              items :[]
            }
          };
          results.forEach(function (job) {
            $scope.jobsData[job.status].items.push(job);
            //if ((job.status === 'Validated' || job.status === 'ShortlistReady') && !job.paid) {
            //  $scope.payment = true;
            //  if (!$scope.jobsData.cart) {
            //    $scope.jobsData.cart = [];
            //  }
            //  $scope.jobsData.cart.push(job);
            //}
            //else if (!job.paid) {
            //  if (!$scope.jobsData.saved) {
            //    $scope.jobsData.saved = [];
            //  }
            //  $scope.jobsData.saved.push(job);
            //}
            //else {
            //  if (!$scope.jobsData.running) {
            //    $scope.jobsData.running = [];
            //  }
            //  $scope.jobsData.running.push(job);
            //}
            if (job.status === 'Draft') {
              $scope.drafts = true;
            }
            if (job.status === 'Approved') {
              $scope.calibrating = true;
            }
            if (job.status === 'Validated') {
              $scope.talent = true;
            }
            if (job.status=== 'ShortlistReady' || job.status=== 'Closed') {
              $scope.shortlist = true;
            }
          });
          for(var key in $scope.jobsData) {
            if($scope.jobsData[key].items.length ===0) {
              delete $scope.jobsData[key];
            }
          }
        }
        $scope.pendingJobs = null;
      },
      function (err) {
        console.error(err);
        $scope.pendingJobs = null;
      }
    );

    //$timeout(function () {
    //
    //  ShepherdService.addStep('add-job-offer', {
    //    title: 'Add job offer',
    //    text: 'Tap here to add a job!',
    //    attachTo: '#add-job-offer-btn bottom',
    //    buttons: [
    //      {
    //        text: 'Cancel',
    //        action: ShepherdService.cancel
    //      },
    //      {
    //        text: 'Next',
    //        action: ShepherdService.next
    //      }
    //    ]
    //  });
    //
    //  ShepherdService.addStep('add-job-offer', {
    //    title: 'Publish',
    //    text: 'When you are done, just hit the publish button',
    //    attachTo: '#publish-button top',
    //    buttons: [
    //      {
    //        text: 'Cancel',
    //        action: ShepherdService.cancel
    //      },
    //      {
    //        text: 'Next',
    //        action: ShepherdService.next
    //      }
    //    ]
    //  });
    //
    //  ShepherdService.addStep('logout', {
    //    title: 'Logout',
    //    text: 'You can access your profile and log out by taping this button.<br> All your non
    // submitted job offers will be removed.', attachTo: '#account-menu bottom', buttons: [ { text:
    // 'Got it!', action: ShepherdService.complete } ] });  ShepherdService.start(); }, 0)

  });
