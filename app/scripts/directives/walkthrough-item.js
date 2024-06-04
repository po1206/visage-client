'use strict';

/**
 * @ngdoc directive
 * @name visageClientApp.directive:announcement
 * @description
 * # announcement
 */
angular.module('visageClientApp')
  .controller('DialogCtrl' , function DialogCtrl($scope, mdPanelRef, walkthroughName, state, close) {
    $scope.walkthroughUrl = 'views/templates/walkthroughs/' + walkthroughName + '.tmpl.html';
    $scope._mdPanelRef = mdPanelRef;
    $scope.state = state;

    $scope.close = function () {
      close();
      $scope._mdPanelRef && $scope._mdPanelRef.close();
    };
  })
  .directive('walkthroughItem', function ($mdPanel) {
    return {
      replace:true,
      restrict: 'E',
      scope :{
        walkthroughName : '@',
        state:'=',
        close : '&onClose'
      },
      link: function postLink(scope) {
        // Necessary to pass locals to the dialog template.

        function showDialog () {
          var position = $mdPanel.newPanelPosition()
            .absolute()
            .right()
            .top();
          var animation = $mdPanel.newPanelAnimation();

          animation.openFrom({
            top: document.documentElement.clientHeight,
            left: document.documentElement.clientWidth / 2 - 250
          });

          animation.closeTo({
            top: document.documentElement.clientHeight,
            left: document.documentElement.clientWidth / 2 - 250
          });

          animation.withAnimation($mdPanel.animation.SLIDE);
          var config = {
            animation: animation,
            attachTo: angular.element(document.body),
            controller: 'DialogCtrl',
            controllerAs: 'ctrl',
            templateUrl: 'views/templates/walkthrough-item.tmpl.html',
            panelClass: 'walkthrough-container',
            position: position,
            trapFocus: true,
            zIndex: 150,
            clickOutsideToClose: false,
            clickEscapeToClose: true,
            hasBackdrop: true,
            fullscreen : true,
            locals : {
              walkthroughName : scope.walkthroughName,
              state : scope.state,
              close : scope.close
            }
          };
          $mdPanel.open(config);
        }
        showDialog();
      }
    };
  });
