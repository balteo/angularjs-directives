'use strict';

angular.module('myApp.directives', [])
    .directive('enhanced', function () {
        return {
            restrict: 'A',
            controller: 'enhancedCtrl',
            transclude: true,
            scope: {
                name: '='
            },
            template: '<div ng-transclude></div>'
        };
    })
    .controller('enhancedCtrl', ['$scope', '$element', '$attrs' , function ($scope) {
        var size;
        var callback;
        this.registerSizeChangedCallback = function(callback){
            this.callback = callback;
        };
        this.notifyObserver = function(){
            this.callback();
        };
        this.setSize = function (size) {
            this.size = size;
            this.notifyObserver();
        };
        this.getSize = function () {
            return this.size;
        };
    }])
    .directive('enhancedTextarea', function () {
        return {
            restrict: 'A',
            require: '^enhanced',
            replace: true,
            template: '<textarea></textarea>',
            link: function ($scope, $element, $attrs, enhancedCtrl) {
                $scope.$watch($attrs.ngModel, function (newVal) {
                    console.log(newVal.length);
                    enhancedCtrl.setSize(newVal.length);
                });
            }
        };
    })
    .directive('notice', function () {
        return {
            restrict: 'A',
            require: '^enhanced',
            replace: true,
            scope: {},
            template: '<div>{{size}} characters</div>',
            link: function ($scope, $element, $attrs, enhancedCtrl) {
                enhancedCtrl.registerSizeChangedCallback(function(){
                    $scope.size = enhancedCtrl.getSize();
                });
            }
        };
    });