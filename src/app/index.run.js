(function() {
    'use strict';

    angular
        .module('portal')
        .run(runBlock);

    /** @ngInject */
    function runBlock($log, $httpBackend, $window, API, AuthAPI) {

        var firstNames = ['Faustina', 'Janise', 'Dung', 'Chaya', 'Karry', 'Maye', 'Ericka', 'Apryl', 'Cara', 'Markus', 'Rosetta', 'Amie', 'Kris', 'Jerold', 'Lorena', 'Lanora', 'Tandra', 'Alvera', 'Keitha', 'Darlena', 'Ross', 'Hisako', 'Daniella', 'Bonny', 'Herma', 'Jacquline', 'Adan', 'Naoma', 'Katlyn', 'Gwyn', 'Hannah', 'Markus', 'Augustina', 'Dorothy', 'Fredrick', 'Clemente', 'Dawne', 'Courtney', 'Margherita', 'Adella'];
        var lastNames = ['Beene', 'Fairbank', 'Petrarca', 'Klingler', 'Melvin', 'Cheeseman', 'Clagon', 'Odriscoll', 'Monteith', 'Yates', 'Brandenburg', 'Bolz', 'Laughter', 'Chaisson', 'Plourde', 'Miltenberger', 'Zubia', 'Rapozo', 'Voit', 'Muriel', 'Houghtaling', 'Hubbell', 'Weldy', 'Becraft', 'Weinman', 'Shawver', 'Suda', 'Shakespeare', 'Prado', 'Newman', 'Coney', 'Reddout', 'Cothren', 'Arocho', 'Brittian', 'Ingalls', 'Kuhn', 'Munford', 'Kobel', 'Duwe'];
        var documents = [{title: 'Title of a doc', filetype: 'C-CDA 1'},
                         {title: 'A study in search', filetype: 'docx'},
                         {title: 'Living the dream', filetype: 'pdf'},
                         {title: 'Health stuff', filetype: 'xml'},
                         {title: 'Immunization', filetype: 'png'},
                         {title: 'Blood work', filetype: 'txt'},
                         {title: 'X-Rays', filetype: 'gif'},
                         {title: 'A thing that happened once', filetype: 'pptx'},
                         {title: 'Another title', filetype: 'C-CDA 2.2'}];
        var aDocument = [{data: "<document>\n<made>\n<of attribute='a value'>XML</of>\n</made>\n</document>"},
                         {data: "<doc ns='docstring'>\n<thing>some txt</thing>\n<another-thing>more text</another-thing>\n</doc>"},
                         {data: "<ccda version='1.1'>\n<item>1</item>\n<item>2</item>\n<item>3</item>\n</ccda>"}];
        var organizations = [{id: 1, name: 'Hospital', url: 'http://www.example.com', status: 'Active'},
                             {id: 2, name: 'EHR For Fun', url: 'http://www.example.com/2', status: 'Inactive'},
                             {id: 3, name: 'Ambulatory Center', url: 'http://www.example.com/3', status: 'Active'}];

        // fake backend data
        $httpBackend.whenGET (new RegExp(API + '/patients$')).respond(200, {results: makePeople(Math.floor(Math.random() * 6) + 3, 5)});
        $httpBackend.whenGET (new RegExp(API + '/patients/.*/documents$')).respond(200, {results: randomArray(documents, Math.floor(Math.random() * 6) + 1)});
        $httpBackend.whenGET (new RegExp(API + '/patients/.*/documents/.*')).respond(200, aDocument[Math.floor(Math.random() * aDocument.length)]);

        // real "go to actual endpoints" data
        $httpBackend.whenGET (new RegExp(API + '/acfs')).passThrough();
        $httpBackend.whenPOST(new RegExp(API + '/acfs')).passThrough();
        $httpBackend.whenPOST(new RegExp(API + '/search')).passThrough();
        $httpBackend.whenGET (new RegExp(API + '/organizations')).passThrough();
        $httpBackend.whenGET (new RegExp(API + '/queries')).passThrough();
        $httpBackend.whenPOST(new RegExp(API + '/queries')).passThrough();
        $httpBackend.whenGET (new RegExp(AuthAPI)).passThrough();
        $httpBackend.whenPOST(new RegExp(AuthAPI)).passThrough();
        $httpBackend.whenGET(/^app/).passThrough();

        $log.info('runBlock end');

        function makePeople(count, docCount) {
            var ret = [];
            for (var i = 0; i < count; i++) {
                var docList = randomArray(documents, Math.floor(Math.random() * docCount) + 1);
                ret.push({firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
                          lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
                          organization: organizations[Math.floor(Math.random() * organizations.length)],
                          documents: docList,
                          id: i});
            }
            return ret;
        }

        function randomArray(array, count) {
            var ret = [];
            for (var i = 0; i < count; i++) {
                ret.push(angular.copy(array[Math.floor(Math.random() * array.length)]));
                ret[i].name = ret[i].name + ' ' + (i + 1);
                ret[i].id = i;
            }
            return ret;
        }
    }
})();
