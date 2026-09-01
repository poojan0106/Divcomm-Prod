public class EventFormFileUploadQueueable implements Queueable, Database.AllowsCallouts {

    private List<ContentDocumentLink> records;
    private Integer startIndex;
    private static final Integer BATCH_SIZE = 50;

    public EventFormFileUploadQueueable(List<ContentDocumentLink> records) {
        this(records, 0);
    }

    public EventFormFileUploadQueueable(List<ContentDocumentLink> records, Integer startIndex) {
        this.records = records;
        this.startIndex = startIndex;
    }

    public void execute(QueueableContext context) {

        if (records == null || records.isEmpty()) return;

        Integer endIndex = Math.min(startIndex + BATCH_SIZE, records.size());

        List<ContentDocumentLink> batch = new List<ContentDocumentLink>();

        for (Integer i = startIndex; i < endIndex; i++) {
            batch.add(records[i]);
        }

        //  Process current batch
        handleAfterInsert(batch);

        //  ONLY chain in production
        if (endIndex < records.size() && !Test.isRunningTest()) {
            System.enqueueJob(new EventFormFileUploadQueueable(records, endIndex));
        }
    }
    
    
    public static void handleAfterInsert(List<ContentDocumentLink> listOfContentDocumentList){
        try{ 
            Map<String, String> mapOfContentFile=new Map<String, String>();
            String base64EncodedString='';
            Map<String, String> mapOfForms=new Map<String, String>();
            String fileURL='';
            Map<String, String> mapOfFileURL=new Map<String, String>();
            List<Forms__c> UpdateListOfeventFormRecords=new List<Forms__c>();
            
            System.debug(listOfContentDocumentList.size());
            //Storing all the content document id and linked entity id from list of content document link.
            if(listOfContentDocumentList.size()>0){
                for(ContentDocumentLink contentDocumentLinkRecord:listOfContentDocumentList){
                    mapOfForms.put(contentDocumentLinkRecord.ContentDocumentId, contentDocumentLinkRecord.LinkedEntityId);
                }
                //Retrieving Product_Information record type.
                String eventFormRecordTypeId=[Select Id from RecordType where DeveloperName='Product_Information'].Id;
                //Retrieving Event form.
                if(eventFormRecordTypeId!='' && eventFormRecordTypeId!=null){
                    List<Forms__c> eventFormsWithRecordTypeProductInfo=[Select Id 
                                                                        from Forms__c where 
                                                                        Id IN:mapOfForms.values() 
                                                                        And RecordTypeId=:eventFormRecordTypeId];
                    //Filtering ContentDocumentId and Event forms based on RecordType and event forms.
                    if(eventFormsWithRecordTypeProductInfo.size()>0){
                        for(String contentDocumentId:mapOfForms.keySet()){
                            for(Forms__c correctLinkedEntityId:eventFormsWithRecordTypeProductInfo)
                                if(correctLinkedEntityId.Id==mapOfForms.get(contentDocumentId)){
                                    mapOfContentFile.put(contentDocumentId,mapOfForms.get(contentDocumentId));   
                                }
                        }
                        System.debug('line number 34'+mapOfContentFile);
                        //Retreiving content version for version data and file details
                        List<ContentVersion> contentVersionRecords=[SELECT Id, VersionData, ContentDocumentId, FileType, Title FROM 
                                                                    ContentVersion where 
                                                                    ContentDocumentId IN : mapOfContentFile.keySet() AND IsLatest=true];
                        System.debug(contentVersionRecords.size());
                        //Invoking method to store the file to AWS S3 from Salesforce and adding AWS url return from invoked method with event form Id in map.
                        if(contentVersionRecords.size()>0){
                            for(ContentVersion contentVersionRecord:contentVersionRecords){
                                if(contentVersionRecord.VersionData!=null){
                                    base64EncodedString = EncodingUtil.base64Encode(contentVersionRecord.VersionData);
                                    System.debug(base64EncodedString);
                                    fileURL=FileSizeChecker.uploadToS3(base64EncodedString, contentVersionRecord.Title, contentVersionRecord.FileType, '', mapOfContentFile.get(contentVersionRecord.ContentDocumentId));
                                    System.debug(fileURL);
                                    if(fileURL!=null && fileURL!=''){
                                        mapOfFileURL.put(mapOfContentFile.get(contentVersionRecord.ContentDocumentId), fileURL);
                                    }
                                    
                                    
                                }
                            }
                            //Assigning "AWS Url", "Uploaded to AWS" field values to update the event form
                            if(mapOfFileURL.size()>0){
                                for(String eventFormId:mapOfFileURL.keySet()){
                                    Forms__c eventForm=new Forms__c();
                                    eventForm.Id=eventFormId;
                                    eventForm.logo_url__c=mapOfFileURL.get(eventFormId);//Field name is not mentioned in the document to store the aws URL.
                                    eventForm.Uploaded_to_AWS__c=true;
                                    UpdateListOfeventFormRecords.add(eventForm);
                                }
                                //update UpdateListOfeventFormRecords;
                                if(UpdateListOfeventFormRecords.size()>0){
                                    Database.SaveResult[] results = Database.update(UpdateListOfeventFormRecords, false);
                                    
                                    for (Database.SaveResult sr : results) {
                                        if (sr.isSuccess()) {
                                            System.debug('Record updated successfully: ' + sr.getId());
                                        } else {
                                            for (Database.Error err : sr.getErrors()) {
                                                System.debug('Error: ' + err.getMessage());
                                            }
                                        }
                                    }
                                }    
                            }
                        }
                        
                    }
                }
            }
        }
        catch (DmlException e) {
            System.debug('DML Exception: ' + e.getMessage());
        } catch (QueryException e) {
            System.debug('Query Exception: ' + e.getMessage());
        } catch (Exception e) {
            System.debug('An unexpected error occurred: ' + e.getMessage());
        }
    }
}