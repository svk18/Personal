public class SendEmailController {
    

    @AuraEnabled    
    public static void sendEmail(List<String> emailId, String subject, String body, List<String> attchmntIdList){
        try{
            List<Attachment> attList = new List<Attachment>();
            if(! attchmntIdList.isEmpty()){
                attList = [SELECT Id,Name,Body,BodyLength FROM Attachment WHERE Id IN : attchmntIdList ORDER BY CreatedDate];
            }
            List<Messaging.SingleEmailMessage> mails =  new List<Messaging.SingleEmailMessage>();
            List<Messaging.Emailfileattachment> fileAttachments = new List<Messaging.Emailfileattachment>();
            System.debug('attListSize:::: ' + attList.size());
            if(! attList.isEmpty()){
                for(Attachment a : attList){
                    // Add to attachment file list
            		Messaging.Emailfileattachment efa = new Messaging.Emailfileattachment();
                    efa.setFileName(a.Name);
                    efa.setBody(a.Body);
                    fileAttachments.add(efa);
                }
            }
            //Step 1: Create a new Email
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            System.debug('emailId:::: ' + emailId);
            //Step 2: Set list of people who should get the email
            /*List<String> sendTo = new List<String>();
            sendTo.add(emailId);*/
            if(! emailId.isEmpty()){
                mail.setToAddresses(emailId);
            }
            
            //Step 3: Set who the email is sent from
            mail.setReplyTo('souvik.banik18@gmail.com'); //change it with your mail address.
            mail.setSenderDisplayName('Souvik Banik');
            
            //Step 4. Set email contents - you can use variables!
            mail.setSubject(subject);
            mail.setHtmlBody(body);
            
            //Step 5. Add your attachment to the email
            mail.setFileAttachments(fileAttachments);
            
            //Step 6. Add your email to the master list
            mails.add(mail);
            
            //Step 7: Send all emails in the master list
            Messaging.sendEmail(mails);
        }
        catch(Exception e){
            System.debug('Error Message::: ' + e.getMessage() +' At::: '+e.getLineNumber());
        }
    }
    
    @AuraEnabled
    public static List<AttachmentWrapper> showAttachment(String accountID){
    	try{
            System.debug('accountID:::: '+accountID);
            List<AttachmentWrapper> attachmntWrapList = new List<AttachmentWrapper>();
            List<Attachment> attchmntList = new List<Attachment>();
            if(accountID != null){
                attchmntList = [SELECT Id,Name,ParentId, Body, BodyLength, CreatedDate FROM Attachment WHERE ParentId =: accountID ORDER BY CreatedDate];
            }
            System.debug('attchmntListSize:::: '+attchmntList.size());
            if(! attchmntList.isEmpty()){
            	for(Attachment a : attchmntList){
                    AttachmentWrapper wrapObj = new AttachmentWrapper();
                    wrapObj.isSelected = false;
                    wrapObj.attchmentInstance = a;
                    attachmntWrapList.add(wrapObj);    
                } 
            }
            return attachmntWrapList;
        }
        catch(Exception e){
            System.debug('Error Message::: ' + e.getMessage() +' At::: '+e.getLineNumber());
            return null;
        }
    }
    
    public class AttachmentWrapper{
        @AuraEnabled
        public Boolean isSelected;
        @AuraEnabled
        public Attachment attchmentInstance;
    }
    
}