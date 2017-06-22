(function () {
    'use strict';

    angular
        .module('portal')
        .directive('aiFooter', aiFooter);

    /** @ngInject */
    function aiFooter () {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/footer/footer.html',
            scope: {},
            controller: FooterController,
            controllerAs: 'vm',
            bindToController: {},
        };

        return directive;

        /** @ngInject */
        function FooterController () {
            //var vm = this;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
            }
        }
    }
})();
