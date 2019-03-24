({
    sendEmailSelectedHelper: function(component, getEmail, getSubject, getbody, sendIdList) {
        // call the server side controller method 	
        var action = component.get("c.sendEmail");
        // set the 4 params to sendEmail method   
        action.setParams({
            'emailId'		 : getEmail,
            'subject'		 : getSubject,
            'body'			 : getbody,
            'attchmntIdList' : sendIdList
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                // if state of server response is comes "SUCCESS",
                // display the success message box by set mailStatus attribute to true
                component.set("v.mailStatus", true);
            }
        });
        $A.enqueueAction(action);
    },
    
})