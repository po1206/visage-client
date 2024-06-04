'use strict';

/**
 * @ngdoc overview
 * @name visageClientApp
 * @description
 * # visageClientApp
 *
 * Main module of the application.
 */

angular.module('visageMaintenance', ['ngMaterial'])
  .config(function ($mdThemingProvider) {
    // Extend the red theme with a few different colors
    var visageTeal = $mdThemingProvider.extendPalette('light-blue', {
      'contrastDefaultColor': 'light',
      '500': '0fc48b',
      '800': '0277BD'
    });
    var visageOrange = $mdThemingProvider.extendPalette('orange', {
      'A200': 'FB8C00'
    });
    // Register the new color palette map with the name <code>visageCyan</code>
    $mdThemingProvider.definePalette('visageTeal', visageTeal);
    $mdThemingProvider.definePalette('visageOrange', visageOrange);

    // Use that theme for the primary intentions
    $mdThemingProvider.theme('default')
      .primaryPalette('visageTeal')
      .accentPalette('visageOrange')
      .warnPalette('red');
  });

angular
  .module('visageClientApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngMaterial',
    'visageNgCommon',
    'config',
    'constants',
    'angularPayments',
    'auth0',
    'angular-storage',
    'angular-jwt',
    'ngFileUpload',
    'checklist-model',
    'xml'
  ])
  .config(function ($mdThemingProvider) {
    // Extend the red theme with a few different colors
    var visageGreen = $mdThemingProvider.extendPalette('green', {
      'contrastDefaultColor': 'light',
      '500': '0fc48b',
      '800': '23a779',
      'A100': '152b34'
    });
    var visageYellow = $mdThemingProvider.extendPalette('yellow', {
      'contrastDefaultColor': 'light',
      'A200': 'FFC107'
    });

    var visageRed = $mdThemingProvider.extendPalette('red', {
      '500': 'bc5651'
    });
    // Register the new color palette map with the name <code>visageCyan</code>
    $mdThemingProvider.definePalette('visageGreen', visageGreen);
    $mdThemingProvider.definePalette('visageYellow', visageYellow);
    $mdThemingProvider.definePalette('visageRed', visageRed);

    // Use that theme for the primary intentions
    $mdThemingProvider.theme('default')
      .primaryPalette('visageGreen')
      .accentPalette('visageYellow')
      .warnPalette('visageRed');
  })
  .config(function ($routeProvider) {

    var resolveObject = {
      user: ['$q', 'Preference', 'UserBehavior', function ($q, Preference, UserBehavior) {
        var promisePref = Preference.getPreferences();
        promisePref
          .then(function (preferences) {
            if (preferences.recruiter && preferences.recruiter.validated) {
              UserBehavior.update({validatedRecruiter: true});
            }
          });
        return promisePref;
      }]
    };

    $routeProvider
      .when('/', {
        requiresLogin: true,
        controller: 'MainCtrl',
        controllerAs: 'main',
        template: ''
      })
      .when('/signup', {
        requiresLogin: true,
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        controllerAs: 'signupctrl'
      })
      .when('/employer', {
        redirectTo: '/employer/jobs'
      })
      .when('/employer/jobs', {
        requiresLogin: true,
        templateUrl: 'views/employer/jobs.html',
        resolve: resolveObject,
        controller: 'EmployerJobsCtrl',
        controllerAs: 'jobs'
      })
      .when('/employer/job-offer/:jobId/edit', {
        requiresLogin: true,
        templateUrl: 'views/employer/edit-job-offer.html',
        resolve: resolveObject,
        controller: 'EditJobOfferCtrl',
        controllerAs: 'editJobOffer'
      })
      .when('/employer/job-offer/edit', {
        requiresLogin: true,
        templateUrl: 'views/employer/new-job-offer.html',
        resolve: resolveObject,
        controller: 'NewJobOfferCtrl',
        controllerAs: 'newjobofferctrl'
      })
      .when('/employer/job-offer/:jobId?', {
        requiresLogin: true,
        templateUrl: 'views/employer/view-job-offer.html',
        resolve: resolveObject,
        controller: 'ViewJobOfferCtrl',
        controllerAs: 'viewJobOffer'
      })
      .when('/employer/thankyou', {
        requiresLogin: true,
        templateUrl: 'views/employer/thank-you.html',
        resolve: resolveObject,
        controller: 'ThankYouCtrl',
        controllerAs: 'thankyouctrl'
      })
      .when('/employer/profile', {
        requiresLogin: true,
        templateUrl: 'views/employer/profile.html',
        resolve: resolveObject,
        controller: 'EmployerProfileCtrl',
        controllerAs: 'employerprofilectrl'
      })
      .when('/employer/checkout', {
        requiresLogin: true,
        templateUrl: 'views/employer/checkout.html',
        resolve: resolveObject,
        controller: 'CheckoutCtrl',
        controllerAs: 'checkoutctrl'
      })
      .when('/employer/job-offer/:jobId?/candidates/:status?', {
        requiresLogin: true,
        templateUrl: 'views/employer/review-candidates.html',
        resolve: resolveObject,
        controller: 'EmployerReviewCandidatesCtrl',
        controllerAs: 'EmployerReviewCandidatesCtrl'
      })
      .when('/recruiter', {
        redirectTo: '/recruiter/jobs'
      })
      .when('/recruiter/profile', {
        requiresLogin: true,
        templateUrl: 'views/recruiter/profile.html',
        resolve: resolveObject,
        controller: 'RecruiterProfileCtrl',
        controllerAs: 'recProfile'
      })
      .when('/recruiter/my-jobs', {
        requiresLogin: true,
        templateUrl: 'views/recruiter/my-jobs.html',
        resolve: resolveObject,
        controller: 'RecruiterMyJobsCtrl',
        controllerAs: 'recMyJobs'
      })
      .when('/recruiter/jobs', {
        requiresLogin: true,
        templateUrl: 'views/recruiter/jobs.html',
        resolve: resolveObject,
        controller: 'RecruiterJobsCtrl',
        controllerAs: 'recJobs'
      })
      .when('/recruiter/job-offer/:jobId?', {
        requiresLogin: true,
        templateUrl: 'views/recruiter/view-job-offer.html',
        resolve: resolveObject,
        controller: 'RecruiterViewJobOfferCtrl',
        controllerAs: 'recruiterviewJobOffer'
      })
      .when('/recruiter/job-offer/:jobId?/refer', {
        requiresLogin: true,
        templateUrl: 'views/recruiter/refer-candidate.html',
        resolve: resolveObject,
        controller: 'RecruiterReferCandidateCtrl',
        controllerAs: 'RecruiterReferCandidateCtrl'
      })
      .when('/expert', {
        redirectTo: '/expert/jobs'
      })
      .when('/expert/profile', {
        requiresLogin: true,
        templateUrl: 'views/expert/profile.html',
        resolve: resolveObject,
        controller: 'ExpertProfileCtrl',
        controllerAs: 'expProfile'
      })
      .when('/expert/my-jobs', {
        requiresLogin: true,
        templateUrl: 'views/expert/my-jobs.html',
        resolve: resolveObject,
        controller: 'ExpertMyJobsCtrl',
        controllerAs: 'expMyJobs'
      })
      .when('/expert/job-offer/:jobId?', {
        requiresLogin: true,
        templateUrl: 'views/expert/view-job-offer.html',
        resolve: resolveObject,
        controller: 'ExpertViewJobOfferCtrl',
        controllerAs: 'expertviewJobOffer'
      })
      .when('/expert/job-offer/:jobId?/rate', {
        requiresLogin: true,
        templateUrl: 'views/expert/rate-candidate.html',
        resolve: resolveObject,
        controller: 'ExpertRateCandidateCtrl',
        controllerAs: 'ExpertRateCandidateCtrl'
      })
      .when('/candidate/:jobId', {
        templateUrl: 'views/candidate/view-job-offer.html',
        controller: 'CandidateViewJobOfferCtrl',
        controllerAs: 'candidateviewJobOffer'
      })
      .when('/login', {
        templateUrl: 'views/forbidden.html',
        controller: 'ForbiddenCtrl'
      })
      .otherwise({
        redirectTo: '/login'
      });
  })
  .config(function (authProvider, ThirdParties) {
    authProvider.init({
      domain: ThirdParties.auth0.domain,
      clientID: ThirdParties.auth0.clientID,
      // Here include the URL to redirect to if the user tries to access a resource when not
      // authenticated.
      loginUrl: '/login'
    });
  })
  .config(function (authProvider, $routeProvider, $httpProvider, jwtInterceptorProvider) {
    // We're annotating this function so that the `store` is injected correctly when this file is
    // minified
    jwtInterceptorProvider.tokenGetter = ['store', function (store) {
      // Return the saved token
      return store.get('token');
    }];
    $httpProvider.interceptors.push('jwtInterceptor');
  })
  .config(function (ENV,$sceDelegateProvider) {
    var whitelist = [
      // Allow same origin resource loads.
      'self',
      // Allow loading from our assets domain.  Notice the difference between * and **.
      'https://*.visage.ae/**',
      // Allow loading from our assets domain.  Notice the difference between * and **.
      'https://*.visage.jobs/**',
      // Allow loading from our assets domain.  Notice the difference between * and **.
      'https://*.instapage.com/**',
      // Allow loading from our assets domain.  Notice the difference between * and **.
      'https://*.pagedemo.co/**',
      // Our typeform account
      'https://visagejobs.typeform.com/**',
      ENV.pdfViewerEndpoint
    ];
    $sceDelegateProvider.resourceUrlWhitelist(whitelist);
  })
  .config(function (ENV, $compileProvider) {
    $compileProvider.debugInfoEnabled(ENV.development);
  });
