'use strict';

angular.module('myApp.directives', [])
    .directive('enhancedZone', function () {
        return {
            restrict: 'A',
            controller: 'enhancedZoneCtrl',
            scope: {},
            transclude: true,
            template: '<div ng-transclude></div>'
        };
    })
    .controller('enhancedZoneCtrl', ['$scope', '$attrs', function ($scope, $attrs) {
        var info = function () {
            var size = 0;
            var infoClass = $attrs.infoClass || '';
            var warnClass = $attrs.warnClass || '';
            var errorClass = $attrs.errorClass || '';
            var minThreshold = $attrs.minThreshold || 3;
            var maxThreshold = $attrs.maxThreshold || 250;
            var tolerance = $attrs.tolerance || 50;
            return {
                getSize: function () {
                    return size;
                },
                setSize: function (newSize) {
                    size = newSize;
                },
                getActiveClass: function () {
                    if (size > maxThreshold - tolerance && size < maxThreshold) {
                        return warnClass;
                    }
                    else if (size > maxThreshold) {
                        return errorClass;
                    }
                    return infoClass;
                }
            };
        }();

        var callback;

        this.registerTextChangedCallback = function (callback) {
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
        this.getActiveClass = function () {
            return info.getActiveClass();
        };
    }])
    .directive('enhancedInput', function () {
        return {
            restrict: 'A',
            require: '^enhancedZone',
            replace: true,
            link: function ($scope, $element, $attrs, enhancedZoneCtrl) {
                $scope.$watch($attrs.ngModel, function (newVal) {
                    enhancedZoneCtrl.setSize(newVal.length);
                });
            }
        };
    })
    .directive('notice', function () {
        return {
            restrict: 'A',
            require: '^enhancedZone',
            replace: true,
            scope: {},
            template: '<div ng-class="activeClass">{{size}}</div>',
            link: function ($scope, $element, $attrs, enhancedZoneCtrl) {
                enhancedZoneCtrl.registerTextChangedCallback(function () {
                    $scope.size = enhancedZoneCtrl.getSize();
                    $scope.activeClass = enhancedZoneCtrl.getActiveClass();
                });
            }
        };
    });