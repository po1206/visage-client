'use strict';

/**
 * @ngdoc function
 * @name visageClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the visageClientApp
 */
angular.module('visageClientApp')
  .controller('MainCtrl', function ($scope,
    $location,
    auth,
    Preference,
    removeTrailingEqualsFilter,
    $cookies,
    store,
    TempLocalStorage,
    Loader) {

    function initializePreferences() {
      //If url has been requested before
      if (TempLocalStorage.getRequestedUrl() && TempLocalStorage.getRequestedUrl() !== '/') {
        var requested = TempLocalStorage.getRequestedUrl();
        TempLocalStorage.setRequestedUrl(null);
        $location.url(requested);
      }
      else {
        Loader.globalLoader(true);
        Preference.getPreferences().then(function (userPref) {
            var defaultPortal = 'employer';
            var roles = userPref.roles;
            if (roles && roles.length > 0) {
              if (roles.indexOf('recruiter') !== -1) {
                $scope.recruiter = true;
                defaultPortal = 'recruiter';
              }
              if (roles.indexOf('employer') !== -1) {
                $scope.employer = true;
                defaultPortal = 'employer';
              }
              if (roles.indexOf('expert') !== -1) {
                $scope.expert = true;
                defaultPortal = 'expert';
              }

              var lastVisited = $cookies.get('last_visited');
              if (lastVisited) {
                defaultPortal = lastVisited;
              }

              if (defaultPortal === 'employer') {
                $location.path('/employer/jobs');
              }
              else if (defaultPortal === 'recruiter') {
                $location.path('/recruiter/jobs');
              }
              else if (defaultPortal === 'expert') {
                $location.path('/expert/my-jobs');
              }
            }
            else {
              $location.path('/signup');
            }
          })
          .catch(function (err) {
            console.error(err);
          })
          .finally(function () {
            Loader.globalLoader(false);
          });
      }
    }

    initializePreferences();

  });

