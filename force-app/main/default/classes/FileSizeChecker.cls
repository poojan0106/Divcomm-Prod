public class FileSizeChecker {
    @AuraEnabled
    public static Id uploadBase64Image(String base64Data, String fileName, Id recordId) {
        System.debug('recordId----->'+recordId);
        String base64Header = 'base64,';
        Integer idx = base64Data.indexOf(base64Header);
        if (idx == -1) {
            throw new AuraHandledException('Invalid base64 image data.');
        }
        
        String body = base64Data.substring(idx + base64Header.length());
        Blob fileBody = EncodingUtil.base64Decode(body);
        
        ContentVersion cv = new ContentVersion();
        cv.Title = fileName;
        cv.PathOnClient = '/' + fileName;
        cv.VersionData = fileBody;
        insert cv;
        
        Id contentDocumentId = [
            SELECT ContentDocumentId FROM ContentVersion WHERE Id = :cv.Id LIMIT 1
        ].ContentDocumentId;
        
        if (recordId != null && contentDocumentId != null) {
            ContentDocumentLink link = new ContentDocumentLink();
            link.ContentDocumentId = contentDocumentId;
            link.LinkedEntityId = recordId;
            link.ShareType = 'V';
            insert link;
        }
        
        return contentDocumentId;
    }
}