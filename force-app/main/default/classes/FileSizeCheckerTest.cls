@isTest
public class FileSizeCheckerTest {
	@isTest
    static void getFileSizeChecker(){
        Account testAccount = new Account(Name = 'Test Account');
        insert testAccount;

        String fileContent = 'Hello World';
        Blob fileBlob = Blob.valueOf(fileContent);
        String base64Body = EncodingUtil.base64Encode(fileBlob);
        
        String base64Data = 'data:text/plain;base64,' + base64Body;
        String fileName = 'TestFile.txt';

        Test.startTest();
        Id contentDocumentId = FileSizeChecker.uploadBase64Image(base64Data, fileName, testAccount.Id);
        Test.stopTest();

        System.assertNotEquals(null, contentDocumentId, 'ContentDocumentId should not be null');

        List<ContentVersion> cvs = [
            SELECT Id, Title FROM ContentVersion WHERE Title = :fileName
        ];
        System.assertEquals(1, cvs.size(), 'One ContentVersion should be created');

        List<ContentDocumentLink> links = [
            SELECT Id, LinkedEntityId FROM ContentDocumentLink 
            WHERE LinkedEntityId = :testAccount.Id
        ];
        System.assertEquals(1, links.size(), 'One ContentDocumentLink should be created');
    }
}