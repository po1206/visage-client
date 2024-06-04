'use strict';

/**
 * @ngdoc function
 * @name visageClientApp.controller:NewJobOfferCtrl
 * @description
 * # NewJobOfferCtrl
 * Controller of the visageClientApp
 */
angular.module('visageClientApp')

  .controller('NewJobOfferCtrl',
    function ($scope, auth,
      ENVClient,
      user,
      $location,
      $timeout) {

      function handleSubmission(event) {
        if(event.data === 'form-submit') {
          $timeout(function () {
            $location.path('/employer/job-offer/draft/edit');
          },3000);
        }
      }

      function bindListeners() {
        window.addEventListener('message', handleSubmission, false);

        $scope.$on('$destroy', function () {
          window.removeEventListener('message', handleSubmission, false);
        });
      }

      $scope.typeformNewJobSrc =
        'https://visagejobs.typeform.com/to/' + ENVClient.ThirdParties.Typeform.newJob.id +
        '?name=' + user.name + '&id=' + user._id + '&jwt=' + auth.idToken + '&embed=full';

      bindListeners();
    });

