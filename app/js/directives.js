'use strict';

angular.module('myApp.directives', [])
    .directive('cmp', function () {
        return {
            restrict: 'E',
            controller: 'cmpCtrl',
            replace: true,
            transclude: true,
            scope: {
                name: '='
            },
            template: '<div ng-transclude></div>'
        };
    })
    .controller('cmpCtrl', ['$scope', '$element', '$attrs' , function ($scope, $element, $attrs) {
        $scope.$parent.$watch('name', function (newVal) {
            if (newVal) {
                $scope.$parent.updatedSize = newVal.length;
                console.log(newVal.length);
            }
        }, true);
    }])
    .directive('enhancedTextarea', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<textarea ng-transclude></textarea>'
        };
    })
    .directive('notice', function () {
        return {
            restrict: 'E',
            require: '^cmp',
            replace: true,
            scope: {
                updatedSize: '='
            },
            template: '<div>{{size}}</div>',
            link: function ($scope, $element, $attrs, cmpCtrl) {
                console.log(cmpCtrl);
                $scope.$parent.$watch('updatedSize', function (newVal) {
                    if (newVal) {
                        $scope.size = newVal;
                    }
                }, true);
            }
        };
    });
