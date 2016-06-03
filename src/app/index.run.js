(function() {
    'use strict';

    angular
        .module('portal')
        .run(runBlock);

    /** @ngInject */
    function runBlock($log, $httpBackend) {

        var patients = [{id:2, firstName: 'Joe', lastName: 'Rogan'},
                        {id:3, firstName: 'Sue', lastName: 'Samson'},
                        {id:5, firstName: 'Fred', lastName: 'Johnson'},
                        {id:6, firstName: 'Betty', lastName: 'McCready'},
                        {id:7, firstName: 'George', lastName: 'Trunch'},
                        {id:8, firstName: 'Lucy', lastName: 'Baker'},
                        {id:9, firstName: 'Bill', lastName: 'Miller'},
                        {id:10, firstName: 'Jen', lastName: 'ODonnel'},
                        {id:11, firstName: 'Rob', lastName: 'Block'},
                        {id:12, firstName: 'Kate', lastName: 'Robinson'},
                        {id:13, firstName: 'Alex', lastName: 'Smithsonion'},
                        {id:4, firstName: 'Bob', lastName: 'Jones'}];
        var documents = [{title: 'Title of a doc', filetype: 'C-CDA 1'},
                         {title: 'A study in search', filetype: 'docx'},
                         {title: 'Living the dream', filetype: 'pdf'},
                         {title: 'Health stuff', filetype: 'xml'},
                         {title: 'Immunization', filetype: 'png'},
                         {title: 'Blood work', filetype: 'txt'},
                         {title: 'X-Rays', filetype: 'gif'},
                         {title: 'A thing that happened once', filetype: 'pptx'},
                         {title: 'Another title', filetype: 'C-CDA 2.2'}];
        var aDocument = [{data: "<document><made><of>XML</of></made></document>"},
                         {data: "<doc><thing>some txt</thing><another-thing>more text</another-thing></doc>"},
                         {data: "<ccda><item>1</item><item>2</item><item>3</item></ccda>"}];

        $httpBackend.whenPOST('/rest/query/patient').respond(200, {results: randomArray(patients, Math.floor(Math.random() * 6) + 3)});
        $httpBackend.whenGET(/\/rest\/query\/patient\/.*\/documents$/).respond(200, {results: randomArray(documents, Math.floor(Math.random() * 6) + 1)});
        $httpBackend.whenGET(/\/rest\/query\/patient\/.*\/documents\/.*/).respond(200, aDocument[Math.floor(Math.random() * aDocument.length)]);

        $httpBackend.whenGET(/^app/).passThrough();
        $httpBackend.whenGET(/^\/auth/).passThrough();
        $log.info('runBlock end');

        function randomArray(array, count) {
            var ret = [];
            for (var i = 0; i < count; i++) {
                ret.push(angular.copy(array[Math.floor(Math.random() * array.length)]));
                ret[i].id = i;
            }
            return ret;
        }
    }

})();
