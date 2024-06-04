'use strict';

/**
 * @ngdoc function
 * @name visageClientApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the visageClientApp
 */
angular.module('visageClientApp')
  .controller('SignupCtrl', function ($scope,
    $location) {

    //var initTypeForm = function () {
    //  var js, q, d = document, gi = d.getElementById, ce = d.createElement, gt =
    // d.getElementsByTagName, id = 'typef_orm', b =
    // 'https://s3-eu-west-1.amazonaws.com/share.typeform.com/'; if (!gi.call(d, id)) { js =
    // ce.call(d, 'script'); js.id = id; js.src = b + 'share.js'; q = gt.call(d, 'script')[0];
    // q.parentNode.insertBefore(js, q); }  angular.element($window).on('message', function (ev) {
    // $scope.$apply(function () { if (ev.data === 'form-submit') {
    // angular.element(document.querySelector('.event_not_yet')).css('display', 'none');
    // angular.element(document.querySelector('.event_submitted')).css('display', 'none');
    // $location.path('/'); } }); });  };

    $scope.employer = function () {
      $location.path('/employer');
    };

    $scope.recruiter = function () {
      $location.path('/recruiter');
    };

    $scope.candidate = function () {
      $location.path('/candidate');
    };

    $scope.setHome(true);
    $scope.setForm({
      title: 'Sign up'
    });
    $scope.setProgress(0);

    $scope.recruiterImagePath = 'images/freecruiters.png';
    $scope.employerImagePath = 'images/employers.png';

    //initTypeForm();
  });
