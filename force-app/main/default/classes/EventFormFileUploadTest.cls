@isTest
private class EventFormFileUploadTest {

    class MockS3Upload implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
            HttpResponse res = new HttpResponse();
            res.setStatusCode(200);
            res.setBody('https://mock-s3-url.com/file.pdf');
            return res;
        }
    }

    @testSetup
    static void setupData() {

        Account acc = new Account(Name = 'Test Account');
        insert acc;

        Contact con = new Contact(
            LastName = 'Test Contact',
            AccountId = acc.Id,
            Email = 'test@example.com'
        );
        insert con;
        
        Event__c eventRec = new Event__c(
            Name = 'Energy Exchange Australia - Perth - 2025',
            
            // Core Fields
            Active__c = false,
            Event_Category__c = 'FoodTech',
            Event_Code__c = 'EOIP24',
            
            // Dates (important in most logic)
            Open_Date__c = Date.newInstance(2024, 8, 13),
            Close_Date__c = DateTime.newInstance(2024, 8, 13, 2, 0, 0),
            Move_In_Date__c = DateTime.newInstance(2024, 8, 6, 2, 0, 0),
            Move_Out_Date__c = DateTime.newInstance(2024, 9, 7, 2, 0, 0),
            Cooling_Off_Date__c=Date.newInstance(2024, 10, 7),
            
            // Address & Info
            Website__c = 'https://example.com',
            Event_Coordinator_Email_Address__c='abc@gmail.com',
            Marketing_Coordinator_Email_Address__c='pqr@gmail.com',
            
            // Flags
            Experience_Site_Active__c = true,
            //   Contractor__c=acc.Id,
            Venue_Contact__c=con.Id,
            Event_Manager__c=UserInfo.getUserId(),
            ExpoCAD_ID__c='uey7236726',
            Event_Portfolio__c='Business'
        );
        
        insert eventRec;

        insert new Apex_Trigger_Control__c(
            Name = 'ApexTriggerControlRecord',
            SetupOwnerId = UserInfo.getOrganizationId(),
            Is_Active__c = true
        );

        insert new Amezon_s3__c(
            Name = 'Test Config',
            SetupOwnerId = UserInfo.getOrganizationId(),
            Access_Key_Id__c = 'testAccessKey',
            Secret_Access_Key__c = 'testSecretKey',
            Bucket_Name__c = 'test-bucket',
            Region__c = 'ap-south-1'
        );

        Id rtId = [
            SELECT Id FROM RecordType 
            WHERE SObjectType = 'Forms__c' 
            AND DeveloperName = 'Product_Information'
            LIMIT 1
        ].Id;

        //  IMPORTANT: only 49 records (NOT 100)
        List<Forms__c> formsList = new List<Forms__c>();
        for (Integer i = 0; i < 50; i++) {
            formsList.add(new Forms__c(
                Events__c = eventRec.Id,
                RecordTypeId = rtId
            ));
        }
        insert formsList;
    }

    @isTest
    static void testFileUpload_Bulk() {

        List<Forms__c> formsList = [SELECT Id FROM Forms__c];

        List<ContentVersion> versions = new List<ContentVersion>();
        for (Integer i = 0; i < formsList.size(); i++) {
            versions.add(new ContentVersion(
                Title = 'TestFile' + i,
                PathOnClient = 'TestFile' + i + '.pdf',
                VersionData = Blob.valueOf('Test Data'),
                IsMajorVersion = true
            ));
        }
        insert versions;

        versions = [
            SELECT Id, ContentDocumentId 
            FROM ContentVersion 
            WHERE Id IN :versions
        ];

        List<ContentDocumentLink> links = new List<ContentDocumentLink>();
        for (Integer i = 0; i < versions.size(); i++) {
            links.add(new ContentDocumentLink(
                ContentDocumentId = versions[i].ContentDocumentId,
                LinkedEntityId = formsList[i].Id,
                ShareType = 'V'
            ));
        }

        Test.setMock(HttpCalloutMock.class, new MockS3Upload());

        Test.startTest();
        insert links;
        Test.stopTest();

        List<Forms__c> updatedForms = [
            SELECT logo_url__c, Uploaded_to_AWS__c 
            FROM Forms__c
        ];

        Integer countUpdated = 0;

        for (Forms__c f : updatedForms) {
            if (f.Uploaded_to_AWS__c) {
                countUpdated++;
                System.assertNotEquals(null, f.logo_url__c);
            }
        }

        System.assert(countUpdated > 0);
    }
    
    @isTest
    static void testNoMatchingRecordType() {

        // Create Forms with different record type
        List<Forms__c> formsList = new List<Forms__c>();
        for(Integer i = 0; i < 2; i++){
            formsList.add(new Forms__c());
        }
        insert formsList;

        // Create file
        ContentVersion cv = new ContentVersion(
            Title = 'NoMatch',
            PathOnClient = 'NoMatch.pdf',
            VersionData = Blob.valueOf('Test'),
            IsMajorVersion = true
        );
        insert cv;

        cv = [SELECT ContentDocumentId FROM ContentVersion WHERE Id = :cv.Id];

        ContentDocumentLink link = new ContentDocumentLink(
            ContentDocumentId = cv.ContentDocumentId,
            LinkedEntityId = formsList[0].Id,
            ShareType = 'V'
        );

        Test.setMock(HttpCalloutMock.class, new MockS3Upload());

        Test.startTest();
        insert link;
        Test.stopTest();

        // Verify no update happened
        Forms__c form = [SELECT Uploaded_to_AWS__c FROM Forms__c WHERE Id = :formsList[0].Id];
        System.assertEquals(false, form.Uploaded_to_AWS__c, 'Should not update for wrong record type');
    }
}