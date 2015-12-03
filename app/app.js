'use strict';

angular.module('buddyListApp', ['ngDialog'])
      .service('buddyService', ['$http', '$q' ,function(http, $q) {
        var deferred = $q.defer();
        http.get('/app/buddiesData.json').then(function(data) {
              deferred.resolve(data);
        });

        this.getBuddies = function() {
            return deferred.promise;
        }
      }])
      .controller('buddyListCntrl', ['$scope', 'ngDialog', 'buddyService', function (scope, ngDialog, buddyService) {
          var promise = buddyService.getBuddies();
          promise.then(function(data) {
          scope.buddiesData = data.data;
          });

          scope.sortReverse = true;
          scope.toggle = false;
          scope.sortOrder = function(sortType) {
            scope.key = sortType ? sortType : "userName";
            scope.sortReverse = !scope.sortReverse;
          }
          scope.showDetailsView = function(idx) {
            scope.toggle = !scope.toggle;
            scope.currentIdx = idx;
          }

          scope.removeBuddy = function(entry) {
            ngDialog.openConfirm({
              template: "<h4>Do you want to delete " + entry.userName + "?</h4>\
                <button type='button' class='ngdialog-button ngdialog-button-secondary' ng-click='closeThisDialog(0)'>No</button>\
                <button type='button' class='ngdialog-button ngdialog-button-primary' ng-click='confirm()'>Yes</button>",
              plain: true
            }).then(function() {
              //Confirm Promise
              var idx = scope.buddiesData.indexOf(entry);
              scope.buddiesData.splice(idx, 1);
            });
          }

          scope.openAddDialog = function() {
            ngDialog.open({
              template: "addBuddyTemplate.html",
              controller: "addBuddyCntrl",
              scope: scope
            });
          }
}])
      .controller('addBuddyCntrl', ['$scope', '$filter', function(scope, $filter) {
          scope.addBuddy = function() {
            //add a default status to new buddy here
            scope.user.status = "Offline";
            scope.$parent.buddiesData.push(scope.user);
            scope.closeThisDialog();
          }
}]);

