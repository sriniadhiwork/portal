(function () {
    'use strict';

    describe('review.aiAcfPatientList', function () {
        var vm, el, scope, $log, $timeout, $uibModal, $q, commonService, mock, actualOptions;
        mock = {
            fakeDocument: {data: "<document><made><of>XML</of></made></document"},
            userAcf: {"id":277,"identifier":"Humboldt-02","name":"Community College","phoneNumber":"555-1912","address":{"id":null,"lines":["92 Tenth Stn"],"city":"Mckinleyville","state":"CA","zipcode":"95501","country":null},"lastRead":1489156161065}
        };
        mock.fakeModal = {
            result: {
                then: function (confirmCallback, cancelCallback) {
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                }},
            close: function (item) { this.result.confirmCallBack(item); },
            dismiss: function (type) { this.result.cancelCallback(type); }
        };
        mock.fakeModalOptions = {
            templateUrl: 'app/review/components/patient_edit/patient_edit.html',
            controller: 'PatientEditController',
            controllerAs: 'vm',
            animation: false,
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
                patient: jasmine.any(Function)
            }
        };
        mock.patients = [{"id":2,"locationPatientId":null,"fullName":"John Smith","friendlyName":"John","dateOfBirth":1484629200000,"gender":"Male","phoneNumber":null,"ssn":null,"lastRead":1482942445639,"acf":{"id":178,"name":"Del Norte-03","phoneNumber":null,"address":null,"lastRead":1482942622025},
                          "locationMaps":[{"id":4,"patientId":2,"location":{"id":2,"externalId":"2","status":{"id":1,"name":"Active"},"parentOrgName":"John Muir Health Foundation","name":"John Muir Medical Center (Walnut Creek)","description":"Primary Walnut Creek-based hospital facility within the John Muir Health healthcare provider organization","type":"Hospital","address":{"id":null,"lines":["1601 Ygnacio Valley Rd"],"city":"Walnut Creek","state":"CA","zipcode":"94598","country":null},"externalLastUpdateDate":1478294180000,"creationDate":1482937059621,"lastModifiedDate":1482937059621,"endpoints":[{"id":114,"externalId":"12","endpointType":{"id":3,"name":"Retrieve Documents"},"endpointStatus":{"id":1,"name":"Active"},"adapter":"eHealthExchange","mimeTypes":[{"id":114,"mimeType":"application/xml"}],"payloadType":"HL7 CCD Document","publicKey":"MIIDxDCCAqygAwIBAgIBAjANBgkqhkiG9w0BAQsFADB7MQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTE/MD0GA1UECgw2Q2FsaWZvcm5pYSBBc3NvY2lhdGlvbiBvZiBIZWFsdGggSW5mb3JtYXRpb24gRXhjaGFuZ2VzMRYwFAYDVQQDDA1GaWN0aXRpb3VzIENBMB4XDTE2MTEwNzE1NDAzOVoXDTE4MTEwNzE1NDAzOVowUzELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExGjAYBgNVBAoMEUthaXNlciBQZXJtYW5lbnRlMRMwEQYDVQQDDAplaHgua3Aub3JnMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4zh+5F1uN2EK9VCUTGyJYfvAZ2I5Bq5qCntftsks5jR+RIe1WVukVUpjFIFr8QdtmdTI5Wmpgndbh+Pj8E3yHvdXTxosfWtCbxdrAAFfvjQ0PZzVpFHEYP/rCAy0/1lHDEdrNC9C3NNdM6GECdtITuCq7qsK5LJgopITcuvOZYXAOlqMLzXpJ8xsEueoTxIQFhY7SPt5Nl2rprSMJuoltF3ARZ+qU3fmiM4vPrSAJzcUjehu60LMUilwKwS6DEbYai2uJXjavsrWkg3TOcSGPwTD3IoOPjPo/z2QZ41zkD/uVDe1w+UtyjWqQaFaOfNByl0rfWDUhpZarqvEoYG1xwIDAQABo3sweTAJBgNVHRMEAjAAMCwGCWCGSAGG+EIBDQQfFh1PcGVuU1NMIEdlbmVyYXRlZCBDZXJ0aWZpY2F0ZTAdBgNVHQ4EFgQUmkEG1ij7vvcTpF3//Q0IcWyfoXAwHwYDVR0jBBgwFoAUhLxiknJV2lU6HddLzPbXXqzKMT4wDQYJKoZIhvcNAQELBQADggEBAFgMqoBuWBQcHCFrDgyqceQdD9FXzbAIAxHwox6dpd1G4R5/bencf9YlALv9yOJNWz93GJ2fAtimGCICYYek1GmnK6dJ2BvBndygP8qE1Bbvv5/5yfxkm54TMR5mQrllZbPq8HFAJKnipP4PkThjjVWrttgKlklQjdjvEFkfuFth+DKkUZalgQ9WMN6nUxNCeTTOtmsWZqp0GDQQfxmhuk4/7lE33F6OkY9zQTT49UJbtITeSsvr9fzV449wjcR91MyX3zkybDe+Qlih0eR+FJDSJn5XjjSFkNOLgwb25R7U2wfFkVd69N/VW+Bvj6QsW+kg7mUdvOreIX7w1XwzmFo=","url":"http://localhost:9080/retrieveDocumentSet","externalLastUpdateDate":1478623432000,"creationDate":1482942461119,"lastModifiedDate":1482942461119},{"id":112,"externalId":"11","endpointType":{"id":2,"name":"Query for Documents"},"endpointStatus":{"id":1,"name":"Active"},"adapter":"eHealthExchange","mimeTypes":[{"id":112,"mimeType":"application/xml"}],"payloadType":"HL7 CCD Document","publicKey":"MIIDxDCCAqygAwIBAgIBAjANBgkqhkiG9w0BAQsFADB7MQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTE/MD0GA1UECgw2Q2FsaWZvcm5pYSBBc3NvY2lhdGlvbiBvZiBIZWFsdGggSW5mb3JtYXRpb24gRXhjaGFuZ2VzMRYwFAYDVQQDDA1GaWN0aXRpb3VzIENBMB4XDTE2MTEwNzE1NDAzOVoXDTE4MTEwNzE1NDAzOVowUzELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExGjAYBgNVBAoMEUthaXNlciBQZXJtYW5lbnRlMRMwEQYDVQQDDAplaHgua3Aub3JnMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4zh+5F1uN2EK9VCUTGyJYfvAZ2I5Bq5qCntftsks5jR+RIe1WVukVUpjFIFr8QdtmdTI5Wmpgndbh+Pj8E3yHvdXTxosfWtCbxdrAAFfvjQ0PZzVpFHEYP/rCAy0/1lHDEdrNC9C3NNdM6GECdtITuCq7qsK5LJgopITcuvOZYXAOlqMLzXpJ8xsEueoTxIQFhY7SPt5Nl2rprSMJuoltF3ARZ+qU3fmiM4vPrSAJzcUjehu60LMUilwKwS6DEbYai2uJXjavsrWkg3TOcSGPwTD3IoOPjPo/z2QZ41zkD/uVDe1w+UtyjWqQaFaOfNByl0rfWDUhpZarqvEoYG1xwIDAQABo3sweTAJBgNVHRMEAjAAMCwGCWCGSAGG+EIBDQQfFh1PcGVuU1NMIEdlbmVyYXRlZCBDZXJ0aWZpY2F0ZTAdBgNVHQ4EFgQUmkEG1ij7vvcTpF3//Q0IcWyfoXAwHwYDVR0jBBgwFoAUhLxiknJV2lU6HddLzPbXXqzKMT4wDQYJKoZIhvcNAQELBQADggEBAFgMqoBuWBQcHCFrDgyqceQdD9FXzbAIAxHwox6dpd1G4R5/bencf9YlALv9yOJNWz93GJ2fAtimGCICYYek1GmnK6dJ2BvBndygP8qE1Bbvv5/5yfxkm54TMR5mQrllZbPq8HFAJKnipP4PkThjjVWrttgKlklQjdjvEFkfuFth+DKkUZalgQ9WMN6nUxNCeTTOtmsWZqp0GDQQfxmhuk4/7lE33F6OkY9zQTT49UJbtITeSsvr9fzV449wjcR91MyX3zkybDe+Qlih0eR+FJDSJn5XjjSFkNOLgwb25R7U2wfFkVd69N/VW+Bvj6QsW+kg7mUdvOreIX7w1XwzmFo=","url":"http://localhost:9080/documentQuery","externalLastUpdateDate":1478623421000,"creationDate":1482942461119,"lastModifiedDate":1482942461119},{"id":113,"externalId":"10","endpointType":{"id":1,"name":"Patient Discovery"},"endpointStatus":{"id":1,"name":"Active"},"adapter":"eHealthExchange","mimeTypes":[{"id":113,"mimeType":"application/xml"}],"payloadType":"HL7 CCD Document","publicKey":"MIIDxDCCAqygAwIBAgIBAjANBgkqhkiG9w0BAQsFADB7MQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTE/MD0GA1UECgw2Q2FsaWZvcm5pYSBBc3NvY2lhdGlvbiBvZiBIZWFsdGggSW5mb3JtYXRpb24gRXhjaGFuZ2VzMRYwFAYDVQQDDA1GaWN0aXRpb3VzIENBMB4XDTE2MTEwNzE1NDAzOVoXDTE4MTEwNzE1NDAzOVowUzELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExGjAYBgNVBAoMEUthaXNlciBQZXJtYW5lbnRlMRMwEQYDVQQDDAplaHgua3Aub3JnMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4zh+5F1uN2EK9VCUTGyJYfvAZ2I5Bq5qCntftsks5jR+RIe1WVukVUpjFIFr8QdtmdTI5Wmpgndbh+Pj8E3yHvdXTxosfWtCbxdrAAFfvjQ0PZzVpFHEYP/rCAy0/1lHDEdrNC9C3NNdM6GECdtITuCq7qsK5LJgopITcuvOZYXAOlqMLzXpJ8xsEueoTxIQFhY7SPt5Nl2rprSMJuoltF3ARZ+qU3fmiM4vPrSAJzcUjehu60LMUilwKwS6DEbYai2uJXjavsrWkg3TOcSGPwTD3IoOPjPo/z2QZ41zkD/uVDe1w+UtyjWqQaFaOfNByl0rfWDUhpZarqvEoYG1xwIDAQABo3sweTAJBgNVHRMEAjAAMCwGCWCGSAGG+EIBDQQfFh1PcGVuU1NMIEdlbmVyYXRlZCBDZXJ0aWZpY2F0ZTAdBgNVHQ4EFgQUmkEG1ij7vvcTpF3//Q0IcWyfoXAwHwYDVR0jBBgwFoAUhLxiknJV2lU6HddLzPbXXqzKMT4wDQYJKoZIhvcNAQELBQADggEBAFgMqoBuWBQcHCFrDgyqceQdD9FXzbAIAxHwox6dpd1G4R5/bencf9YlALv9yOJNWz93GJ2fAtimGCICYYek1GmnK6dJ2BvBndygP8qE1Bbvv5/5yfxkm54TMR5mQrllZbPq8HFAJKnipP4PkThjjVWrttgKlklQjdjvEFkfuFth+DKkUZalgQ9WMN6nUxNCeTTOtmsWZqp0GDQQfxmhuk4/7lE33F6OkY9zQTT49UJbtITeSsvr9fzV449wjcR91MyX3zkybDe+Qlih0eR+FJDSJn5XjjSFkNOLgwb25R7U2wfFkVd69N/VW+Bvj6QsW+kg7mUdvOreIX7w1XwzmFo=","url":"http://localhost:9080/patientDiscovery","externalLastUpdateDate":1478623380000,"creationDate":1482942461119,"lastModifiedDate":1482942461119}]},"documentsQueryStatus":"Successful","documentsQueryStart":1482942461118,"documentsQueryEnd":1482942487857,
                                           "documents":[{"id":"4","cached":false,"locationMapId":4,"patient":null,"status":null,"className":"SUMMARIZATION OF EPISODE NOTE","confidentiality":"Normal","format":"HL7 CCD Document","name":"Physical Test","description":null,"size":"35452","creationTime":"20080516","identifier":{"homeCommunityId":"urn:oid:2.16.840.1.113883.3.166","repositoryUniqueId":"2.16.840.1.113883.3.166.3.1","documentUniqueId":"129.6.58.92.147"}},
                                                        {"id":"5","cached":false,"locationMapId":4,"patient":null,"status":null,"className":"ALLERGY NOTE","confidentiality":"High","format":"HL7 CCD Document","name":"Hospital Admission","description":null,"size":"35400","creationTime":"20080515","identifier":{"homeCommunityId":"urn:oid:2.16.840.1.113883.3.166","repositoryUniqueId":"2.16.840.1.113883.3.166.3.1","documentUniqueId":"129.6.58.92.146"}}]},
                                          {"id":3,"patientId":2,"location":{"id":2,"externalId":"2","status":{"id":1,"name":"Active"},"parentOrgName":"John Muir Health Foundation","name":"John Muir Medical Center (Walnut Creek)","description":"Primary Walnut Creek-based hospital facility within the John Muir Health healthcare provider organization","type":"Hospital","address":{"id":null,"lines":["1601 Ygnacio Valley Rd"],"city":"Walnut Creek","state":"CA","zipcode":"94598","country":null},"externalLastUpdateDate":1478294180000,"creationDate":1482937059621,"lastModifiedDate":1482937059621,"endpoints":[{"id":114,"externalId":"12","endpointType":{"id":3,"name":"Retrieve Documents"},"endpointStatus":{"id":1,"name":"Active"},"adapter":"eHealthExchange","mimeTypes":[{"id":114,"mimeType":"application/xml"}],"payloadType":"HL7 CCD Document","publicKey":"MIIDxDCCAqygAwIBAgIBAjANBgkqhkiG9w0BAQsFADB7MQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTE/MD0GA1UECgw2Q2FsaWZvcm5pYSBBc3NvY2lhdGlvbiBvZiBIZWFsdGggSW5mb3JtYXRpb24gRXhjaGFuZ2VzMRYwFAYDVQQDDA1GaWN0aXRpb3VzIENBMB4XDTE2MTEwNzE1NDAzOVoXDTE4MTEwNzE1NDAzOVowUzELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExGjAYBgNVBAoMEUthaXNlciBQZXJtYW5lbnRlMRMwEQYDVQQDDAplaHgua3Aub3JnMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4zh+5F1uN2EK9VCUTGyJYfvAZ2I5Bq5qCntftsks5jR+RIe1WVukVUpjFIFr8QdtmdTI5Wmpgndbh+Pj8E3yHvdXTxosfWtCbxdrAAFfvjQ0PZzVpFHEYP/rCAy0/1lHDEdrNC9C3NNdM6GECdtITuCq7qsK5LJgopITcuvOZYXAOlqMLzXpJ8xsEueoTxIQFhY7SPt5Nl2rprSMJuoltF3ARZ+qU3fmiM4vPrSAJzcUjehu60LMUilwKwS6DEbYai2uJXjavsrWkg3TOcSGPwTD3IoOPjPo/z2QZ41zkD/uVDe1w+UtyjWqQaFaOfNByl0rfWDUhpZarqvEoYG1xwIDAQABo3sweTAJBgNVHRMEAjAAMCwGCWCGSAGG+EIBDQQfFh1PcGVuU1NMIEdlbmVyYXRlZCBDZXJ0aWZpY2F0ZTAdBgNVHQ4EFgQUmkEG1ij7vvcTpF3//Q0IcWyfoXAwHwYDVR0jBBgwFoAUhLxiknJV2lU6HddLzPbXXqzKMT4wDQYJKoZIhvcNAQELBQADggEBAFgMqoBuWBQcHCFrDgyqceQdD9FXzbAIAxHwox6dpd1G4R5/bencf9YlALv9yOJNWz93GJ2fAtimGCICYYek1GmnK6dJ2BvBndygP8qE1Bbvv5/5yfxkm54TMR5mQrllZbPq8HFAJKnipP4PkThjjVWrttgKlklQjdjvEFkfuFth+DKkUZalgQ9WMN6nUxNCeTTOtmsWZqp0GDQQfxmhuk4/7lE33F6OkY9zQTT49UJbtITeSsvr9fzV449wjcR91MyX3zkybDe+Qlih0eR+FJDSJn5XjjSFkNOLgwb25R7U2wfFkVd69N/VW+Bvj6QsW+kg7mUdvOreIX7w1XwzmFo=","url":"http://localhost:9080/retrieveDocumentSet","externalLastUpdateDate":1478623432000,"creationDate":1482942461119,"lastModifiedDate":1482942461119},{"id":112,"externalId":"11","endpointType":{"id":2,"name":"Query for Documents"},"endpointStatus":{"id":1,"name":"Active"},"adapter":"eHealthExchange","mimeTypes":[{"id":112,"mimeType":"application/xml"}],"payloadType":"HL7 CCD Document","publicKey":"MIIDxDCCAqygAwIBAgIBAjANBgkqhkiG9w0BAQsFADB7MQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTE/MD0GA1UECgw2Q2FsaWZvcm5pYSBBc3NvY2lhdGlvbiBvZiBIZWFsdGggSW5mb3JtYXRpb24gRXhjaGFuZ2VzMRYwFAYDVQQDDA1GaWN0aXRpb3VzIENBMB4XDTE2MTEwNzE1NDAzOVoXDTE4MTEwNzE1NDAzOVowUzELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExGjAYBgNVBAoMEUthaXNlciBQZXJtYW5lbnRlMRMwEQYDVQQDDAplaHgua3Aub3JnMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4zh+5F1uN2EK9VCUTGyJYfvAZ2I5Bq5qCntftsks5jR+RIe1WVukVUpjFIFr8QdtmdTI5Wmpgndbh+Pj8E3yHvdXTxosfWtCbxdrAAFfvjQ0PZzVpFHEYP/rCAy0/1lHDEdrNC9C3NNdM6GECdtITuCq7qsK5LJgopITcuvOZYXAOlqMLzXpJ8xsEueoTxIQFhY7SPt5Nl2rprSMJuoltF3ARZ+qU3fmiM4vPrSAJzcUjehu60LMUilwKwS6DEbYai2uJXjavsrWkg3TOcSGPwTD3IoOPjPo/z2QZ41zkD/uVDe1w+UtyjWqQaFaOfNByl0rfWDUhpZarqvEoYG1xwIDAQABo3sweTAJBgNVHRMEAjAAMCwGCWCGSAGG+EIBDQQfFh1PcGVuU1NMIEdlbmVyYXRlZCBDZXJ0aWZpY2F0ZTAdBgNVHQ4EFgQUmkEG1ij7vvcTpF3//Q0IcWyfoXAwHwYDVR0jBBgwFoAUhLxiknJV2lU6HddLzPbXXqzKMT4wDQYJKoZIhvcNAQELBQADggEBAFgMqoBuWBQcHCFrDgyqceQdD9FXzbAIAxHwox6dpd1G4R5/bencf9YlALv9yOJNWz93GJ2fAtimGCICYYek1GmnK6dJ2BvBndygP8qE1Bbvv5/5yfxkm54TMR5mQrllZbPq8HFAJKnipP4PkThjjVWrttgKlklQjdjvEFkfuFth+DKkUZalgQ9WMN6nUxNCeTTOtmsWZqp0GDQQfxmhuk4/7lE33F6OkY9zQTT49UJbtITeSsvr9fzV449wjcR91MyX3zkybDe+Qlih0eR+FJDSJn5XjjSFkNOLgwb25R7U2wfFkVd69N/VW+Bvj6QsW+kg7mUdvOreIX7w1XwzmFo=","url":"http://localhost:9080/documentQuery","externalLastUpdateDate":1478623421000,"creationDate":1482942461119,"lastModifiedDate":1482942461119},{"id":113,"externalId":"10","endpointType":{"id":1,"name":"Patient Discovery"},"endpointStatus":{"id":1,"name":"Active"},"adapter":"eHealthExchange","mimeTypes":[{"id":113,"mimeType":"application/xml"}],"payloadType":"HL7 CCD Document","publicKey":"MIIDxDCCAqygAwIBAgIBAjANBgkqhkiG9w0BAQsFADB7MQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTE/MD0GA1UECgw2Q2FsaWZvcm5pYSBBc3NvY2lhdGlvbiBvZiBIZWFsdGggSW5mb3JtYXRpb24gRXhjaGFuZ2VzMRYwFAYDVQQDDA1GaWN0aXRpb3VzIENBMB4XDTE2MTEwNzE1NDAzOVoXDTE4MTEwNzE1NDAzOVowUzELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExGjAYBgNVBAoMEUthaXNlciBQZXJtYW5lbnRlMRMwEQYDVQQDDAplaHgua3Aub3JnMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4zh+5F1uN2EK9VCUTGyJYfvAZ2I5Bq5qCntftsks5jR+RIe1WVukVUpjFIFr8QdtmdTI5Wmpgndbh+Pj8E3yHvdXTxosfWtCbxdrAAFfvjQ0PZzVpFHEYP/rCAy0/1lHDEdrNC9C3NNdM6GECdtITuCq7qsK5LJgopITcuvOZYXAOlqMLzXpJ8xsEueoTxIQFhY7SPt5Nl2rprSMJuoltF3ARZ+qU3fmiM4vPrSAJzcUjehu60LMUilwKwS6DEbYai2uJXjavsrWkg3TOcSGPwTD3IoOPjPo/z2QZ41zkD/uVDe1w+UtyjWqQaFaOfNByl0rfWDUhpZarqvEoYG1xwIDAQABo3sweTAJBgNVHRMEAjAAMCwGCWCGSAGG+EIBDQQfFh1PcGVuU1NMIEdlbmVyYXRlZCBDZXJ0aWZpY2F0ZTAdBgNVHQ4EFgQUmkEG1ij7vvcTpF3//Q0IcWyfoXAwHwYDVR0jBBgwFoAUhLxiknJV2lU6HddLzPbXXqzKMT4wDQYJKoZIhvcNAQELBQADggEBAFgMqoBuWBQcHCFrDgyqceQdD9FXzbAIAxHwox6dpd1G4R5/bencf9YlALv9yOJNWz93GJ2fAtimGCICYYek1GmnK6dJ2BvBndygP8qE1Bbvv5/5yfxkm54TMR5mQrllZbPq8HFAJKnipP4PkThjjVWrttgKlklQjdjvEFkfuFth+DKkUZalgQ9WMN6nUxNCeTTOtmsWZqp0GDQQfxmhuk4/7lE33F6OkY9zQTT49UJbtITeSsvr9fzV449wjcR91MyX3zkybDe+Qlih0eR+FJDSJn5XjjSFkNOLgwb25R7U2wfFkVd69N/VW+Bvj6QsW+kg7mUdvOreIX7w1XwzmFo=","url":"http://localhost:9080/patientDiscovery","externalLastUpdateDate":1478623380000,"creationDate":1482942461119,"lastModifiedDate":1482942461119}]},"documentsQueryStatus":"Active","documentsQueryStart":1482942445668,"documentsQueryEnd":1482942483726,
                                           "documents":[{"id":"3","cached":false,"locationMapId":3,"patient":null,"status":null,"className":"SUMMARIZATION OF EPISODE NOTE","confidentiality":"Normal","format":"HL7 CCD Document","name":"Physical Test","description":null,"size":"35452","creationTime":"20080516","identifier":{"homeCommunityId":"urn:oid:2.16.840.1.113883.3.166","repositoryUniqueId":"2.16.840.1.113883.3.166.3.1","documentUniqueId":"129.6.58.92.147"}}]}]},
                         {"id":1,"locationPatientId":null,"fullName":"Jane Doe","friendlyName":"Jane","dateOfBirth":1484629200000,"gender":"Female","phoneNumber":null,"ssn":null,"lastRead":1482941898443,"acf":{"id":178,"name":"Del Norte-03","phoneNumber":null,"address":null,"lastRead":1482942622025},
                          "locationMaps":[{"id":1,"patientId":1,"location":{"id":1,"externalId":"1","status":{"id":1,"name":"Active"},"parentOrgName":"John Muir Health Foundation","name":"John Muir Medical Center","description":"Concord-based hospital facility within the John Muir Health healthcare provider organization","type":"Hospital","address":{"id":null,"lines":["2540 East St"],"city":"Concord","state":"CA","zipcode":"94520","country":null},"externalLastUpdateDate":1478294131000,"creationDate":1482937059621,"lastModifiedDate":1482937059621,"endpoints":[{"id":110,"externalId":"3","endpointType":{"id":3,"name":"Retrieve Documents"},"endpointStatus":{"id":1,"name":"Active"},"adapter":"eHealthExchange","mimeTypes":[{"id":110,"mimeType":"application/xml"}],"payloadType":"HL7 CCD Document","publicKey":"MIIDxDCCAqygAwIBAgIBAjANBgkqhkiG9w0BAQsFADB7MQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTE/MD0GA1UECgw2Q2FsaWZvcm5pYSBBc3NvY2lhdGlvbiBvZiBIZWFsdGggSW5mb3JtYXRpb24gRXhjaGFuZ2VzMRYwFAYDVQQDDA1GaWN0aXRpb3VzIENBMB4XDTE2MTEwNzE1NDAzOVoXDTE4MTEwNzE1NDAzOVowUzELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExGjAYBgNVBAoMEUthaXNlciBQZXJtYW5lbnRlMRMwEQYDVQQDDAplaHgua3Aub3JnMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4zh+5F1uN2EK9VCUTGyJYfvAZ2I5Bq5qCntftsks5jR+RIe1WVukVUpjFIFr8QdtmdTI5Wmpgndbh+Pj8E3yHvdXTxosfWtCbxdrAAFfvjQ0PZzVpFHEYP/rCAy0/1lHDEdrNC9C3NNdM6GECdtITuCq7qsK5LJgopITcuvOZYXAOlqMLzXpJ8xsEueoTxIQFhY7SPt5Nl2rprSMJuoltF3ARZ+qU3fmiM4vPrSAJzcUjehu60LMUilwKwS6DEbYai2uJXjavsrWkg3TOcSGPwTD3IoOPjPo/z2QZ41zkD/uVDe1w+UtyjWqQaFaOfNByl0rfWDUhpZarqvEoYG1xwIDAQABo3sweTAJBgNVHRMEAjAAMCwGCWCGSAGG+EIBDQQfFh1PcGVuU1NMIEdlbmVyYXRlZCBDZXJ0aWZpY2F0ZTAdBgNVHQ4EFgQUmkEG1ij7vvcTpF3//Q0IcWyfoXAwHwYDVR0jBBgwFoAUhLxiknJV2lU6HddLzPbXXqzKMT4wDQYJKoZIhvcNAQELBQADggEBAFgMqoBuWBQcHCFrDgyqceQdD9FXzbAIAxHwox6dpd1G4R5/bencf9YlALv9yOJNWz93GJ2fAtimGCICYYek1GmnK6dJ2BvBndygP8qE1Bbvv5/5yfxkm54TMR5mQrllZbPq8HFAJKnipP4PkThjjVWrttgKlklQjdjvEFkfuFth+DKkUZalgQ9WMN6nUxNCeTTOtmsWZqp0GDQQfxmhuk4/7lE33F6OkY9zQTT49UJbtITeSsvr9fzV449wjcR91MyX3zkybDe+Qlih0eR+FJDSJn5XjjSFkNOLgwb25R7U2wfFkVd69N/VW+Bvj6QsW+kg7mUdvOreIX7w1XwzmFo=","url":"http://localhost:9080/retrieveDocumentSet","externalLastUpdateDate":1478623432000,"creationDate":1482942461119,"lastModifiedDate":1482942461119},{"id":109,"externalId":"1","endpointType":{"id":1,"name":"Patient Discovery"},"endpointStatus":{"id":1,"name":"Active"},"adapter":"eHealthExchange","mimeTypes":[{"id":109,"mimeType":"application/xml"}],"payloadType":"HL7 CCD Document","publicKey":"MIIDxDCCAqygAwIBAgIBAjANBgkqhkiG9w0BAQsFADB7MQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTE/MD0GA1UECgw2Q2FsaWZvcm5pYSBBc3NvY2lhdGlvbiBvZiBIZWFsdGggSW5mb3JtYXRpb24gRXhjaGFuZ2VzMRYwFAYDVQQDDA1GaWN0aXRpb3VzIENBMB4XDTE2MTEwNzE1NDAzOVoXDTE4MTEwNzE1NDAzOVowUzELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExGjAYBgNVBAoMEUthaXNlciBQZXJtYW5lbnRlMRMwEQYDVQQDDAplaHgua3Aub3JnMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4zh+5F1uN2EK9VCUTGyJYfvAZ2I5Bq5qCntftsks5jR+RIe1WVukVUpjFIFr8QdtmdTI5Wmpgndbh+Pj8E3yHvdXTxosfWtCbxdrAAFfvjQ0PZzVpFHEYP/rCAy0/1lHDEdrNC9C3NNdM6GECdtITuCq7qsK5LJgopITcuvOZYXAOlqMLzXpJ8xsEueoTxIQFhY7SPt5Nl2rprSMJuoltF3ARZ+qU3fmiM4vPrSAJzcUjehu60LMUilwKwS6DEbYai2uJXjavsrWkg3TOcSGPwTD3IoOPjPo/z2QZ41zkD/uVDe1w+UtyjWqQaFaOfNByl0rfWDUhpZarqvEoYG1xwIDAQABo3sweTAJBgNVHRMEAjAAMCwGCWCGSAGG+EIBDQQfFh1PcGVuU1NMIEdlbmVyYXRlZCBDZXJ0aWZpY2F0ZTAdBgNVHQ4EFgQUmkEG1ij7vvcTpF3//Q0IcWyfoXAwHwYDVR0jBBgwFoAUhLxiknJV2lU6HddLzPbXXqzKMT4wDQYJKoZIhvcNAQELBQADggEBAFgMqoBuWBQcHCFrDgyqceQdD9FXzbAIAxHwox6dpd1G4R5/bencf9YlALv9yOJNWz93GJ2fAtimGCICYYek1GmnK6dJ2BvBndygP8qE1Bbvv5/5yfxkm54TMR5mQrllZbPq8HFAJKnipP4PkThjjVWrttgKlklQjdjvEFkfuFth+DKkUZalgQ9WMN6nUxNCeTTOtmsWZqp0GDQQfxmhuk4/7lE33F6OkY9zQTT49UJbtITeSsvr9fzV449wjcR91MyX3zkybDe+Qlih0eR+FJDSJn5XjjSFkNOLgwb25R7U2wfFkVd69N/VW+Bvj6QsW+kg7mUdvOreIX7w1XwzmFo=","url":"http://localhost:9080/patientDiscovery","externalLastUpdateDate":1478623380000,"creationDate":1482942461119,"lastModifiedDate":1482942461119},{"id":111,"externalId":"2","endpointType":{"id":2,"name":"Query for Documents"},"endpointStatus":{"id":1,"name":"Active"},"adapter":"eHealthExchange","mimeTypes":[{"id":111,"mimeType":"application/xml"}],"payloadType":"HL7 CCD Document","publicKey":"MIIDxDCCAqygAwIBAgIBAjANBgkqhkiG9w0BAQsFADB7MQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTE/MD0GA1UECgw2Q2FsaWZvcm5pYSBBc3NvY2lhdGlvbiBvZiBIZWFsdGggSW5mb3JtYXRpb24gRXhjaGFuZ2VzMRYwFAYDVQQDDA1GaWN0aXRpb3VzIENBMB4XDTE2MTEwNzE1NDAzOVoXDTE4MTEwNzE1NDAzOVowUzELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExGjAYBgNVBAoMEUthaXNlciBQZXJtYW5lbnRlMRMwEQYDVQQDDAplaHgua3Aub3JnMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4zh+5F1uN2EK9VCUTGyJYfvAZ2I5Bq5qCntftsks5jR+RIe1WVukVUpjFIFr8QdtmdTI5Wmpgndbh+Pj8E3yHvdXTxosfWtCbxdrAAFfvjQ0PZzVpFHEYP/rCAy0/1lHDEdrNC9C3NNdM6GECdtITuCq7qsK5LJgopITcuvOZYXAOlqMLzXpJ8xsEueoTxIQFhY7SPt5Nl2rprSMJuoltF3ARZ+qU3fmiM4vPrSAJzcUjehu60LMUilwKwS6DEbYai2uJXjavsrWkg3TOcSGPwTD3IoOPjPo/z2QZ41zkD/uVDe1w+UtyjWqQaFaOfNByl0rfWDUhpZarqvEoYG1xwIDAQABo3sweTAJBgNVHRMEAjAAMCwGCWCGSAGG+EIBDQQfFh1PcGVuU1NMIEdlbmVyYXRlZCBDZXJ0aWZpY2F0ZTAdBgNVHQ4EFgQUmkEG1ij7vvcTpF3//Q0IcWyfoXAwHwYDVR0jBBgwFoAUhLxiknJV2lU6HddLzPbXXqzKMT4wDQYJKoZIhvcNAQELBQADggEBAFgMqoBuWBQcHCFrDgyqceQdD9FXzbAIAxHwox6dpd1G4R5/bencf9YlALv9yOJNWz93GJ2fAtimGCICYYek1GmnK6dJ2BvBndygP8qE1Bbvv5/5yfxkm54TMR5mQrllZbPq8HFAJKnipP4PkThjjVWrttgKlklQjdjvEFkfuFth+DKkUZalgQ9WMN6nUxNCeTTOtmsWZqp0GDQQfxmhuk4/7lE33F6OkY9zQTT49UJbtITeSsvr9fzV449wjcR91MyX3zkybDe+Qlih0eR+FJDSJn5XjjSFkNOLgwb25R7U2wfFkVd69N/VW+Bvj6QsW+kg7mUdvOreIX7w1XwzmFo=","url":"http://localhost:9080/documentQuery","externalLastUpdateDate":1478623421000,"creationDate":1482942461119,"lastModifiedDate":1482942461119}]},"documentsQueryStatus":"Failed","documentsQueryStart":1482941898469,"documentsQueryEnd":1482941898924,
                                           "documents":[]},
                                          {"id":2,"patientId":1,"location":{"id":2,"externalId":"2","status":{"id":1,"name":"Active"},"parentOrgName":"John Muir Health Foundation","name":"John Muir Medical Center (Walnut Creek)","description":"Primary Walnut Creek-based hospital facility within the John Muir Health healthcare provider organization","type":"Hospital","address":{"id":null,"lines":["1601 Ygnacio Valley Rd"],"city":"Walnut Creek","state":"CA","zipcode":"94598","country":null},"externalLastUpdateDate":1478294180000,"creationDate":1482937059621,"lastModifiedDate":1482937059621,"endpoints":[{"id":114,"externalId":"12","endpointType":{"id":3,"name":"Retrieve Documents"},"endpointStatus":{"id":1,"name":"Active"},"adapter":"eHealthExchange","mimeTypes":[{"id":114,"mimeType":"application/xml"}],"payloadType":"HL7 CCD Document","publicKey":"MIIDxDCCAqygAwIBAgIBAjANBgkqhkiG9w0BAQsFADB7MQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTE/MD0GA1UECgw2Q2FsaWZvcm5pYSBBc3NvY2lhdGlvbiBvZiBIZWFsdGggSW5mb3JtYXRpb24gRXhjaGFuZ2VzMRYwFAYDVQQDDA1GaWN0aXRpb3VzIENBMB4XDTE2MTEwNzE1NDAzOVoXDTE4MTEwNzE1NDAzOVowUzELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExGjAYBgNVBAoMEUthaXNlciBQZXJtYW5lbnRlMRMwEQYDVQQDDAplaHgua3Aub3JnMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4zh+5F1uN2EK9VCUTGyJYfvAZ2I5Bq5qCntftsks5jR+RIe1WVukVUpjFIFr8QdtmdTI5Wmpgndbh+Pj8E3yHvdXTxosfWtCbxdrAAFfvjQ0PZzVpFHEYP/rCAy0/1lHDEdrNC9C3NNdM6GECdtITuCq7qsK5LJgopITcuvOZYXAOlqMLzXpJ8xsEueoTxIQFhY7SPt5Nl2rprSMJuoltF3ARZ+qU3fmiM4vPrSAJzcUjehu60LMUilwKwS6DEbYai2uJXjavsrWkg3TOcSGPwTD3IoOPjPo/z2QZ41zkD/uVDe1w+UtyjWqQaFaOfNByl0rfWDUhpZarqvEoYG1xwIDAQABo3sweTAJBgNVHRMEAjAAMCwGCWCGSAGG+EIBDQQfFh1PcGVuU1NMIEdlbmVyYXRlZCBDZXJ0aWZpY2F0ZTAdBgNVHQ4EFgQUmkEG1ij7vvcTpF3//Q0IcWyfoXAwHwYDVR0jBBgwFoAUhLxiknJV2lU6HddLzPbXXqzKMT4wDQYJKoZIhvcNAQELBQADggEBAFgMqoBuWBQcHCFrDgyqceQdD9FXzbAIAxHwox6dpd1G4R5/bencf9YlALv9yOJNWz93GJ2fAtimGCICYYek1GmnK6dJ2BvBndygP8qE1Bbvv5/5yfxkm54TMR5mQrllZbPq8HFAJKnipP4PkThjjVWrttgKlklQjdjvEFkfuFth+DKkUZalgQ9WMN6nUxNCeTTOtmsWZqp0GDQQfxmhuk4/7lE33F6OkY9zQTT49UJbtITeSsvr9fzV449wjcR91MyX3zkybDe+Qlih0eR+FJDSJn5XjjSFkNOLgwb25R7U2wfFkVd69N/VW+Bvj6QsW+kg7mUdvOreIX7w1XwzmFo=","url":"http://localhost:9080/retrieveDocumentSet","externalLastUpdateDate":1478623432000,"creationDate":1482942461119,"lastModifiedDate":1482942461119},{"id":112,"externalId":"11","endpointType":{"id":2,"name":"Query for Documents"},"endpointStatus":{"id":1,"name":"Active"},"adapter":"eHealthExchange","mimeTypes":[{"id":112,"mimeType":"application/xml"}],"payloadType":"HL7 CCD Document","publicKey":"MIIDxDCCAqygAwIBAgIBAjANBgkqhkiG9w0BAQsFADB7MQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTE/MD0GA1UECgw2Q2FsaWZvcm5pYSBBc3NvY2lhdGlvbiBvZiBIZWFsdGggSW5mb3JtYXRpb24gRXhjaGFuZ2VzMRYwFAYDVQQDDA1GaWN0aXRpb3VzIENBMB4XDTE2MTEwNzE1NDAzOVoXDTE4MTEwNzE1NDAzOVowUzELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExGjAYBgNVBAoMEUthaXNlciBQZXJtYW5lbnRlMRMwEQYDVQQDDAplaHgua3Aub3JnMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4zh+5F1uN2EK9VCUTGyJYfvAZ2I5Bq5qCntftsks5jR+RIe1WVukVUpjFIFr8QdtmdTI5Wmpgndbh+Pj8E3yHvdXTxosfWtCbxdrAAFfvjQ0PZzVpFHEYP/rCAy0/1lHDEdrNC9C3NNdM6GECdtITuCq7qsK5LJgopITcuvOZYXAOlqMLzXpJ8xsEueoTxIQFhY7SPt5Nl2rprSMJuoltF3ARZ+qU3fmiM4vPrSAJzcUjehu60LMUilwKwS6DEbYai2uJXjavsrWkg3TOcSGPwTD3IoOPjPo/z2QZ41zkD/uVDe1w+UtyjWqQaFaOfNByl0rfWDUhpZarqvEoYG1xwIDAQABo3sweTAJBgNVHRMEAjAAMCwGCWCGSAGG+EIBDQQfFh1PcGVuU1NMIEdlbmVyYXRlZCBDZXJ0aWZpY2F0ZTAdBgNVHQ4EFgQUmkEG1ij7vvcTpF3//Q0IcWyfoXAwHwYDVR0jBBgwFoAUhLxiknJV2lU6HddLzPbXXqzKMT4wDQYJKoZIhvcNAQELBQADggEBAFgMqoBuWBQcHCFrDgyqceQdD9FXzbAIAxHwox6dpd1G4R5/bencf9YlALv9yOJNWz93GJ2fAtimGCICYYek1GmnK6dJ2BvBndygP8qE1Bbvv5/5yfxkm54TMR5mQrllZbPq8HFAJKnipP4PkThjjVWrttgKlklQjdjvEFkfuFth+DKkUZalgQ9WMN6nUxNCeTTOtmsWZqp0GDQQfxmhuk4/7lE33F6OkY9zQTT49UJbtITeSsvr9fzV449wjcR91MyX3zkybDe+Qlih0eR+FJDSJn5XjjSFkNOLgwb25R7U2wfFkVd69N/VW+Bvj6QsW+kg7mUdvOreIX7w1XwzmFo=","url":"http://localhost:9080/documentQuery","externalLastUpdateDate":1478623421000,"creationDate":1482942461119,"lastModifiedDate":1482942461119},{"id":113,"externalId":"10","endpointType":{"id":1,"name":"Patient Discovery"},"endpointStatus":{"id":1,"name":"Active"},"adapter":"eHealthExchange","mimeTypes":[{"id":113,"mimeType":"application/xml"}],"payloadType":"HL7 CCD Document","publicKey":"MIIDxDCCAqygAwIBAgIBAjANBgkqhkiG9w0BAQsFADB7MQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTE/MD0GA1UECgw2Q2FsaWZvcm5pYSBBc3NvY2lhdGlvbiBvZiBIZWFsdGggSW5mb3JtYXRpb24gRXhjaGFuZ2VzMRYwFAYDVQQDDA1GaWN0aXRpb3VzIENBMB4XDTE2MTEwNzE1NDAzOVoXDTE4MTEwNzE1NDAzOVowUzELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExGjAYBgNVBAoMEUthaXNlciBQZXJtYW5lbnRlMRMwEQYDVQQDDAplaHgua3Aub3JnMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4zh+5F1uN2EK9VCUTGyJYfvAZ2I5Bq5qCntftsks5jR+RIe1WVukVUpjFIFr8QdtmdTI5Wmpgndbh+Pj8E3yHvdXTxosfWtCbxdrAAFfvjQ0PZzVpFHEYP/rCAy0/1lHDEdrNC9C3NNdM6GECdtITuCq7qsK5LJgopITcuvOZYXAOlqMLzXpJ8xsEueoTxIQFhY7SPt5Nl2rprSMJuoltF3ARZ+qU3fmiM4vPrSAJzcUjehu60LMUilwKwS6DEbYai2uJXjavsrWkg3TOcSGPwTD3IoOPjPo/z2QZ41zkD/uVDe1w+UtyjWqQaFaOfNByl0rfWDUhpZarqvEoYG1xwIDAQABo3sweTAJBgNVHRMEAjAAMCwGCWCGSAGG+EIBDQQfFh1PcGVuU1NMIEdlbmVyYXRlZCBDZXJ0aWZpY2F0ZTAdBgNVHQ4EFgQUmkEG1ij7vvcTpF3//Q0IcWyfoXAwHwYDVR0jBBgwFoAUhLxiknJV2lU6HddLzPbXXqzKMT4wDQYJKoZIhvcNAQELBQADggEBAFgMqoBuWBQcHCFrDgyqceQdD9FXzbAIAxHwox6dpd1G4R5/bencf9YlALv9yOJNWz93GJ2fAtimGCICYYek1GmnK6dJ2BvBndygP8qE1Bbvv5/5yfxkm54TMR5mQrllZbPq8HFAJKnipP4PkThjjVWrttgKlklQjdjvEFkfuFth+DKkUZalgQ9WMN6nUxNCeTTOtmsWZqp0GDQQfxmhuk4/7lE33F6OkY9zQTT49UJbtITeSsvr9fzV449wjcR91MyX3zkybDe+Qlih0eR+FJDSJn5XjjSFkNOLgwb25R7U2wfFkVd69N/VW+Bvj6QsW+kg7mUdvOreIX7w1XwzmFo=","url":"http://localhost:9080/patientDiscovery","externalLastUpdateDate":1478623380000,"creationDate":1482942461119,"lastModifiedDate":1482942461119}]},"documentsQueryStatus":"Successful","documentsQueryStart":1482941898497,"documentsQueryEnd":1482941928329,
                                           "documents":[{"id":"2","cached":false,"locationMapId":2,"patient":null,"status":null,"className":"ALLERGY NOTE","confidentiality":"High","format":"HL7 CCD Document","name":"Hospital Admission","description":null,"size":"35400","creationTime":"20080515","identifier":{"homeCommunityId":"urn:oid:2.16.840.1.113883.3.166","repositoryUniqueId":"2.16.840.1.113883.3.166.3.1","documentUniqueId":"129.6.58.92.146"}},
                                                        {"id":"1","cached":false,"locationMapId":2,"patient":null,"status":null,"className":"SUMMARIZATION OF EPISODE NOTE","confidentiality":"Normal","format":"HL7 CCD Document","name":"Physical Test","description":null,"size":"35452","creationTime":"20080516","identifier":{"homeCommunityId":"urn:oid:2.16.840.1.113883.3.166","repositoryUniqueId":"2.16.840.1.113883.3.166.3.1","documentUniqueId":"129.6.58.92.147"}}]}]}];
        mock.documentList = [].concat(mock.patients[0].locationMaps[0].documents).concat(mock.patients[0].locationMaps[1].documents);
        for (var i = 0; i < mock.documentList.length; i++) {
            mock.documentList[i].location = 'John Muir Medical Center (Walnut Creek)';
        }

        beforeEach(function () {
            module('portal', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.cacheDocument = jasmine.createSpy('cacheDocument');
                    $delegate.convertDobString = jasmine.createSpy('convertDobString');
                    $delegate.dischargePatient = jasmine.createSpy('dischargePatient');
                    $delegate.displayName = jasmine.createSpy('displayName');
                    $delegate.getDocument = jasmine.createSpy('getDocument');
                    $delegate.getPatientsAtAcf = jasmine.createSpy('getPatientsAtAcf');
                    $delegate.getUserAcf = jasmine.createSpy('getUserAcf');
                    return $delegate;
                });
            });
            inject(function ($compile, $rootScope, _$log_, _$timeout_, _$q_, _$uibModal_, _commonService_) {
                $log = _$log_;
                $timeout = _$timeout_;
                $q = _$q_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return mock.fakeModal;
                });
                commonService = _commonService_;
                commonService.cacheDocument.and.returnValue($q.when({data: ''}));
                commonService.convertDobString.and.returnValue('fake');
                commonService.dischargePatient.and.returnValue($q.when({}));
                commonService.displayName.and.returnValue(mock.patients[0].givenName + ' ' + mock.patients[0].familyName);
                commonService.getDocument.and.returnValue($q.when(angular.copy(mock.fakeDocument)));
                commonService.getPatientsAtAcf.and.returnValue($q.when(angular.copy(mock.patients)));
                commonService.getUserAcf.and.returnValue(mock.userAcf);

                el = angular.element('<ai-acf-patient-list></ai-acf-patient-list>');

                scope = $rootScope.$new();
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
                scope.vm = vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.debug("\n Debug: " + $log.debug.logs.join("\n Debug: "));
            }
        });

        it('should be compiled', function () {
            expect(el.html()).not.toEqual(null);
        });

        it('should have isolate scope object with instanciate members', function () {
            expect(vm).toEqual(jasmine.any(Object));
            expect(vm.patients.length).toBe(2);
        });

        it('should have a way to cache a document', function () {
            var cachedDocPatients = angular.copy(mock.patients);
            cachedDocPatients[0].locationMaps[0].documents[0].cached = true;
            commonService.getPatientsAtAcf.and.returnValue($q.when(cachedDocPatients));

            expect(vm.patients[0].locationMaps[0].documents[0].cached).toBe(false);
            expect(vm.cacheDocument).toBeDefined();

            vm.cacheDocument(vm.patients[0], vm.patients[0].locationMaps[0].documents[0]);
            el.isolateScope().$digest();

            expect(commonService.cacheDocument).toHaveBeenCalledWith(2, '4');
            expect(vm.patients[0].locationMaps[0].documents[0].cached).toBe(true);
        });

        it('should refresh the info when a document is request to be cached', function () {
            spyOn(vm,'getPatientsAtAcf');
            vm.cacheDocument(vm.patients[0], vm.patients[0].locationMaps[0].documents[0]);
            el.isolateScope().$digest();
            expect(vm.getPatientsAtAcf).toHaveBeenCalled();
        });

        it('should know when a document is actively being cached', function () {
            var cachedDocPatients = angular.copy(mock.patients);
            cachedDocPatients[0].locationMaps[0].documents[0].status = 'Active';
            commonService.getPatientsAtAcf.and.returnValue($q.when(cachedDocPatients));

            vm.cacheDocument(vm.patients[0], vm.patients[0].locationMaps[0].documents[0]);
            el.isolateScope().$digest();
            expect(vm.patients[0].documentStatus).toEqual({total: 3, cached: 0, active: 1});
        });

        it('should not try to cache the same document twice', function () {
            var cachedDocPatients = angular.copy(mock.patients);
            cachedDocPatients[0].locationMaps[0].documents[0].cached = true;
            commonService.getPatientsAtAcf.and.returnValue($q.when(cachedDocPatients));

            vm.cacheDocument(vm.patients[0], vm.patients[0].locationMaps[0].documents[0]);
            el.isolateScope().$digest();

            vm.cacheDocument(vm.patients[0], vm.patients[0].locationMaps[0].documents[0]);
            el.isolateScope().$digest();
            expect(commonService.cacheDocument.calls.count()).toBe(1);
        });

        it('should have a way to get a document', function () {
            var patient = vm.patients[0];
            vm.cacheDocument(patient, patient.locationMaps[0].documents[0]);
            el.isolateScope().$digest();

            vm.getDocument(patient, patient.locationMaps[0].documents[0]);
            el.isolateScope().$digest();

            expect(commonService.getDocument).toHaveBeenCalledWith(2, '4');
            expect(vm.activeDocument).toEqual(patient.locationMaps[0].documents[0]);
        });

        it('should not re-call the service if the document is already cached', function () {
            var patient = vm.patients[0];
            vm.getDocument(patient, patient.locationMaps[0].documents[0]);
            el.isolateScope().$digest();

            vm.getDocument(patient, patient.locationMaps[0].documents[0]);
            el.isolateScope().$digest();
            expect(commonService.getDocument.calls.count()).toBe(1);
        });

        it('should have a way to discharge patients', function () {
            // given a patient in the queue
            expect(vm.patients.length).toBe(2);
            var result = angular.copy(mock.patients);
            result.splice(0,1);

            commonService.getPatientsAtAcf.and.returnValue($q.when(result));
            // when first result is cleared
            vm.dischargePatient(vm.patients[0]);
            el.isolateScope().$digest();

            // then expect to have one less patient in the queue
            expect(vm.patients.length).toBe(1);
        });

        it('should call commonService.dischargePatient on discharge', function () {
            vm.dischargePatient(vm.patients[0]);
            expect(commonService.dischargePatient).toHaveBeenCalledWith(2);
        });

        it('should know the user\'s ACF', function () {
            expect(vm.getUserAcf).toBeDefined();
            expect(vm.getUserAcf()).toEqual(mock.userAcf);
        });

        it('should have a function to get patients', function () {
            expect(vm.getPatientsAtAcf).toBeDefined();
            vm.getPatientsAtAcf();
            expect(commonService.getPatientsAtAcf).toHaveBeenCalled();
        });

        it('should call "getPatientsAtAcf" on load', function () {
            expect(commonService.getPatientsAtAcf).toHaveBeenCalled();
        });

        it('should update the activePatient if there is one on "getPatientsAtAcf"', function () {
            vm.getPatientsAtAcf();
            el.isolateScope().$digest();
            expect(vm.activePatient).toBe(null);
            vm.activePatient = vm.patients[1];
            vm.getPatientsAtAcf();
            el.isolateScope().$digest();
            expect(vm.activePatient).toEqual(vm.patients[1]);
        });

        it('should know if a patient\'s documents are cached', function () {
            var patient = vm.patients[0];
            expect(patient.documentStatus).toEqual({total: 3, cached: 0, active: 0});
        });

        it('should know how many documents a patient has', function () {
            var cachedDocPatients = angular.copy(mock.patients);
            cachedDocPatients[0].locationMaps[0].documents[0].cached = true;
            commonService.getPatientsAtAcf.and.returnValue($q.when(cachedDocPatients));

            vm.cacheDocument(vm.patients[0], vm.patients[0].locationMaps[0].documents[0]);
            el.isolateScope().$digest();
            expect(vm.patients[0].documentStatus).toEqual({total: 3, cached: 1, active: 0});
        });

        it('should know how many document queries are active', function () {
            expect(vm.countActive).toBeDefined();
            expect(vm.countActive(vm.patients[0])).toBe(1);
            vm.patients[0].locationMaps[1].documentsQueryStatus = 'Successful';
            expect(vm.countActive(vm.patients[0])).toBe(0);
        });

        it('should combine the documents for a patient', function () {
            expect(vm.patients[0].documents.length).toBe(mock.documentList.length);
            expect(vm.patients[0].documents).toEqual(mock.documentList);
            expect(vm.patients[0].documents[0]).toEqual(mock.documentList[0]);
        });

        it('should have a function to turn yyyymmdd into a parseable date', function () {
            expect(vm.translateDate).toBeDefined();
            expect(vm.translateDate(20080515)).toBe('2008-05-15');
        });

        it('should know what the panel title should be', function () {
            expect(vm.panelTitle).toBe('2 Active Patients at ' + mock.userAcf.identifier);
        });

        it('should have a way to activate a patient', function () {
            expect(vm.activatePatient).toBeDefined();
        });

        it('should change the title when a patient is activated', function () {
            vm.activatePatient(vm.patients[1]);
            expect(vm.panelTitle).toBe('Patient: Jane Doe (Jane)');
        });

        it('should handle a missing friendly name', function () {
            vm.patients[1].friendlyName = null;
            vm.activatePatient(vm.patients[1]);
            expect(vm.panelTitle).toBe('Patient: Jane Doe');
        });

        it('should set the active patient when activated', function () {
            expect(vm.activePatient).toBeNull();
            vm.activatePatient(vm.patients[0]);
            expect(vm.activePatient.id).toEqual(mock.patients[0].id);
        });

        it('should have a way to deactivate the patient', function () {
            expect(vm.deactivatePatient).toBeDefined();
        });

        it('should deactive a patient', function () {
            vm.activatePatient(vm.patients[0]);
            vm.deactivatePatient();
            expect(vm.activePatient).toBeNull();
        });

        it('should clear active documents on deactivation', function () {
            vm.activatePatient(vm.patients[0]);
            vm.deactivatePatient();
            vm.activeDocument = {document: 'text'};
            vm.deactivatePatient();

            expect(vm.activeDocument).toBe(undefined);
        });

        it('should refresh the patient list on deactivation', function () {
            vm.deactivatePatient();
            el.isolateScope().$digest();
            expect(commonService.getPatientsAtAcf).toHaveBeenCalled();
        });

        it('should reset the title on deactivation', function () {
            vm.activatePatient(vm.patients[0]);
            vm.deactivatePatient();
            expect(vm.panelTitle).toBe('2 Active Patients at ' + mock.userAcf.identifier);
        });

        it('should change the title when the number of patients changes', function () {
            commonService.getPatientsAtAcf.and.returnValue($q.when([mock.patients[1]]));
            // when first result is cleared
            vm.dischargePatient(vm.patients[0]);
            el.isolateScope().$digest();

            // then expect to have one less patient in the queue
            expect(vm.panelTitle).toBe('1 Active Patient at ' + mock.userAcf.identifier);
        });

        it('should deactivate a patient when a patient is discharged', function () {
            spyOn(vm,'deactivatePatient');
            vm.dischargePatient(vm.patients[0]);
            el.isolateScope().$digest();
            expect(vm.deactivatePatient).toHaveBeenCalled();
        });

        describe('refreshing', function () {
            it('should refresh the queries if there is one marked "Active"', function () {
                expect(commonService.getPatientsAtAcf.calls.count()).toBe(1);
                $timeout.flush();
                expect(commonService.getPatientsAtAcf.calls.count()).toBe(2);
            });

            it('should stop refreshing the queries if all are marked "Complete"', function () {
                expect(commonService.getPatientsAtAcf.calls.count()).toBe(1);
                $timeout.flush(vm.TIMEOUT_MILLIS);
                expect(commonService.getPatientsAtAcf.calls.count()).toBe(2);
                $timeout.flush(vm.TIMEOUT_MILLIS);
                expect(commonService.getPatientsAtAcf.calls.count()).toBe(3);
                $timeout.flush(vm.TIMEOUT_MILLIS);
                expect(commonService.getPatientsAtAcf.calls.count()).toBe(4);
                $timeout.flush(vm.TIMEOUT_MILLIS);
                expect(commonService.getPatientsAtAcf.calls.count()).toBe(5);

                var completePatients = angular.copy(vm.patients);
                completePatients[0].locationMaps[1].documentsQueryStatus = 'Successful';
                commonService.getPatientsAtAcf.and.returnValue($q.when(completePatients));
                $timeout.flush(vm.TIMEOUT_MILLIS);
                expect(commonService.getPatientsAtAcf.calls.count()).toBe(6);
                $timeout.flush(vm.TIMEOUT_MILLIS);
                expect(commonService.getPatientsAtAcf.calls.count()).toBe(6);
            });

            it('should refresh patients on a longer timescale when all are complete', function () {
                expect(commonService.getPatientsAtAcf.calls.count()).toBe(1);
                var completePatients = angular.copy(vm.patients);
                completePatients[0].locationMaps[1].documentsQueryStatus = 'Successful';
                commonService.getPatientsAtAcf.and.returnValue($q.when(completePatients));
                $timeout.flush(vm.TIMEOUT_MILLIS);
                expect(commonService.getPatientsAtAcf.calls.count()).toBe(2);
                $timeout.flush(vm.TIMEOUT_MILLIS * 10);
                expect(commonService.getPatientsAtAcf.calls.count()).toBe(3);
            });
        });

        describe('editing patients', function () {
            it('should have a function to edit patients', function () {
                expect(vm.editPatient).toBeDefined();
            });

            it('should create a modal instance when a patient is edited', function () {
                expect(vm.editPatientInstance).toBeUndefined();
                vm.editPatient(vm.patients[0]);
                expect(vm.editPatientInstance).toBeDefined();
                expect($uibModal.open).toHaveBeenCalledWith(mock.fakeModalOptions);
                expect(actualOptions.resolve.patient()).toEqual(vm.patients[0]);
            });

            it('should refresh the patient list if one was edited', function () {
                spyOn(vm,'getPatientsAtAcf');
                vm.editPatient(vm.patients[0]);
                vm.editPatientInstance.close();
                expect(vm.getPatientsAtAcf).toHaveBeenCalled();
            });

            it('should set the activePatient to the edited one if there is an activePatient', function () {
                vm.activatePatient(vm.patients[0]);
                vm.editPatient(vm.patients[0]);
                vm.editPatientInstance.close(vm.patients[1]);
                expect(vm.activePatient).toEqual(vm.patients[1]);
            });

            it('should set the activePatient to the edited one if there is an activePatient', function () {
                vm.editPatient(vm.patients[0]);
                vm.editPatientInstance.close(vm.patients[1]);
                expect(vm.activePatient).toBe(null);
            });

            it('should not trigger the controller if the modal is dismissed', function () {
                spyOn(vm,'getPatientsAtAcf');
                vm.editPatient(vm.patients[0]);
                vm.editPatientInstance.dismiss();
                expect(vm.getPatientsAtAcf).not.toHaveBeenCalled();
            });
        });
    });
})();
