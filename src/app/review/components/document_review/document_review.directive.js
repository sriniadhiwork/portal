(function() {
    'use strict';

    angular
        .module('portal.review')
        .directive('aiDocumentReview', aiDocumentReview);

    /** @ngInject */
    function aiDocumentReview($log) {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/review/components/document_review/document_review.html',
            scope: {},
            controller: DocumentReviewController,
            controllerAs: 'vm',
            bindToController: {
                activeDocument: '=?'
            }
        };

        return directive;

        /** @ngInject */
        function DocumentReviewController($filter, $scope, x2js, commonService) {
            var vm = this;

            vm.cancel = cancel;
            vm.displayName = commonService.displayName;
            vm.whatSLeft = whatSLeft;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.transformedDocument = '';
                vm.doc = {};
                vm.displayType = 'html';
                vm.xslt = loadXMLDoc('assets/xslt/CDA_Style.xsl');
                $scope.$watch('vm.activeDocument', function (newDoc) {
                    if (newDoc) {
                        vm.transformedDocument = $filter('xslt')(newDoc.data, vm.xslt);
                        vm.doc = x2js.xml_str2json(vm.activeDocument.data);
                    }
                });
            }

            function cancel () {
                vm.activeDocument = undefined;
                vm.transformedDocument = '';
            }

            function whatSLeft () {
                var ret = angular.copy (vm.doc);
                if (ret && ret.ClinicalDocument) delete ret.ClinicalDocument.recordTarget;
                return ret;
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
