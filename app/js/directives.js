'use strict';

angular.module('myApp.directives', [])
    .directive('enhanced', function () {
        return {
            restrict: 'A',
            controller: 'enhancedCtrl',
            scope: {},
            transclude: true,
            template: '<div ng-transclude></div>'
        };
    })
    .controller('enhancedCtrl', ['$scope', function ($scope) {
        var info = function () {
            var size = 0;
            return {
                getSize: function () {
                    return size;
                },
                setSize: function (newSize) {
                    size = newSize;
                }
            };
        }();

        var callback;

        this.registerSizeChangedCallback = function (callback) {
            this.callback = callback;
        };
        this.notifyObserver = function () {
            this.callback();
        };
        this.setSize = function (size) {
            info.setSize(size);
            this.notifyObserver();
        };
        this.getSize = function () {
            return info.getSize();
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
                enhancedCtrl.registerSizeChangedCallback(function () {
                    $scope.size = enhancedCtrl.getSize();
                });
            }
        };
    });