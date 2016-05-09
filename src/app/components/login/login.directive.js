(function () {
    'use strict';

    angular
        .module('portal')
        .directive('aiLogin', aiLogin);

    /** @ngInject */
    function aiLogin () {
        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/components/login/login.html',
            scope: {},
            bindToController: {
                formClass: '@',
                pClass: '@',
                pClassFail: '@'
            },
            controllerAs: 'vm',
            controller: LoginController
        };

        return directive;

        /** @ngInject */
        function LoginController ($log, commonService) { //$scope, commonService, authService, $log, Idle, Keepalive) {
            var vm = this;

            vm.login = login;
            vm.logout = logout;

            vm.activityEnum = {
                LOGIN: 1,
                NONE: 2
            };

            activate();

            /////////////////////////////////////////////////////////

            function activate () {
                vm.activity = vm.activityEnum.LOGIN;
                $log.info(vm.activity);
/*                if (vm.isAuthed()) {
                    vm.activity = vm.activityEnum.NONE;
                } else {
                }
                vm.clear();
                $scope.$on('Keepalive', function() {
                    $log.info('Keepalive');

                    if (authService.isAuthed()) {
                        if (vm.activity === vm.activityEnum.RESET || vm.activity === vm.activityEnum.LOGIN) {
                            vm.activity = vm.activityEnum.NONE;
                        }
                        commonService.keepalive()
                            .then(function (response) {
                                authService.saveToken(response.token);
                            });
                    } else {
                        vm.activity = vm.activityEnum.LOGIN;
                        Idle.unwatch();
                    }
                });
                if (authService.isAuthed()) {
                    Idle.watch();
                }
                */
            }

            function login () {
                //                vm.message = '';
                commonService.login({username: vm.username, password: vm.password})
                    .then(function () {
                        vm.activity = vm.activityEnum.NONE;
                    });
/*                    .then(function (response) {
                        Idle.watch();
                        Keepalive.ping();
                        vm.clear();
                    }, function (error) {
                        vm.messageClass = vm.pClassFail;
                        vm.message = error.data.error;
                    });
                    */
            }

            function logout () {
                commonService.logout();
//                vm.clear();
//                Idle.unwatch();
            }
        }
    }
})();
