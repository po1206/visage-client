'use strict';

/**
 * @ngdoc service
 * @name visageClientApp.RecruiterService
 * @description
 * # RecruiterService
 * Service in the visageClientApp.
 */
angular.module('visageClientApp')
  .service('RecruiterService', function (JobOffer,
    $http,
    ENV,
    endpointsApi,
    $q,
    RecruiterAssignment) {

    // AngularJS will instantiate a singleton by calling 'new' on this function
    this.getJobsWorked = function (recruiter) {
      var defered = $q.defer();
      JobOffer.getSourcingJobs()
        .then(function (jobs) {
          var workableReadyJobs = jobs.filter(function (job) {
            return !!job.syncedWith;
          });
          if (workableReadyJobs && workableReadyJobs.length > 0) {
            var promises = workableReadyJobs.map(function (job) {
              return $http.get(ENV.apiEndpoint +
                endpointsApi.extJobOffers +
                '/' +
                job.syncedWith.shortcode +
                '/recruiters');
            });

            var workingOnJobs = [];
            $q.all(promises)
              .then(function (results) {
                results.forEach(function (result, index) {
                  var workableRecruitersEmails = result.data.recruiters.map(
                    function (extRecruiter) {
                      return extRecruiter.email;
                    });
                  if (workableRecruitersEmails &&
                    workableRecruitersEmails.indexOf(recruiter.email) !== -1) {
                    workingOnJobs.push(workableReadyJobs[index]);
                  }
                });
                defered.resolve(workingOnJobs);
              })
              .catch(function (err) {
                throw err;
              });
          }
        })
        .catch(function (err) {
          defered.reject(err);
        });

      return defered.promise;
    };

    this.assignJobsOnWorkable = function (recruiter) {
      this.getJobsWorked(recruiter)
        .then(function (jobsWorked) {
          var assignmentsDone = jobsWorked.map(function (jobWorked) {
            var assignment = new RecruiterAssignment();
            assignment.job = jobWorked._id;
            assignment.recruiter = recruiter._id;
            return assignment.$save({jobId: jobWorked._id, path: 'job-offers'});
          });
          return $q.all(assignmentsDone);
        });
    };

  });
