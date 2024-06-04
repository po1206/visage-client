'use strict';

/**
 * @ngdoc function
 * @name visageClientApp.controller:ExpertViewJobOfferCtrl
 * @description
 * # ExpertViewJobOfferCtrl
 * Controller of the visageClientApp
 */
angular.module('visageClientApp')
  .controller('ExpertViewJobOfferCtrl', function ($scope,
    JobOffer,
    $routeParams,
    $location,
    ENV,
    endpointsApi,
    Loader,
    $mdToast,
    $window,
    Preference,
    $mdDialog,
    $q,
    user) {

    $scope.download = function (file) {
      $window.open(ENV.apiEndpoint +
        endpointsApi.media +
        '/download/JobDescription/' +
        file.identifier + '?filename=' +
        file.originalFilename, '_blank');
    };

    $scope.evaluateWorkable = function () {
      if ($scope.job.syncedWith) {
        $window.open(JobOffer.getEvaluateUrl($scope.job), '_blank');
      }
    };

    $scope.evaluate = function () {
      $location.path('/expert/job-offer/' + $scope.job._id + '/rate');
    };

    $scope.setHome(false);
    $scope.setForm(null);
    $scope.user = user;
    if ($routeParams.jobId) {
      Loader.globalLoader(true);
      JobOffer.get({_id: $routeParams.jobId}).$promise
        .then(function (jobOffer) {
            $scope.job =jobOffer;
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
