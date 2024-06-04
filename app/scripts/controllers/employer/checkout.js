'use strict';

/**
 * @ngdoc function
 * @name visageClientApp.controller:CheckoutCtrl
 * @description
 * # CheckoutCtrl
 * Controller of the visageClientApp
 */
angular.module('visageClientApp')
  .controller('CheckoutCtrl',
    function ($scope,
      $location,
      $http,
      JobOffer,
      OrderService,
      ENV,
      Preference,
      removeTrailingEqualsFilter,
      $timeout,
      ThirdParties,
      localApi,
      endpointsApi,
      Loader,
      $mdDialog,
      $mdMedia,
      $q,
      auth) {

      var togglePayButton = function (newValue) {
        angular.element(document.querySelector('#payment-form button')).prop("disabled", newValue);
      };

      var capturePayment = function (event) {
        return $http.post(ThirdParties.checkout.endpoint + endpointsApi.verify,
          {
            "paymentToken": event.data.paymentToken
          });
      };

      var paymentInitialized = function (token) {
        Checkout.render({
          debugMode: true,
          publicKey: ThirdParties.checkout.apiKey,
          paymentToken: token,
          customerEmail: $scope.user.email,
          customerName: $scope.user.name,
          title: "Visage.ae",
          subtitle: $scope.payment.productLabel,
          value: $scope.priceAfterDiscountInCents,
          currency: 'USD',
          widgetContainerSelector: '#payment-form',
          logoUrl: window.location.protocol +
          "//" +
          window.location.host +
          "/images/visage_logo_full.png",
          iconContainerSelector: "#card-container",
          themeColor: '#309fc3',
          paymentMode: 'card',
          cardCharged: function (event) {
            $scope.$apply(function () {
              Loader.globalLoader(true);
              if ($scope.payment.price > 0) {
                //Card has been charged
                capturePayment(event)
                  .then(function (resp) {
                    $scope.payment.status = "Paid";
                    $scope.payment.paidOn = new Date();
                    OrderService.updatePayment(resp.data.email, $scope.preferences, $scope.payment)
                      .then(function () {
                          Loader.globalLoader(false);
                          $location.search('temporaryToken', null);
                          $location.search('iv', null);
                          $location.search('price', null);
                          $location.path("/employer/thankyou");
                        },
                        function (resp) {
                          throw resp;
                        });
                  }, function (err) {
                    console.error("There was an error");
                    console.error(err);
                    $scope.errorProcessingPayment = true;
                  })
                  .finally(function () {
                    Loader.globalLoader(false);
                  });
              }
            });
          },
          widgetRendered: function () {
            //FIXME HAD TO ADD A TIMEOUT BECAUSE THIS DAMN LIBRARY TRIGGERS THIS FUNCTION WHEREAS
            // IT S NOT RENDERED YET
            $timeout(function () {
              $scope.$apply(function () {
                togglePayButton(true);
                Loader.globalLoader(false);
              });
            }, 0);

          },
          apiError: function (event) {
            console.error("API ERROR - Currently not able to charge the card");
            console.error(event);
            Loader.globalLoader(false);
          }
        });
      };

      var initializePayment = function (preferences) {

        var deferred = $q.defer();
        $scope.preferences = preferences;
        if ($scope.params.temporaryToken && $scope.params.price) {
          var arrayPayment = preferences.employer.payments.filter(function (payment) {
            return (payment._id === $scope.params.temporaryToken);
          });
          $scope.payment = arrayPayment[0];
          $scope.payment.discount = $scope.payment.discount || 0;

          $scope.priceAfterDiscount = ($scope.payment.price - $scope.payment.discount);

          $scope.priceAfterDiscountInCents = $scope.priceAfterDiscount * 100;

          $scope.discountRate =
            Math.round(($scope.payment.discount / $scope.payment.price) * 10000) / 100;

          if ($scope.payment._id) {
            var data = {
              "quantity": $scope.payment.jobQuantity,
              "fullNumber": $scope.preferences.employer.phone,
              "email": $scope.user.email,
              "price": $scope.priceAfterDiscountInCents
            };
            if ($scope.params.price) {
              data.temporaryToken = $scope.params.temporaryToken;
              data.iv = $scope.params.iv;
              data.userId = removeTrailingEqualsFilter(btoa($scope.user.user_id));
            }

            $http.post(ThirdParties.checkout.endpoint + endpointsApi.checkout, data
              )
              .then(function (resp) {
                  deferred.resolve(resp.data.id);
                },
                function (err) {
                  deferred.reject(err);
                });
          }
          else {
            deferred.reject({
              error: "Payment not found"
            });
          }

        }

        return deferred.promise;
      };

      var initialize = function () {
        Loader.globalLoader(true);

        Preference.getPreferences()
          .then(initializePayment)
          .then(paymentInitialized)
          .catch(function (err) {
            console.error(err);
            Loader.globalLoader(false);
          });

      };

      $scope.updateJobs = function () {
        $location.path('/employer/jobs');
      };

      $scope.setHome(false);
      $scope.setForm(false);
      //$scope.setProgress(75);

      $scope.params = $location.search();

      $scope.user = auth.profile;

      $scope.processingPayment = null;

      $scope.togglePayButton = function (tandc) {
        togglePayButton(!tandc);
      };

      //TODO revamp payment
      //Current code disallow customer to pay by themselve.
      if ($scope.params.temporaryToken && $scope.params.price) {
        initialize();
      }

    });
