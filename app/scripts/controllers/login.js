'use strict';

/**
 * @ngdoc function
 * @name visageClientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the visageClientApp
 */
angular.module('visageClientApp')
  .controller('LoginCtrl', function ($scope,
    $http,
    auth,
    store,
    $location,
    CustomerService,
    TempLocalStorage,
    UserBehavior,
    Preference,
    Loader) {

    var originatorEv;

    var refreshProfile = function (profile) {
      $scope.profile = profile;
    };

    var storeCredentials = function (profile, token) {
      store.set('profile', profile);
      store.set('token', token);
    };

    var loadUser = function (profile, token) {
      Loader.globalLoader(true);
      storeCredentials(profile, token);
      refreshProfile(profile);
      Preference.loadBasicInfos()
        .then(function () {
          $location.path('/');
        })
        .finally(function () {
          Loader.globalLoader(false);
        });
    };

    var loginSuccess = function (profile, token) {
      UserBehavior.boot();
      loadUser(profile, token);
    };

    $scope.login = function () {
      auth.signin({
        primaryColor: '#0fc48b',
        icon: 'images/Visage_white_logo.svg',
        socialBigButtons: true,
        authParams: {
          scope: 'openid email'
        }
      }, function (profile, token) {
        loginSuccess(profile, token);
      }, function (resp) {
        console.error(resp.data);
      });
    };

    $scope.signUp = function () {
      auth.signup({
        primaryColor: '#0fc48b',
        icon: 'images/Visage_white_logo.svg',
        socialBigButtons: true,
        authParams: {
          scope: 'openid email'
        }
      }, function (profile, token) {
        loginSuccess(profile, token);
      }, function (resp) {
        console.error(resp.data);
      });
    };

    $scope.logout = function () {
      TempLocalStorage.destroy();
      auth.signout();
      UserBehavior.shutDown();
      store.remove('profile');
      store.remove('token');
      refreshProfile(null);
      $location.path('/login');
    };

    $scope.openMenu = function ($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    $scope.goToProfile = function () {
      if ($scope.portalType === 'employer') {
        $location.path('/employer/profile');
      }
      else if ($scope.portalType === 'recruiter') {
        $location.path('/recruiter/profile');
      }
      else if ($scope.portalType === 'expert') {
        $location.path('/expert/profile');
      }
    };

    $scope.goToEmployer = function () {
      $location.path('/employer');
    };

    $scope.goToRecruiter = function () {
      $location.path('/recruiter');
    };

    $scope.$on('visage.logout', function () {
      $scope.logout();
    });

    $scope.$on('visage.promptLogin', function () {
      $scope.login();
    });

    $scope.$on('visage.login', function () {
      auth.profilePromise
        .then(function (profile) {
          loadUser(profile, auth.idToken);
        });
    });

    refreshProfile(auth.profile);
  });
