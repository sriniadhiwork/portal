(function() {
    'use strict';

    angular
        .module('portal.main')
        .directive('aiDocumentReview', aiDocumentReview);

    /** @ngInject */
    function aiDocumentReview($log) {
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
                vm.xslt = loadXMLDoc('assets/xslt/sample.xsl');
            }

            function cancel () {
                vm.activeDocument = undefined;
            }

            ////////////////////////////////////////////////////////////////////

            function loadXMLDoc (filename) {
                var xhttp;
//                if ($window.ActiveXObject) {
//                    xhttp = new $window.ActiveXObject('Msxml2.XMLHTTP');
//                } else {
                    xhttp = new XMLHttpRequest();
//                }
                xhttp.open('GET', filename, false);
                try { xhttp.responseType = 'msxml-document' } catch(err) { $log.debug(err) } // Helping IE11
                xhttp.send('');
                return xhttp.responseText;
            }
        }
    }
})();
