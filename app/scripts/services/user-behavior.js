'use strict';

/**
 * @ngdoc service
 * @name visageClientApp.UserBehavior
 * @description
 * # UserBehavior
 * Factory in the visageClientApp.
 */
angular.module('visageClientApp')
  .factory('UserBehavior', function (ThirdParties, auth, $window, Preference) {

    var booted = false;

    // Public API here
    return {
      boot: function () {
        if (!booted && auth.isAuthenticated) {
          Preference.getPreferences()
            .then(function (prefs) {
              this.bootIntercom(prefs);
              this.bootGA(prefs);
            }.bind(this));
        }
      },
      bootGA: function (prefs) {
        ga('set', 'dimension1', prefs.roles.join(','));
      },
      bootIntercom: function (prefs) {
        var profile = auth.profile;
        $window.Intercom('boot', {
          app_id: ThirdParties.intercom.appId,
          email: profile.email,
          name: prefs.name || profile.name,
          user_id: btoa(profile.user_id),
          created_at: profile.created_at,
          leadStatus: '1'
        });
        booted = true;
      },

      update: function (changes) {
        if (auth.isAuthenticated && !auth.profile.impersonated) {
          if (!booted) {
            this.bootIntercom();
          }
          if (changes) {
            var profileChanges = angular.merge({
              email: auth.profile.email
            }, changes);
            $window.Intercom('update', profileChanges);
          }
          else {
            $window.Intercom('update');
          }
        }
      },

      shutDown: function () {
        $window.Intercom('shutdown');
      }
    };
  });
