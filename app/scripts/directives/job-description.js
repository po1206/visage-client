'use strict';

/**
 * @ngdoc directive
 * @name visageClientApp.directive:jobDescription
 * @description
 * # jobDescription
 */
angular.module('visageClientApp')
  .directive('jobDescription', function ($window,ENV,endpointsApi, $sce) {
    return {
      templateUrl: 'views/templates/job-description.tmpl.html',
      restrict: 'E',
      scope : {
        job : '=',
        assignment: '=',
        isValidated: '&'
      },
      link: function postLink(scope) {

        scope.download = function (file) {
          $window.open(ENV.apiEndpoint +
            endpointsApi.media +
            '/download/JobDescription/' +
            file.identifier + '?filename=' +
            file.originalFilename, '_blank');
        };

        scope.$watch('job.description', function (newDesc) {
          if(newDesc) {
            scope.safeHTMLDescription =  $sce.trustAsHtml(newDesc);
          }
        },true);
      }
    };
  });
