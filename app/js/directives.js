'use strict';

angular.module('myApp.directives', [])
    .controller('xTextAreaCtrl', ['$scope', '$element', '$attrs' , function ($scope, $element, $attrs) {
        console.log(this);
    }])
    .directive('xTextArea', function () {
        return {
            restrict: 'A',
            controller: 'textAreaCtrl',
            replace: true,
            template: '<textarea></textarea>'
        };
    })
    .directive('notice', function () {
        return {
            restrict: 'A',
            require: 'xTextArea',
            controller: 'xTextAreaCtrl',
            replace: true,
            scope: {
                updatedSize: '='
            },
            template: '<div>{{size}}</div>',
            link: function ($scope, $element, $attrs, xTextAreaCtrl) {
                $scope.$parent.$watch('updatedSize', function (newVal) {
                    if (newVal) {
                        $scope.size = newVal;
                    }
                }, true);
            }
        };
    });
