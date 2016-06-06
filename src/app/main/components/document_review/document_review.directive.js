(function() {
    'use strict';

    angular
        .module('portal.main')
        .directive('aiDocumentReview', aiDocumentReview);

    /** @ngInject */
    function aiDocumentReview() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/main/components/document_review/document_review.html',
            scope: {},
            controller: DocumentReviewController,
            controllerAs: 'vm',
            bindToController: {
                activeDocument: '=?'
            }
        };

        return directive;

        /** @ngInject */
        function DocumentReviewController() {
            var vm = this;

            vm.cancel = cancel;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
            }

            function cancel () {
                vm.activeDocument = undefined;
            }
        }
    }
})();
