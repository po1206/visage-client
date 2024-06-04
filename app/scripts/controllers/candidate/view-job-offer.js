'use strict';

/**
 * @ngdoc function
 * @name visageClientApp.controller:CandidateViewJobOfferCtrl
 * @description
 * # CandidateViewJobOfferCtrl
 * Controller of the visageClientApp
 */
angular.module('visageClientApp')
  .controller('CandidateViewJobOfferCtrl', function ($scope,
    $http,
    $routeParams,
    $location,
    ENV,
    endpointsApi,
    Loader,
    $mdToast,
    $window,
    RecruiterAssignment,
    Preference,
    $mdDialog,
    $mdMedia) {

    $scope.apply = function (ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
      $mdDialog.show({
          controller: 'SubmitCandidateDialogCtrl',
          templateUrl: 'views/submit-candidate-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          fullscreen: useFullScreen,
          locals: {
            job: $scope.job,
            referrer : null,
            indicators : null
          }
        })
        .then(function () {
          $scope.job.justApplied = true;
        })
        .catch(function (err) {
          console.error('Unable to submit this candidate');
          console.error(err);
        });

      $scope.$watch(function () {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function (wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });

    };
    $scope.setHome(false);
    $scope.setForm(null);

    $scope.isValidated = false;

    if ($routeParams.jobId) {
      $scope.subscribed = false;
      Loader.globalLoader(true);
      $http.get(ENV.apiEndpoint + endpointsApi.publicJobOffers + '/' + $routeParams.jobId)
        .then(function (result) {
            $scope.job = result.data;
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
