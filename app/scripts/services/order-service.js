'use strict';

/**
 * @ngdoc service
 * @name visageClientApp.OrderService
 * @description
 * # OrderService
 * Service in the visageClientApp.
 */
angular.module('visageClientApp')
  .service('OrderService', function (auth,
    JobOffer,
    $http,
    ENV,
    endpointsApi,
    $q,
    EMailFactory) {

    this.validateJob = function (job) {
      job.status = 'Validated';
      job.launched = true;
      var calls = [
        EMailFactory.calibrationValidated(job),
        job.$update()];
      return $q.all(calls);
    };

    /*
     FIXME Security breach, a user should not be able to mark his jobs as paid.
     should be done on the server side when payment is done
     */
    this.updatePayment = function (email, preferences, payment) {
      var deferred = $q.defer();
      var calls = [];
      JobOffer.getUnpaids().$promise.then(function (unpaids) {
        calls.push(preferences.$update());
        calls.push(EMailFactory.orderConfirmation(email, payment));
        unpaids.forEach(function (jobOffer) {
          jobOffer.paid = Date.now();
          calls.push(jobOffer.$update());
        });

        $q.all(calls).then(function (resp) {
          deferred.resolve(resp);
        }, function (err) {
          console.error('There was an error paying the jobs');
          console.error(err);
          deferred.reject(err);
        });
      });
      return deferred.promise;
    };

    //this.getOrderDetails = function (categories, jobs) {
    //  var orderDetails = {
    //    total: {
    //      quantity: 0,
    //      price: 0
    //    }
    //  };
    //  var categoryBySalaryRange = {};
    //  categories.forEach(function (category) {
    //    var name = category.category;
    //    var price = category.price;
    //    category.ranges.forEach(function (range) {
    //      categoryBySalaryRange[range] = {
    //        name: name,
    //        price: price
    //      };
    //    });
    //  });
    //  jobs.forEach(function (job) {
    //    if (!orderDetails[categoryBySalaryRange[job.salaryRange].name]) {
    //      orderDetails[categoryBySalaryRange[job.salaryRange].name] = {
    //        quantity: 0,
    //        price: 0
    //      };
    //    }
    //    orderDetails[categoryBySalaryRange[job.salaryRange].name].quantity++;
    //    orderDetails[categoryBySalaryRange[job.salaryRange].name].price +=
    // categoryBySalaryRange[job.salaryRange].price; orderDetails.total.quantity++;
    // orderDetails.total.price += categoryBySalaryRange[job.salaryRange].price; });  return
    // orderDetails; };
  });
