'use strict';

/**
 * @ngdoc function
 * @name visageClientApp.controller:EmployerViewjobofferCtrl
 * @description
 * # EmployerViewjobofferCtrl
 * Controller of the visageClientApp
 */
angular.module('visageClientApp')
  .controller('ViewJobOfferCtrl',
    function ($scope,
      JobOffer,
      $routeParams,
      $location,
      ENV,
      endpointsApi,
      Loader,
      $mdToast,
      $window) {

      $scope.download = function (file) {
        $window.open(ENV.apiEndpoint +
          endpointsApi.media +
          '/download/JobDescription/' +
          file.identifier +
          '?filename=' +
          file.originalFilename, '_blank');
      };

      $scope.editJob = function () {
        $location.path('/employer/job-offer/' + $scope.job._id + '/edit');
      };

      $scope.checkout = function () {
        $location.path('/employer/checkout');
      };

      $scope.viewShortlist = function () {
        $location.path('/employer/job-offer/' + $scope.job._id + '/candidates/Shortlisted');
      };

      $scope.setHome(false);
      $scope.setForm(null);

      $scope.jobId = $routeParams.jobId;
      $scope.viewCandidatesSourcedPath =
        '/employer/job-offer/' + $scope.jobId + '/candidates/';
      $scope.viewCandidatesApprovedPath =
        '/employer/job-offer/' + $scope.jobId + '/candidates/Approved';
      $scope.viewCandidatesShortlistedPath =
        '/employer/job-offer/' + $scope.jobId + '/candidates/Shortlisted';
      if ($routeParams.jobId) {
        $scope.pending = 'indeterminate';
        JobOffer.get({_id: $routeParams.jobId}).$promise.then(function (job) {
            $scope.job = job;
          },
          function (err) {
            console.error(err);
          })
          .finally(function () {
            $scope.pending = null;
          });
      }
      else {
        $scope.notFound = true;
      }

    });
