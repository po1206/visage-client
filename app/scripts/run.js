'use strict';

/**
 * Created by manu on 1/5/16.
 */
angular.module('visageClientApp')
  .run(function ($rootScope,
    TempLocalStorage,
    $location,
    $window,
    auth,
    store,
    jwtHelper,
    $mdSidenav,
    $mdMedia,
    UserBehavior,
    Loader,
    Preference,
    $cookies) {

    function bindHeaderScrollFeature() {
      window.addEventListener('scroll', function () {
        var distanceY = window.pageYOffset || document.documentElement.scrollTop,
          shrinkOn = 100,
          headerElem = angular.element(document.querySelector('header')),
          fabs = angular.element(document.querySelector('.md-fab'));

        if (distanceY > shrinkOn) {
          headerElem.addClass('smaller');
          fabs.addClass('higher');
        }
        else {
          headerElem.removeClass('smaller');
          fabs.removeClass('higher');
        }
      });
    }

    function bindListeners() {
      $rootScope.$on('loading:show', function () {
        $rootScope.globalLoading = true;
      });
      $rootScope.$on('loading:hide', function () {
        $rootScope.globalLoading = false;
      });
    }

    bindHeaderScrollFeature();
    bindListeners();

    $rootScope.globalLoading = false;

    $rootScope.setProgress = function (value) {
      $rootScope.progress = value;
    };

    $rootScope.setHome = function (isHome) {
      $rootScope.home = isHome;
    };

    $rootScope.setForm = function (isForm) {
      $rootScope.form = isForm;
    };

    $rootScope.setEmail = function (email) {
      $rootScope.email = email;
    };

    $rootScope.isAuthenticated = function () {
      return auth.isAuthenticated;
    };

    // This events gets triggered on refresh or URL change
    $rootScope.$on('$locationChangeStart', function () {
      var requestedUrl = $location.url();
      if (requestedUrl.lastIndexOf('/login', 0) !==
        0 &&
        requestedUrl.lastIndexOf('/candidate', 0) !==
        0) {
        var token = store.get('token');
        if (token) {
          if (!jwtHelper.isTokenExpired(token)) {
            if (!auth.isAuthenticated) {
              auth.authenticate(store.get('profile'), token);
              //do not launch intercom if impersonated
              if (!auth.profile.impersonated) {
                UserBehavior.boot();
              }
            }
          }
          else {
            TempLocalStorage.setRequestedUrl(requestedUrl);
            // Either show the login page or use the refresh token to get a new idToken
            $location.path('/login');
          }
        }
        else {
          TempLocalStorage.setRequestedUrl(requestedUrl);
        }
      }
    });

    $rootScope.$on('$routeChangeSuccess', function () {
      dataLayer.push({
        event: 'ngRouteChange',
        attributes: {
          route: $location.path()
        }
      });

    });

    $rootScope.$on('$routeChangeStart', function (event, next) {
      TempLocalStorage.save();
      var path = next.originalPath;
      if (path) {
        if (path.lastIndexOf('/login', 0) !== 0 && path.lastIndexOf('/candidate', 0) !== 0) {
          //logout user if missing the basic infos in DB
          Preference.isBasicInfosLoaded()
            .then(function (isBasicInfosLoaded) {
              if (!isBasicInfosLoaded) {
                $location.search('logout', true);
                $location.path('/login');
              }
            });
        }
        if (path.lastIndexOf('/employer') === 0) {
          $rootScope.portalType = 'employer';
          if (path.lastIndexOf('/employer/profile') !== 0) {
            Preference.isEmployerProfileCompleted().then(function (isProfileCompleted) {
              if (isProfileCompleted) {
                $cookies.put('last_visited', 'employer');
              }
              else {
                $location.path('/employer/profile');
              }
            }, function (err) {
              console.error(err);
            });
          }
          $cookies.put('last_visited', 'employer');
        }
        else if (path.lastIndexOf('/recruiter') === 0) {
          $rootScope.portalType = 'recruiter';
          if (path.lastIndexOf('/recruiter/profile') !== 0) {
            Preference.isRecruiterProfileCompleted().then(function (isProfileCompleted) {
              if (isProfileCompleted) {
                $cookies.put('last_visited', 'recruiter');
              }
              else {
                $location.path('/recruiter/profile');
              }
            }, function (err) {
              console.error(err);
            });
          }
        }
        else if (path.lastIndexOf('/expert') === 0) {
          $rootScope.portalType = 'expert';
          if (path.lastIndexOf('/expert/profile') !== 0) {
            Preference.isExpertProfileCompleted().then(function (isProfileCompleted) {
              if (isProfileCompleted) {
                $cookies.put('last_visited', 'expert');
              }
              else {
                $location.path('/expert/profile');
              }
            }, function (err) {
              console.error(err);
            });
          }
        }
        else if (path.lastIndexOf('/candidate') === 0) {
          $rootScope.portalType = 'candidate';
        }
        else if (path.lastIndexOf('/login') === 0) {
          $rootScope.portalType = 'login';
        }
        else {
          $rootScope.portalType = 'other';
        }
      }
    });

    $rootScope.toggleSide = function (navID) {
      $mdSidenav(navID)
        .toggle()
        .then(function () {
          //$log.debug('toggle ' + navID + ' is done');
        });
    };

    TempLocalStorage.load();

    auth.hookEvents();

    // Safely instantiate dataLayer
    var dataLayer = window.dataLayer = window.dataLayer || [];

    //Authentication events
    // This hooks al auth events to check everything as soon as the app starts
  });
