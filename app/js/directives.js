'use strict';

angular.module('myApp.directives', [])
    .directive('enhanced', function () {
        return {
            restrict: 'A',
            controller: 'enhancedCtrl',
            replace: true,
            transclude: true,
            scope: {
                name: '='
            },
            template: '<div ng-transclude></div>'
        };
    })
    .controller('enhancedCtrl', ['$scope', '$element', '$attrs' , function ($scope, $element, $attrs) {
        $scope.$parent.$watch('name', function (newVal) {
            if (newVal) {
                $scope.$parent.updatedSize = newVal.length;
            }
        }, true);
    }])
    .directive('enhancedTextarea', function () {
        return {
            restrict: 'A',
            replace: true,
            transclude: true,
            template: '<textarea ng-transclude></textarea>'
        };
    })
    .directive('notice', function () {
        return {
            restrict: 'A',
            require: '^enhanced',
            replace: true,
            scope: {
                updatedSize: '='
            },
            template: '<div>{{size}}</div>',
            link: function ($scope, $element, $attrs, enchancedCtrl) {
                $scope.$parent.$watch('updatedSize', function (newVal) {
                    if (newVal) {
                        $scope.size = newVal;
                    }
                }, true);
            }
        };
    });
