({
    doInit : function(component, event, helper) {
        // call apex method to fetch list view dynamically
        debugger; 
        var action = component.get("c.showAttachment");
        action.setParams({
            "accountID" : component.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.wrapList",response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    
    // when user click on the close buttton on message popup ,
    // hide the Message box by set the mailStatus attribute to false
    // and clear all values of input fields.   
    closeMessage: function(component, event, helper) {
        component.set("v.mailStatus", false);
        component.set("v.email", null);
        component.set("v.subject", null);
        component.set("v.body", null);
    },
    
    // For count the selected checkboxes. 
    checkboxSelect: function(component, event, helper) {
        // get the selected checkbox value  
        var selectedRec = event.getSource().get("v.value");
        // get the selectedCount attrbute value(default is 0) for add/less numbers. 
        var getSelectedNumber = component.get("v.selectedCount");
        // check, if selected checkbox value is true then increment getSelectedNumber with 1 
        // else Decrement the getSelectedNumber with 1     
        if (selectedRec == true) {
            getSelectedNumber++;
        } else {
            getSelectedNumber--;
        }
        // set the actual value on selectedCount attribute to show on header part. 
        component.set("v.selectedCount", getSelectedNumber);
    },
    
    //For Select All CheckBox    
    selectAll: function(component, event, helper) {
        //get the header checkbox value  
        var selectedHeaderCheck = event.getSource().get("v.value");
        // get all checkbox on table with "checkAll" aura id (all iterate value have same Id)
        // return the List of all checkboxes element 
        var getAllId = component.find("checkAll");
        // If the local ID is unique[in single record case], find() returns the component. not array   
        if(! Array.isArray(getAllId)){
            if(selectedHeaderCheck == true){ 
                component.find("checkAll").set("v.value", true);
                component.set("v.selectedCount", 1);
            }else{
                component.find("checkAll").set("v.value", false);
                component.set("v.selectedCount", 0);
            }
        }
        else{
            // check if select all (header checkbox) is true then true all checkboxes on table in a for loop  
            // and set the all selected checkbox length in selectedCount attribute.
            // if value is false then make all checkboxes false in else part with play for loop 
            // and select count as 0 
            if (selectedHeaderCheck == true) {
                for (var i = 0; i < getAllId.length; i++) {
                    component.find("checkAll")[i].set("v.value", true);
                    component.set("v.selectedCount", getAllId.length);
                }
            } 
            else{
                for (var i = 0; i < getAllId.length; i++) {
                    component.find("checkAll")[i].set("v.value", false);
                    component.set("v.selectedCount", 0);
                }
            } 
        }  
    },
    
    //For Send Email With Selected Attachment Records 
    sendEmailSelected: function(component, event, helper) {
        //create var for store record id's for selected checkboxes  
        var sendIdList = [];
        // get all checkboxes 
        var getAllId = component.find("checkAll");
        //If the local ID is unique[in single record case], find() returns the component. not array
        if(! Array.isArray(getAllId)){
            if (getAllId.get("v.value") == true) {
                sendIdList.push(getAllId.get("v.text"));
            }
        }
        else{
            // play a for loop and check every checkbox values 
            // if value is checked(true) then add those Id (store in Text attribute on checkbox) in sendIdList var.
            for (var i = 0; i < getAllId.length; i++) {
                if (getAllId[i].get("v.value") == true) {
                    sendIdList.push(getAllId[i].get("v.text"));
                }
            }
        }
        // when user click on Send button 
        var getEmail = component.get("v.emailId");
        var getSubject = component.get("v.emailSubject");
        var getbody = component.get("v.emailBody");
        // check if Email field is Empty or not contains @ so display a alert message 
        // otherwise call and pass the fields value to helper method    
           helper.sendEmailSelectedHelper(component, getEmail, getSubject, getbody, sendIdList);
        
    },
    
})