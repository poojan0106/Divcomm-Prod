trigger ContentDocumentLinkTriggerRCS on ContentDocumentLink (after insert) {

    if (Trigger.isAfter && Trigger.isInsert) {

        Apex_Trigger_Control__c triggerControl = Apex_Trigger_Control__c.getOrgDefaults();

        //  Proper null check
        if (triggerControl == null || !triggerControl.Is_Active__c) {
            return;
        }

        if (!Trigger.new.isEmpty()) {
            //  Pass all records to Queueable (chunking handled there)
            System.enqueueJob(new EventFormFileUploadQueueable(Trigger.new));
        }
    }
}