'use strict';

/**
 * @ngdoc function
 * @name visageClientApp.controller:EditjobofferCtrl
 * @description
 * # EditjobofferCtrl
 * Controller of the visageClientApp
 */
angular.module('visageClientApp')

  .controller('EditJobOfferCtrl',
    function ($scope,
      JobOffer,
      $routeParams,
      $location,
      Loader,
      auth,
      user,
      removeTrailingEqualsFilter,
      $interval,
      EMailFactory) {

      function retrieveDraft() {
        if (currentTry < maximumTries) {
          if (!(isRetrieving || isJobLoaded())) {
            isRetrieving = true;
            JobOffer.getOnlyMine({'status': 'Draft', 'userId': user._id}).$promise
              .then(function (jobs) {
                if (jobs[0]) {
                  jobs.sort(function (jobA, jobB) {
                    return new Date(jobB.draftCreatedAt) - new Date(jobA.draftCreatedAt);
                  });
                  loadJob(jobs[0]);
                  $interval.cancel(interval);
                  Loader.globalLoader(false);
                }
              })
              .finally(function () {
                currentTry++;
                isRetrieving = false;
              });
          }
        }
        else {
          $interval.cancel(interval);
          Loader.globalLoader(false);
          $scope.jobNotFound = true;
        }
      }

      function isJobLoaded () {
        return ($scope.job && $scope.job._id);
      }

      function loadJob(job) {
        $scope.job = job;
        $scope.alreadySubmitted =
          (['Draft'].indexOf($scope.job.status) === -1);
      }

      //TODO : Have a normal way to submit a job (Without typeform)
      //function initNewJob() {
      //  $scope.job = new JobOffer();
      //  $scope.job.employer_id =
      //    removeTrailingEqualsFilter(btoa(auth.profile.user_id));
      //  $scope.job.status = 'Draft';
      //}

      $scope.jobSaved = function () {
        debugger;
        EMailFactory.jobConfirmation(user,$scope.job)
          .then(function () {
            $location.path('/employer/jobs');
          });
      };

      var interval;
      var isRetrieving = false;
      var intervalDelay= 2000, maximumTries = 10, currentTry = 0;

      $scope.setHome(false);
      $scope.setForm({
        title: 'Edit job'
      });
      //$scope.setProgress(25);
      Loader.globalLoader(true);

      if ($routeParams.jobId) {
        if ($routeParams.jobId === 'draft') {
          retrieveDraft();
          //try to retrieve the last draft every intervalDelay second
          interval = $interval(retrieveDraft, intervalDelay);
          //cancel interval if leaving page
          $scope.$on('$destroy', function () {
            $interval.cancel(interval);
          });
        }
        else {
          JobOffer.get({_id: $routeParams.jobId}).$promise
            .then(function (job) {
              if(job) {
                loadJob(job);
              }
              else {
                $scope.jobNotFound = true;
              }
            })
            .finally(function () {
              Loader.globalLoader(false);
            });
        }
      }
      //TODO : Have a normal way to submit a job (Without typeform)
      //else {
      //  initNewJob();
      //
      //  Loader.globalLoader(false);
      //}
    })
;

