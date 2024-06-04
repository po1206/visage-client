'use strict';

/**
 * @ngdoc service
 * @name visageClientApp.User
 * @description
 * # User
 * Factory in the visageClientApp.
 */
angular.module('visageClientApp')
  .factory('Preference', function (cachedResource,
    endpointsApi,
    ENV,
    auth,
    $q,
    removeTrailingEqualsFilter) {

    var Preference = cachedResource(ENV.apiEndpoint +
      endpointsApi.preferences +
      '/:userId', {userId: '@_id'});

    return {
      getPreferences: function () {
        //Had to do that because when using impersonation the profile is not always loaded
        function profileLoaded(profile) {
          var encodedId = removeTrailingEqualsFilter(btoa(profile.user_id));
          return Preference.get({userId: encodedId}).$promise;
        }
        if (auth.profile) {
          return profileLoaded(auth.profile);
        }
        else if(auth.profilePromise){
          return auth.profilePromise.then(function (profile) {
              return profileLoaded(profile);
            });
        }
        else {
          console.log(auth);
        }
      },
      loadBasicInfos: function () {
        var deferred = $q.defer();
        this.getPreferences()
          .then(function (prefs) {
            if (prefs.email !== auth.profile.email || prefs.picture !== auth.profile.picture) {
              prefs.email = auth.profile.email;
              prefs.picture = auth.profile.picture;
              if (!prefs._id) {
                prefs.$save()
                  .then(function () {
                    deferred.resolve();
                  });
              }
              else {
                prefs.$update()
                  .then(function () {
                    deferred.resolve();
                  });
              }
            }
            else {
              deferred.resolve();
            }
          })
          .catch(function (err) {
            deferred.reject(err);
          });
        return deferred.promise;
      },
      isBasicInfosLoaded: function () {
        var deferred = $q.defer();
        this.getPreferences().then(function (userPref) {
          if (userPref) {
            if (
              !userPref.email || !userPref.picture) {
              deferred.resolve(false);
            }
            else {
              deferred.resolve(userPref);
            }
          }
          else {
            deferred.reject({
              message: 'No preferences found'
            });
          }
        }, function (err) {
          deferred.reject(err);
        });
        return deferred.promise;
      },
      isRecruiterProfileCompleted: function () {
        var deferred = $q.defer();
        this.getPreferences().then(function (userPref) {
          if (userPref) {
            if (!userPref.roles || userPref.roles.indexOf('recruiter') === -1) {
              deferred.resolve(false);
            }
            else {
              if (
                !userPref.name ||
                userPref.recruiter.industries.length ===
                0 ||
                userPref.recruiter.jobRoles.length ===
                0 ||
                userPref.recruiter.recruitmentAreas.length ===
                0 ||
                !userPref.recruiter.location ||
                !userPref.recruiter.availability) {
                deferred.resolve(false);
              }
              else {
                deferred.resolve(userPref);
              }
            }
          }
          else {
            deferred.reject({
              message: 'No preferences found'
            });
          }
        }, function (err) {
          deferred.reject(err);
        });
        return deferred.promise;
      },
      isExpertProfileCompleted: function () {
        var deferred = $q.defer();
        this.getPreferences().then(function (userPref) {
          if (userPref) {
            if (!userPref.roles || userPref.roles.indexOf('expert') === -1) {
              deferred.resolve(false);
            }
            else {
              if (
                !userPref.name ||
                userPref.expert.industries.length ===
                0 ||
                userPref.expert.jobRoles.length ===
                0 ||
                userPref.expert.areas.length ===
                0 ||
                !userPref.expert.location ||
                !userPref.expert.availability) {
                deferred.resolve(false);
              }
              else {
                deferred.resolve(userPref);
              }
            }
          }
          else {
            deferred.reject({
              message: 'No preferences found'
            });
          }
        }, function (err) {
          deferred.reject(err);
        });
        return deferred.promise;
      },
      isEmployerProfileCompleted: function () {
        var deferred = $q.defer();
        this.getPreferences().then(function (userPref) {
          if (userPref) {
            if (!userPref.roles || userPref.roles.indexOf('employer') === -1) {
              deferred.resolve(false);
            }
            else {
              if (
                !userPref.name ||
                !userPref.employer ||
                !userPref.employer.phone ||
                !userPref.employer.company) {
                deferred.resolve(false);
              }
              else {
                deferred.resolve(userPref);
              }
            }
          }
          else {
            deferred.reject({
              message: 'No preferences found'
            });
          }
        }, function (err) {
          deferred.reject(err);
        });
        return deferred.promise;
      },
      getEmployers: function (params) {
        params = params || {};
        var extendedParams = angular.extend(params, {roles: 'employer'});
        return Preference.query(extendedParams);
      }
    };
  });
