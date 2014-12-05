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
        var size = 0;
        var min = 3;
        var max = 250;
        var defaultOptions = {
            infoClass: '',
            warnClass: '',
            errorClass: '',
            tolerance: 50,
            initialPrompt: 'enter at least % characters',
            nToGoPrompt: '% more to go...',
            nLeftPrompt: '% characters left',
            tooLongByPrompt: 'too long by % characters'
        };

        var options = angular.extend({}, defaultOptions, $attrs);

        function expandMessage(rawMessage, n) {
            return rawMessage.replace('%', n);
        }

        var callback;

        this.setMinMax = function (minMax) {
            min = minMax.min;
            max = minMax.max;
        };

        this.registerTextChangedCallback = function (callback) {
            this.callback = callback;
        };
        this.notifyObserver = function () {
            if (angular.isFunction(this.callback)) {
                this.callback();
            }
        };
        this.setSize = function (newSize) {
            size = newSize;
            this.notifyObserver();
        };
        this.getSize = function () {
            return size;
        };
        this.getActiveClass = function () {
            if (size > max - options.tolerance && size <= max) {
                return options.warnClass;
            }
            else if (size > max) {
                return options.errorClass;
            }
            return options.infoClass;
        };
        this.getCurrentMessage = function () {
            if (size === 0) {
                return expandMessage(options.initialPrompt, min);
            }
            else if (size > 0 && size < min) {
                return expandMessage(options.nToGoPrompt, min - size);
            }
            else if (size >= min && size <= max) {
                return expandMessage(options.nLeftPrompt, max - size);
            }
            else {
                return expandMessage(options.tooLongByPrompt, size - max);
            }
        };
    }])
    .directive('enhancedInput', function () {
        return {
            restrict: 'A',
            require: ['^enhancedZone', '^ngModel'],
            replace: true,
            link: function ($scope, $element, $attrs, controllers) {
                var enhancedZoneCtrl = controllers[0];
                var ngModelCtrl = controllers[1];
                enhancedZoneCtrl.setMinMax({min: $attrs.min, max: $attrs.max});
                $scope.$watch($attrs.ngModel, function (newVal) {
                    enhancedZoneCtrl.setSize(newVal.length);
                });
                ngModelCtrl.$parsers.push(function (viewValue, arg2) {
                    ngModelCtrl.$setValidity('enhancedMin', viewValue.length >= $attrs.min);
                    ngModelCtrl.$setValidity('enhancedMax', viewValue.length <= $attrs.max);
                    return viewValue;
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
            template: '<div ng-class="activeClass">{{message}}</div>',
            link: function ($scope, $element, $attrs, enhancedZoneCtrl) {
                enhancedZoneCtrl.registerTextChangedCallback(function () {
                    $scope.size = enhancedZoneCtrl.getSize();
                    $scope.message = enhancedZoneCtrl.getCurrentMessage();
                    $scope.activeClass = enhancedZoneCtrl.getActiveClass();
                });
            }
        };
    });