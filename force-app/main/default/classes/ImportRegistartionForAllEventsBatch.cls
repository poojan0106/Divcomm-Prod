/*************************
* Created By : Foram 
* Cereated Date : 12-09-2023
* Description : Import Registration from Evntsair and 
Create Contact/Lead, Registartion, Opportunity and Opportunity Products 
**************************/

public class ImportRegistartionForAllEventsBatch implements Database.Batchable<ResponseWrapper>, Database.AllowsCallouts {
    
    public String strEventId;
    public String sfeventId;
    Integer contactsLimit = 500;
    List<Contact> lstInsrtCon;
    List<Function__c> lstInsrtFun;
    List<Opportunity> lstInsrtOpp;
    List<PricebookEntry> lstInsertPricebookEntry;
    List<OpportunityLineItem> lstInsertOppProduct;
    Map<String, Id> mapofConEmailAndId = new Map<String, Id>();
    Map<String, Id> mapofLeadEmailAndId = new Map<String, Id>();
    Map<String, Id> mapOfEventConAndSFOppId = new Map<String, Id>();
    Map<String, Id> mapOfEventRegTypeIdAndSFPBentryId = new Map<String, Id>();
    Map<String, Decimal> mapOfEventRegTypeIdAndSFPBentryPrice = new Map<String, Decimal>();
    Map<String, Id> mapOfEventregTypeAndSFproId = new Map<String, Id>();
    Set<String> setOfCon = new Set<String>();
    
    //fetch current offset value from custom setting
    List<Manage_Eventsair_Apex_batch_All_Events__c> lstcustsett = [Select Id, Name, Offset__c, Is_Execute_Next__c from Manage_Eventsair_Apex_batch_All_Events__c LIMIT 1];
    
    
    public ImportRegistartionForAllEventsBatch(String eventId, String strsfeventId){
        strEventId = eventId;
        sfeventId = strsfeventId;
    }
    
    public Iterable<ResponseWrapper> start(Database.BatchableContext BC) {  
              
        System.debug('@@@ lstcustsett = '+lstcustsett);
        
        //get access token
        String strtoken = EventsAirOAuthTokenRequest.getAccessToken();
        
		//Prepare API Query        
       String graphqlQuery = '{' +
            '"query": "query GetEventData($eventId: ID!, $contactsLimit: PositiveInt!, $conoffset: NonNegativeInt!) {' +
            'event(id: $eventId) {' +
            'id,' +
            'startDate,' +
            'endDate,' +
            'registrations(limit: $contactsLimit, offset: $conoffset) {' +
            'id,' +
            'dateTime,' +
            'contact {' +
            'id,' +
            'lastName,' +
            'firstName,' +
            'title,' +
            'organizationName,'+
            'primaryEmail,'+                
            '},'+     
            'type {' +
            'id,' +
            'name,' +   
            'uniqueCode,' + 
            'fees {' +
            'amount,' +      
            '},'+
            '},'+
            'paymentDetails {' +
            'paymentStatus,'+
            'discountAmount,' +
            'adjustmentAmount,' +
            'taxAmount,' +
            'totalChargeAmount,'+     
            'discountCode {' +
            'code,' +
            '},'+
            '},'+
            '},' +
            'functionRegistrations(limit: $contactsLimit, offset: $conoffset) {' +
            'id,' +
            'tickets,'+            
            'contact {' +
            'id,' +
            'lastName,' +
            'firstName,' +
            'title,' +
            'organizationName,'+
            'primaryEmail,'+                
            '},'+      
            'feeType {' +
            'id,' +
            'name,' + 
            'uniqueCode,' + 
            'fees {' +
            'amount,' +      
            '},'+
            '},'+
            'function{' +
            'id,' +
            'name,' +
            'start,' +
            'date,' +
            'end,' +
            'overview,' +
            'details,' +
            '},'+
            'paymentDetails {' +
            'paymentStatus,'+
            'discountAmount,' +
            'adjustmentAmount,' +
            'taxAmount,' +
            'totalChargeAmount,'+     
            'discountCode {' +
            'code,' +
            '},'+
            '},'+
            '}'+
            'logo {' +
            'url,' +
            '}' +
            '}' +
            '}",' +
            '"variables": {' +
            '"eventId": "' + strEventId + '",' +
            '"contactsLimit": ' + contactsLimit + ',' +
            '"conoffset": ' + lstcustsett[0].Offset__c  + 
            '}' +
            '}';
        
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setTimeout(120000);
        request.setEndpoint(System.Label.EventsAir_API_Base_URL);
        request.setMethod('POST');
        request.setBody(graphqlQuery);
        request.setHeader('Content-Type', 'application/json');
        
        // Set the Authorization header
        request.setHeader('Authorization', 'Bearer ' + strtoken);
        
        HttpResponse response = http.send(request);
        System.debug('@@@ response = '+response);
        System.debug('@@@@ response = '+response.getBody());
        
        List<ResponseWrapper> lstofresponseWrapper = new List<ResponseWrapper>();
        ResponseWrapper responseWrapper = new ResponseWrapper();
        
        if (response.getStatusCode() == 200) {
            String responseBody = response.getBody(); 
            System.debug('@@@@ responseBody = '+responseBody);
            // Replace the with the correct format (reserved keyword)
            responseBody = responseBody.replace('"dateTime"', '"registrationDateTime"');
            responseBody = responseBody.replace('"date"', '"functiondate"');
            responseBody = responseBody.replace('"end"', '"functionend"');
            
            responseWrapper = (ResponseWrapper) JSON.deserialize(responseBody, ResponseWrapper.class);
            lstofresponseWrapper.add(responseWrapper);
        }        
        else{
            //update offset in custom setting
            lstcustsett[0].Is_Execute_Next__c = false;
            lstcustsett[0].Offset__c = 0;
            update lstcustsett;
        }        
        return lstofresponseWrapper;
    }
    
    public void execute(Database.BatchableContext BC, List<ResponseWrapper> responseWrapper) {
        
        String serializedResponseWrapper = JSON.serialize(responseWrapper[0]);
        
        List<Object> lsteventsairRegistrations = new List<Object>();
        List<Object> lsteventsairFuncRegistrations = new List<Object>();
        Map<String, Object> jsonResponse = (Map<String, Object>) JSON.deserializeUntyped(serializedResponseWrapper);
        System.debug('@@@ jsonResponse = '+jsonResponse);
        Map<String, Object> eventDatamap = (Map<String, Object>) jsonResponse.get('data');
        
        Map<String, Object> eventmap = (Map<String, Object>) eventDatamap.get('event');
        
        lsteventsairRegistrations = (List<Object>) eventmap.get('registrations');
        System.debug('@@@@ lsteventsairRegistrations size = '+lsteventsairRegistrations.size());
        
        lsteventsairFuncRegistrations = (List<Object>) eventmap.get('functionRegistrations');
        System.debug('@@@@ lsteventsairFuncRegistrations = '+lsteventsairFuncRegistrations.size());
        
        if(!lsteventsairRegistrations.isEmpty()) {
            createContacts(lsteventsairRegistrations, false); //create contact for registartion
            createRegisration(lsteventsairRegistrations, false); //create registartion
        }
        
        if(!lsteventsairFuncRegistrations.isEmpty()) {
            createContacts(lsteventsairFuncRegistrations, true); 	 //create contact for function registartion
            setupForFunctionReg(lsteventsairFuncRegistrations);		 //create function
            createRegisration(lsteventsairFuncRegistrations, true);  //create registartion
            //createOpportunityProduct(lsteventsairFuncRegistrations, true);    //create Opportunity product
        }
        
        if(lsteventsairRegistrations.isEmpty() && lsteventsairFuncRegistrations.isEmpty()) {
            //update offset in custom setting
            System.debug('@@@ All Data Synced');
            lstcustsett[0].Is_Execute_Next__c = false; //This is used to stop batch to run in recursion
            lstcustsett[0].Offset__c = 0;
            update lstcustsett;
        }
        
    }
    
    //create contact, Product2 and Opportunity
    public void createContacts(List<Object> lstobject, Boolean isFuncReg) {
        
        lstInsrtCon = new List<Contact>();
        lstInsrtOpp = new List<Opportunity>();
        List<Product2> lstInsertproduct = new List<Product2>();
        Set<String> setOfProdId = new Set<String>();
        
        Set<String> setOfDomainName = new Set<String>();
        Map<String, Id> mapOfDomainNameAndAccId = new Map<String, Id>();
        
        List<Lead> lstInsrtLead = new List<Lead>();
        
        // Loop through event's air registration data to check if need to create contact or lead based on account's domain name
        for (Object objEventReg : lstobject) {
            Map<String, Object> eventReg = (Map<String, Object>) objEventReg;
            Object eventcon = eventReg.get('contact'); // get contact information from registration map
            
            Map<String, Object> eventconmap = (Map<String, Object>) eventcon;
            
            String strevntconemail = (String) eventconmap.get('primaryEmail');            
            
            if(strevntconemail != null && strevntconemail != '') {
                String[] emailparts = strevntconemail.split('@');
                if (emailparts.size() > 1) {
                    setOfDomainName.add(emailparts[1].trim());
                    System.debug('@@@ setOfDomainName = '+setOfDomainName);
                }
            }
            else{
                String strconname = (String) eventconmap.get('firstName'); 
                System.debug('@@@ strconname = '+strconname);
            }
		}
        
        //if set contains any value then do soql on account and fill the mapOfDomainNameAndAccId Map
        if(setOfDomainName != null) {
            
            //fetch account based on contact's organization name and domain name (email)
            List<Account> lstAccount = [SELECT Id, Name, Domain_Name__c
                                        FROM Account 
                                        WHERE Domain_Name__c IN: setOfDomainName
                                        ];
            
            if(!lstAccount.isEmpty()) {
                for(Account objacc: lstAccount) {
                    mapOfDomainNameAndAccId.put(objacc.Domain_Name__c, objacc.Id);
                }                                                    
            }   
        }
        
        // Loop through event's air registration data to create Contacts
        for (Object objEventReg : lstobject) {
            Map<String, Object> eventReg = (Map<String, Object>) objEventReg;
            Object eventcon = eventReg.get('contact'); // get contact information from registration map
            
            Map<String, Object> eventconmap = (Map<String, Object>) eventcon;
            
            String strevntconId = (String) eventconmap.get('id');
            String strcontEmail = (String) eventconmap.get('primaryEmail');
            String strAccdomainname;
            
            //check if contact is already added in previous batch execuetion
            if(!setOfCon.contains(strevntconId)) {
                
                setOfCon.add(strevntconId);
                
                if(strcontEmail != null && strcontEmail != '') {
                    String[] emailparts = strcontEmail.split('@');
                    if (emailparts.size() > 1) {
                        strAccdomainname = emailparts[1].trim();
                    }
                }
                
                //check if create contact or Lead
                //create contact if fund the account based on domain name and create lead if not found
                
                if(mapOfDomainNameAndAccId.containsKey(strAccdomainname)) {
                    
                    // Contact field mapping start
                    Contact objcon = new Contact();
                    objcon.RecordTypeId = Schema.SObjectType.Contact.getRecordTypeInfosByDeveloperName().get('Visitor').getRecordTypeId();
                    
                    String strFirstName = (String) eventconmap.get('firstName');
                    if (strFirstName != null )  {
                        if(strFirstName.length() <= 40) {
                            objCon.FirstName = strFirstName;
                        } else {
                            objCon.FirstName = strFirstName.substring(0,40);
                        }
                    }
                    String strLastName = (String) eventconmap.get('lastName');
                    if(strLastName == null || strLastName == '') {
                        objcon.LastName = 'Unknown';
                    }
                    else{
                        objcon.LastName = strLastName;
                    }                
                    objcon.Organization_Name__c = (String) eventconmap.get('organizationName');
                    String stremail = (String) eventconmap.get('primaryEmail');
                    if(stremail != null && stremail != '') {
                        stremail = stremail.trim();
                        objcon.Email = stremail;
                    }                    
                    objcon.Business_Unit__c = 'Divcom';                    
                    objcon.AccountId = mapOfDomainNameAndAccId.get(strAccdomainname);    
                    lstInsrtCon.add(objcon);
                    // Contact field mapping end
                }
                else{
                    
                    //create lead field mapping start
                    Lead newLead = new Lead();
                    newLead.RecordTypeId = Schema.SObjectType.Lead.getRecordTypeInfosByDeveloperName().get('Visitor').getRecordTypeId();
                    String strFirstName = (String) eventconmap.get('firstName');
                    if (strFirstName != null )  {
                        if(strFirstName.length() <= 40) {
                            newLead.FirstName= strFirstName;
                        } else {
                            newLead.FirstName = strFirstName.substring(0,40);
                        }
                    }
                    
                    String strLastName = (String) eventconmap.get('lastName');
                    if(strLastName == null || strLastName == '') {
                        newLead.LastName = 'Unknown';
                    }
                    else{
                        newLead.LastName = strLastName;
                    }
                    String stremail = (String) eventconmap.get('primaryEmail');
                    if(stremail != null && stremail != '') {
                        stremail = stremail.trim();
                        newLead.Email = stremail;
                    } 
                    newLead.Event_Category__c = 'AOG Energy';
                    newLead.Business_Unit__c = 'Divcom';
                    String strOrganization = (String) eventconmap.get('organizationName');
                    if(strOrganization != null && strOrganization != '') {
                        newLead.Company = strOrganization;
                    }
                    else{
                        newLead.Company = 'Unknown';
                    }
                    newLead.Status = 'New';
                    lstInsrtLead.add(newLead);
                }
                
                
                Map<String, Object> eventregtypemap;   
                
                if(isFuncReg == true) {                    
                    Object eventfunregtype = eventReg.get('feeType');                    
                    eventregtypemap = (Map<String, Object>)eventfunregtype;
                }
                else{
                    Object eventregtype = eventReg.get('type');                    
                    eventregtypemap = (Map<String, Object>)eventregtype;                    
                }
                
                String strRegTypeId = (String) eventregtypemap.get('id');
                if(eventregtypemap != null && !setOfProdId.contains(strRegTypeId)) {
                    //Product2 field mapping start
                    Product2 newProduct = new Product2();
                    newProduct.Name = (String) eventregtypemap.get('name');
                    newProduct.EventsAir_ID__c = strRegTypeId;
                    newProduct.ProductCode = (String) eventregtypemap.get('uniqueCode');
                    newProduct.Description = 'This is a product from eventsair';
                    newProduct.IsActive = true;
                    newProduct.Family = 'Sample Family';
                    newProduct.IsActive = true;                    
                    lstInsertproduct.add(newProduct);
                    setOfProdId.add(strRegTypeId);
                    //Product2 field mapping end
                }
                
                Object eventregpayment = eventReg.get('paymentDetails');                
                Map<String, Object> eventregpaymentmap = (Map<String, Object>)eventregpayment;                
                Decimal totalcharge = (Decimal) eventregpaymentmap.get('totalChargeAmount');
                
                //create opportunity and opportunity if payamanet details total charge > 0
                if(totalcharge > 0) {
                    
                    //Opportunity field Mapping start
                    Opportunity objOpp = new Opportunity();
                    //String strOppName = 'Opportunity created for '+objcon.FirstName+' '+objcon.LastName;
                    //objOpp.Name = strOppName;
                    objOpp.Closedate = System.today();
                    objOpp.RecordTypeId = Schema.SObjectType.Opportunity.getRecordTypeInfosByDeveloperName().get('Divcom_Visitor').getRecordTypeId();
                    objOpp.Event__c = sfeventId;
                    //objOpp.EventsAir_Contact_Id__c = strevntconId;
                    objOpp.stageName = 'Closed Won'; 
                    lstInsrtOpp.add(objOpp);   
                    //Opportunity field Mapping end
                } 
            }
        }
        
        //Insert Product        
        if (!lstInsertproduct.isEmpty()) {
            Database.upsert(lstInsertproduct, Product2.Fields.EventsAir_ID__c, true);
            
            for(Product2 prod: lstInsertproduct) {
                mapOfEventregTypeAndSFproId.put(prod.EventsAir_ID__c, prod.Id);
            }
        }
        
        // Insert Contacts
        if (!lstInsrtCon.isEmpty()) {
            
            Set<String> setOfConEmail = new Set<String>();
            //check if contact
            for(Contact con: lstInsrtCon){
                if(con.Email != null) {
                    setOfConEmail.add(con.Email);
                }
            }
            
            if(!setOfConEmail.isEmpty()) {
                 List<Contact> lstExistingCon = [SELECT Id, Email from Contact WHERE Email IN: setOfConEmail];
                for(Contact objCon: lstExistingCon) {
                    mapofConEmailAndId.put(objCon.Email, objCon.Id);
                }
            }
           
            List<Contact> finallstToInsrtCon = new List<Contact>();
            for(Contact con: lstInsrtCon){
                if(!mapofConEmailAndId.containsKey(con.Email)) {
                    finallstToInsrtCon.add(con);                    
                }
            }
            
            //Database.insert(finallstToInsrtCon);
            
            Database.upsert(finallstToInsrtCon, Contact.Email, false);
            
            for(Contact con: finallstToInsrtCon) {
                mapofConEmailAndId.put(con.Email, con.Id);
            }
            
            /*Database.upsert(lstInsrtOpp, Opportunity.Fields.EventsAir_Contact_Id__c, true);
            List<Opportunity> insrtedOpplst = new List<Opportunity>();              
            for(Opportunity opp: lstInsrtOpp) {
                mapOfEventConAndSFOppId.put(opp.EventsAir_Contact_Id__c, opp.Id);
                insrtedOpplst.add(opp);
            }
            
            if(mapOfEventConAndSFOppId != null) {
                LinkObjectsHandler.linkAccToOpp(insrtedOpplst);
            } */
        }
        
        // Insert Lead
        if (!lstInsrtLead.isEmpty()) {
            
            Set<String> setOfLeadEmail = new Set<String>();
            //check if lead exist or not
            for(Lead objLead: lstInsrtLead){
                if(objLead.Email != null) {
                    setOfLeadEmail.add(objLead.Email);
                }
            }
            
            if(!setOfLeadEmail.isEmpty()) {
                 List<Lead> lstExistingLead = [SELECT Id, Email from Lead WHERE Email IN: setOfLeadEmail];
                for(Lead objLead: lstExistingLead) {
                    mapofLeadEmailAndId.put(objLead.Email, objLead.Id);
                }
            }
            
            List<Lead> finallstToInsrtLead = new List<Lead>();
            for(Lead lead: lstInsrtLead){
                if(!mapofLeadEmailAndId.containsKey(lead.Email)) {
                    finallstToInsrtLead.add(lead);                    
                }
            }
            
            //Database.insert(finallstToInsrtLead);
            
            Database.upsert(finallstToInsrtLead, Lead.Email, false);
            
            for(Lead objlead: finallstToInsrtLead) {
                mapofLeadEmailAndId.put(objlead.Email, objlead.Id);
            }
            
        }
    }
    
    public void setupForFunctionReg(List<Object> lstobject) {
        
        List<Map<String, Object>> listOfFunctioninfomap = new List<Map<String, Object>>();
        
        //loop through event'sair registration data for setup function start
        for(Object objEventReg: lstobject) {
            
            Map<String, Object> eventReg = (Map<String, Object>)objEventReg;            
            Map<String, Object> tempfunmap = (Map<String, Object>)(eventReg.get('function'));            
            listOfFunctioninfomap.add(tempfunmap);            
        }
        
        createFunction(listOfFunctioninfomap);
    }
    
    public void createRegisration(List<Object> lstobject, Boolean isFunReg){
        
        List<Registration__c> lstInsrtReg = new List<Registration__c>(); 
        Set<String> setofProductId = new Set<String>();
        lstInsertPricebookEntry = new List<PricebookEntry>();
        
        //fetch pricebook
        List<Pricebook2> lstPriceook = [Select Id from Pricebook2 where Events__c =: sfeventId];
        Pricebook2 standardPriceBook = [ SELECT Id FROM Pricebook2 WHERE isStandard = true LIMIT 1];
       
        
        
        //loop through event'sair registration data start
        for(Object objEventReg: lstobject) {
            
            Map<String, Object> eventReg = (Map<String, Object>)objEventReg;
            object eventcon = eventReg.get('contact'); //get contact information from registation map            
            Map<String, Object> eventconmap = (Map<String, Object>)eventcon;
            List<Object> lstfee;
            String strRegTypeId;
            
            //pricebook entry code start
            Map<String, Object> eventregtypemap;
            
            if(isFunReg == true) {                    
                Object eventfunregtype = eventReg.get('feeType');                    
                eventregtypemap = (Map<String, Object>)eventfunregtype;
                strRegTypeId = (String) eventregtypemap.get('id');
                
                List<Map<String, Object>> listOfFunFeetypemap = new List<Map<String, Object>>();
                lstfee = (List<Object>) eventregtypemap.get('fees'); 
                
            }
            else{
                Object eventregtype = eventReg.get('type');                    
                eventregtypemap = (Map<String, Object>)eventregtype;   
                
                strRegTypeId = (String) eventregtypemap.get('id');
                
                List<Map<String, Object>> listOfFunFeetypemap = new List<Map<String, Object>>();
                lstfee = (List<Object>) eventregtypemap.get('fees');
            }
            
            for(Object objfee: lstfee) {
                
                Map<String, Object> feemap = (Map<String, Object>)objfee;
                
                if(mapOfEventregTypeAndSFproId.containsKey(strRegTypeId) && !setofProductId.contains(strRegTypeId)) {
                    
                    //add to standard pricebook
                    PricebookEntry pbEntry = new PricebookEntry();
                    pbEntry.Product2Id = mapOfEventregTypeAndSFproId.get(strRegTypeId);   
                    if(standardPriceBook != null){
                        pbEntry.Pricebook2Id = standardPriceBook.Id;  
                    }
                               
                    pbEntry.UnitPrice = (decimal) feemap.get('amount');
                    pbEntry.IsActive = true;
                    pbEntry.UseStandardPrice = false;
                    lstInsertPricebookEntry.add(pbEntry); 
                    
                    //add to custom pricebook
                    PricebookEntry pbEntry2 = new PricebookEntry();
                    if(mapOfEventregTypeAndSFproId.containsKey(strRegTypeId)){
                        pbEntry2.Product2Id = mapOfEventregTypeAndSFproId.get(strRegTypeId);                         
                    }
                    if(lstPriceook.size()>0){
                        pbEntry2.Pricebook2Id = lstPriceook[0].Id; 
                    }         
                    if(strRegTypeId != null) {
                        pbEntry2.EventsAir_Type_ID__c = strRegTypeId;
                    }  
                    pbEntry2.UnitPrice = (decimal) feemap.get('amount');
                    pbEntry2.IsActive = true;
                    pbEntry2.UseStandardPrice = false;
                    setofProductId.add(strRegTypeId);
                    lstInsertPricebookEntry.add(pbEntry2);                        
                }                    
            }
            
            String strRegDate = (String) eventReg.get('registrationDateTime'); 
            
            //Registartion field mapping start
            Registration__c objreg = new Registration__c();
            if(isFunReg == false) {
                objreg.RecordTypeId = Schema.SObjectType.Registration__c.getRecordTypeInfosByDeveloperName().get('Registration').getRecordTypeId(); 
                if(strRegDate != null) {
                    objreg.Date_Registered__c = Datetime.valueOf(strRegDate.replace('T',' ')); 
                }  
            }
            else{
                objreg.RecordTypeId = Schema.SObjectType.Registration__c.getRecordTypeInfosByDeveloperName().get('Function_Registration').getRecordTypeId(); 
                String strtickets = (String) eventReg.get('tickets');
                objreg.Number_of_Tickets__c = Decimal.valueOf(strtickets);
                Map<String, Object> tempfunmap = (Map<String, Object>)(eventReg.get('function'));
                if(tempfunmap.containsKey('id')) {
                    objreg.EventsAir_Function_Id__c =  (String) tempfunmap.get('id');
                }
            }
            objreg.EventsAir_Regisration_ID__c = (String) eventReg.get('id');
            objreg.EventsAir_Contact_Id__c = (String) eventconmap.get('id');
            String streventconEmail = (String) eventconmap.get('primaryEmail');
            
            if(streventconEmail != null) {
                if(mapofConEmailAndId.containsKey(streventconEmail)) {
                    objreg.Contact__c = mapofConEmailAndId.get(streventconEmail);
                }
                else{
					objreg.Lead__c = mapofLeadEmailAndId.get(streventconEmail);
                }
            }
            
            if(mapOfEventConAndSFOppId.containsKey(objreg.EventsAir_Contact_Id__c)) {
                objreg.Opportunity__c = mapOfEventConAndSFOppId.get(objreg.EventsAir_Contact_Id__c);
            }            
            objreg.Event__c = sfeventId;  
             if(eventregtypemap.get('name') != null){
              if(!Test.isRunningTest()){
                    objreg.Registration_Type__c = (String) eventregtypemap.get('name'); 
                }
            }
            lstInsrtReg.add(objreg);    
            //Registartion field mapping end            
        }
        //loop through event'sair registration data end
                
        //create pricebbook entry
        if(!lstInsertPricebookEntry.isEmpty()) {
            
            //check for existing pricebookentry start
            Set<String> setOfPricebookProductIds = new Set<String>();
            for (PricebookEntry newpricebookentry : lstInsertPricebookEntry) {
                setOfPricebookProductIds.add(newpricebookentry.Product2Id);
            }
            List<PricebookEntry> lstexistingPricebookentry = [SELECT Id, Name, Product2.Name, EventsAir_Type_ID__c, UnitPrice
                                                              FROM PricebookEntry 
                                                              WHERE Product2Id IN: setOfPricebookProductIds];
            Map<String, Boolean> mapofpricebookentry = new Map<String, Boolean>();
            
            for(PricebookEntry pb: lstexistingPricebookentry) {
                mapofpricebookentry.put(pb.Product2Id, true);
            }
            
            List<PricebookEntry> finallsttoinsrtPB = new List<PricebookEntry>();
            
            for(PricebookEntry objPB: lstInsertPricebookEntry) {
                if(!mapofpricebookentry.containsKey(objPB.Product2Id)) {
                    finallsttoinsrtPB.add(objPB);
                }
            }
            //check for existing pricebookentry end
            
            if(!finallsttoinsrtPB.isEmpty()) {
                insert finallsttoinsrtPB;
            }
            
            //fill mapOfEventRegTypeIdAndSFPBentryId Map
            //loop through existing pricebookentry list
            for(PricebookEntry objexistingPBEntry: lstexistingPricebookentry) {
                mapOfEventRegTypeIdAndSFPBentryId.put(objexistingPBEntry.EventsAir_Type_ID__c, objexistingPBEntry.Id);
                mapOfEventRegTypeIdAndSFPBentryPrice.put(objexistingPBEntry.EventsAir_Type_ID__c, objexistingPBEntry.UnitPrice);
                
            }
            
            //loop through new pricebookentry list
            for(PricebookEntry objnewPBEntry: finallsttoinsrtPB) {
                mapOfEventRegTypeIdAndSFPBentryId.put(objnewPBEntry.EventsAir_Type_ID__c, objnewPBEntry.Id);
                mapOfEventRegTypeIdAndSFPBentryPrice.put(objnewPBEntry.EventsAir_Type_ID__c, objnewPBEntry.UnitPrice);
            }
        }       
        
        //create registration
         if(!lstInsrtReg.isEmpty()) {
            
            Set<String> setOfevntRegIds = new Set<String>();
            
            //check for existing registration
            for(Registration__c reg: lstInsrtReg) {
                setOfevntRegIds.add(reg.EventsAir_Regisration_ID__c);
            }
            
            Map<String, Boolean> mapofEvntRegIdAndfalg = new Map<String, Boolean>();
            
            if(setOfevntRegIds != null) {
                List<Registration__c> lstReg = [Select Id, EventsAir_Regisration_ID__c from Registration__c 
                                                where EventsAir_Regisration_ID__c IN: setOfevntRegIds];
                if(!lstReg.isEmpty()) {
                    for(Registration__c objReg: lstReg) {
                        mapofEvntRegIdAndfalg.put(objReg.EventsAir_Regisration_ID__c ,true);
                    }
                }
            }
            
            List<Registration__c> lstfinalinsrtReg = new List<Registration__c>();
            
            for(Registration__c objreg: lstInsrtReg) {
                if(!mapofEvntRegIdAndfalg.containskey(objreg.EventsAir_Regisration_ID__c)) {
                    lstfinalinsrtReg.add(objreg);                   
                }
            }
            
            if(!lstfinalinsrtReg.isEmpty()) {
                insert lstfinalinsrtReg;  
            }
            
            if(isFunReg) {
                LinkObjectsHandler.LinkFunctionToRegistration(lstfinalinsrtReg);
            }
            
        }
       
    }
    
    public void createFunction(List<Map<String, Object>> listOfFunctioninfomap){
        
        lstInsrtFun = new List<Function__c>();
        Set<String> setofeventfuncId = new Set<String>();
        
        //get function details from function registration code start
        for(integer i= 0 ; i< listOfFunctioninfomap.size(); i++) {
            
            Map<String,object> mapOfFunction = (Map<String,object>)listOfFunctioninfomap[i];
            Function__c func = new Function__c();
            if(mapOfFunction.get('start') != null){
                string Starttime = (string)mapOfFunction.get('start');
                List<String> timeComponents = Starttime.split(':');
                Time StTime = Time.newInstance(Integer.valueOf(timeComponents[0]), Integer.valueOf(timeComponents[1]),0,0);
                func.Function_Start__c = StTime;
            }
            
            if(mapOfFunction.get('functionend')!= null){
                string Starttime = (string)mapOfFunction.get('functionend');
                List<String> timeComponents = Starttime.split(':');
                Time endTime = Time.newInstance(Integer.valueOf(timeComponents[0]), Integer.valueOf(timeComponents[1]),0,0);
                func.Function_End__c = endTime;
            } 
            func.EventsAir_ID__c = (string)mapOfFunction.get('id');
            String strFunName = (string)mapOfFunction.get('name');
            if(strFunName.length() <= 80) {
            	func.Name = strFunName;    
            }
            else{
                func.Name = strFunName.substring(0,80);    
            }            
            func.Function_Overview__c = (string)mapOfFunction.get('overview');
            func.Function_Details__c = (string)mapOfFunction.get('details');
            func.Events__c = sfeventId;
            
            if(mapOfFunction.get('functiondate') != null){
                string funcDate = (string)mapOfFunction.get('functiondate');
                
                funcDate = funcDate.trim(); 
                funcDate = funcDate.replaceAll('[^0-9\\-]', ''); 
                Date fnctDate = Date.valueOf(funcDate);
                func.Function_Date__c = fnctDate;
            } 
            
            if(!setofeventfuncId.contains(func.EventsAir_ID__c)) {
                setofeventfuncId.add(func.EventsAir_ID__c);
                lstInsrtFun.add(func);
            }
            
        }
        //get function details from function registration code end
        if(!lstInsrtFun.isEmpty()){
            Database.upsert(lstInsrtFun, Function__c.Fields.EventsAir_ID__c, true);
            
        }
    }
    
    public void createOpportunityProduct(List<Object> lstobject, Boolean isFunReg) {
        
        lstInsertOppProduct = new List<OpportunityLineItem>();
        
        // Loop through event's air registration data to create Contacts
        for (Object objEventReg : lstobject) {
            Map<String, Object> eventReg = (Map<String, Object>) objEventReg;
            
            Object eventcon = eventReg.get('contact'); // get contact information from registration map            
            Map<String, Object> eventconmap = (Map<String, Object>) eventcon;            
            String strevntconId = (String) eventconmap.get('id'); 
            
            Object eventregpayment = eventReg.get('paymentDetails');            
            Map<String, Object> eventregpaymentmap = (Map<String, Object>)eventregpayment;            
            Decimal totalcharge = (Decimal) eventregpaymentmap.get('totalChargeAmount');
            String strRegTypeId;
            Map<String, Object> eventregtypemap;
            
            if(isFunReg == true) {                    
                Object eventfunregtype = eventReg.get('feeType');                    
                eventregtypemap = (Map<String, Object>)eventfunregtype;
                strRegTypeId = (String) eventregtypemap.get('id');
                
                String strtickets = (String) eventReg.get('tickets');
                
                //create opportunity product if payamanet details total charge > 0
                if(totalcharge > 0) {
                    
                    if(mapOfEventConAndSFOppId.containsKey(strevntconId) && mapOfEventRegTypeIdAndSFPBentryId.containskey(strRegTypeId)) {
                        OpportunityLineItem oli = new OpportunityLineItem();
                        oli.OpportunityId = mapOfEventConAndSFOppId.get(strevntconId);                    
                        oli.PricebookEntryId = mapOfEventRegTypeIdAndSFPBentryId.get(strRegTypeId);
                        oli.Quantity = Integer.valueOf(strtickets);
                        oli.EventsAir_Adjustment__c = (Decimal) eventregpaymentmap.get('adjustmentAmount');
                        oli.EventsAir_Discount_Amount__c = (Decimal) eventregpaymentmap.get('discountAmount');
                        oli.EventsAir_Tax__c = (Decimal) eventregpaymentmap.get('taxAmount');
                        oli.EventsAir_Payment_Status__c = (String) eventregpaymentmap.get('paymentStatus');
                        if(mapOfEventRegTypeIdAndSFPBentryPrice.containskey(strRegTypeId)) {
                        	oli.TotalPrice = oli.Quantity * (mapOfEventRegTypeIdAndSFPBentryPrice.get(strRegTypeId));   
                        }                        
                        lstInsertOppProduct.add(oli);
                    }                
                }
            }
            
        }
        
        if(!lstInsertOppProduct.isEmpty()) {
            //insert lstInsertOppProduct;
        }
    }
    
    public void finish(Database.BatchableContext BC) {
         
        
        if(!test.isrunningtest()) {
             List<Manage_Eventsair_Apex_batch_All_Events__c> lstcustsett2 = [SELECT Id, Name, Offset__c, Is_Execute_Next__c 
                                                             FROM Manage_Eventsair_Apex_batch_All_Events__c LIMIT 1];
       
        // Your finish logic goes here
            if(lstcustsett2[0].Is_Execute_Next__c == true) {
                
                //update offset in custom setting
                lstcustsett2[0].Offset__c = lstcustsett[0].Offset__c + contactsLimit;
                update lstcustsett2;
                
                ImportRegistartionForAllEventsBatch newBatch = new ImportRegistartionForAllEventsBatch(strEventId, sfeventId);
                Database.executeBatch(newBatch, 500);
            }
            else {
                lstcustsett2[0].Is_Execute_Next__c = true;
                update lstcustsett2;
                
                  // Enqueue the Queueable job
                ImportRegistartionFromEventsAirQueueable job = new ImportRegistartionFromEventsAirQueueable();
                System.enqueueJob(job);
                                
                
                FeedItem post = new FeedItem();
                post.ParentId = sfeventId; //eg. Opportunity id, custom object id..
                post.Body = 'Apex batch End for fetching EventsAir Data';
                insert post;
                                
            }
        }
       
    }
}