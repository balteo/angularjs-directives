'use strict';

angular.module('myApp.controllers', [])
  .controller('myCtrl', ['$scope', function($scope) {
        $scope.name = 'test';
  }]);