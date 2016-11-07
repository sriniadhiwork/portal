(function() {
    'use strict';

    angular
        .module('portal.search')
        .controller('PatientStageDetailsController', PatientStageDetailsController);

    /** @ngInject */
    function PatientStageDetailsController($log, $uibModalInstance, record) {
        var vm = this;

        vm.cancel = cancel;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.record = record;
        }

        function cancel () {
            $uibModalInstance.dismiss('staging details cancelled');
        }
    }
})();
