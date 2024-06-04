'use strict';

/**
 * @ngdoc function
 * @name visageClientApp.controller:RecruiterViewJobOfferCtrl
 * @description
 * # RecruiterViewJobOfferCtrl
 * Controller of the visageClientApp
 */
angular.module('visageClientApp')
  .controller('RecruiterViewJobOfferCtrl', function ($scope,
    JobOffer,
    $routeParams,
    $location,
    ENV,
    endpointsApi,
    Loader,
    $mdToast,
    $window,
    RecruiterAssignment,
    RecruiterSubmission,
    Preference,
    $mdDialog,
    $mdMedia,
    user,
    $q) {

    var refreshSubscription = function () {
      $q.all({
          recruiterAssignment: RecruiterAssignment.queryByJob({
            id: $routeParams.jobId,
            recruiter: $scope.user._id
          })
            .$promise,
          recruiterSubmission: RecruiterSubmission.query({
            recruiterId: user._id,
            jobs: $routeParams.jobId
          })
            .$promise
        })
        .then(function (results) {
          var recruiterAssignments = results.recruiterAssignment;
          var recruiterSubmissions = results.recruiterSubmission;

          $scope.subscribed = !!recruiterAssignments[0] && !!recruiterAssignments[0]._id;
          $scope.assignment = recruiterAssignments[0];
          recruiterSubmissions.forEach(function (recruiterSubmissions) {
            if (recruiterSubmissions._id.status === 'Sourced') {
              $scope.indicators.pendingCVs = recruiterSubmissions.count;
            }
            if (recruiterSubmissions._id.status === 'Approved') {
              $scope.indicators.approvedCVs = recruiterSubmissions.count;
            }
          });

          $scope.indicators.slotsLeft =
            $scope.assignment.maxSlots -
            $scope.indicators.approvedCVs -
            $scope.indicators.pendingCVs;
        });
    };

    var showConfirm = function () {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .title('Claim this job')
        .textContent('By subscribing to this job you agree on submitting at least 5 CVs.')
        .ariaLabel('Claim this job')
        .ok('Accept')
        .cancel('Cancel');
      return $mdDialog.show(confirm);
    };

    $scope.subscribe = function () {
      Loader.globalLoader(true);
      $scope.assignment = new RecruiterAssignment();
      $scope.assignment.job = $scope.job._id;
      $scope.assignment.recruiter = $scope.user._id;
      return $scope.assignment.$save({id: $scope.job._id, path: 'job-offers'}).then(function () {
          refreshSubscription();
          $mdToast.show(
            $mdToast.simple()
              .textContent('You subscribed to this job')
              .position('top right')
              .hideDelay(3000)
          );
        },
        function (err) {
          console.error(err);
          console.error('There was an error subscribing to this job');
        })
        .finally(function () {
          Loader.globalLoader(false);
        });
    };

    $scope.download = function (file) {
      $window.open(ENV.apiEndpoint +
        endpointsApi.media +
        '/download/JobDescription/' +
        file.identifier + '?filename=' +
        file.originalFilename, '_blank');
    };

    $scope.referWorkable = function () {
      if ($scope.job.syncedWith) {
        $window.open(JobOffer.getReferralUrl($scope.job), '_blank');
      }
    };

    $scope.refer = function () {
      $location.path('/recruiter/job-offer/' + $scope.job._id + '/refer');
    };

    $scope.setHome(false);
    $scope.setForm(null);

    $scope.user = user;
    if ($routeParams.jobId) {
      $scope.subscribed = false;
      Loader.globalLoader(true);

      $scope.indicators = {
        pendingCVs: 0,
        approvedCVs: 0
      };

      refreshSubscription();
      JobOffer.get({_id: $routeParams.jobId}).$promise
        .then(function (jobOffer) {
            $scope.job = jobOffer;
          },
          function (err) {
            console.error(err);
          })
        .finally(function () {
          Loader.globalLoader(false);
        });
    }
    else {
      $scope.notFound = true;
    }

  });
