var Appointment = function(data){
	var self = this;
	self.id = data['id'] || false;
	self.title = data['title'] || '';
	self.start = data['start'] || '';
	self.end = data['end'] || '';
	self.owner = data['owner'] || '';
	self.isPrivate = data['isPrivate'] || false;
	self.type = data['type'] || false;
	
	self.getHtml = function(template){
		var templates = {
			'row': '<tr>\
				<td>'+self.title+'</td>\
				<td>'+self.start+'</td>\
				<td>'+self.end+'</td>\
				<td>'+self.type+'</td>\
				<td>'+self.users+'</td>\
			</tr>'
		};
		
		return templates[template];
	};
	
	self.toObject = function(){
		var obj = {};
		if(self.id) obj.id = self.id;
		obj.title = self.title;
		obj.start = self.start;
		obj.end = self.end;
		obj.owner = self.owner;
		obj.isPrivate = self.isPrivate;
		obj.type = self.type;
	};
	
	self.save = function(){
		//New Appointment
		//if(self.id > 0){
			$.ajax({
		        url: 'rest/appointments',
		        contentType: "application/json",
		        dataType: "json",
		        type: "POST",
		        data: JSON.stringify(self.toObject),
		        success: function(data) {
		        	console.log(data);
		            //console.log("Member registered");

		            //clear input fields
		            $('#reg')[0].reset();

		            //mark success on the registration form
		            $('#formMsgs').append($('<span class="success">Member Registered</span>'));
		        },
		        error: function(error) {
		        	console.log(error);
		            if ((error.status == 409) || (error.status == 400)) {
		                //console.log("Validation error registering user!");

		                var errorMsg = $.parseJSON(error.responseText);

		                $.each(errorMsg, function(index, val) {
		                    $('<span class="invalid">' + val + '</span>').insertAfter($('#' + index));
		                });
		            } else {
		                //console.log("error - unknown server issue");
		                $('#formMsgs').append($('<span class="invalid">Unknown server error</span>'));
		            }
		        }
		    });
		//}else{ // Update Appointment
			
		//}
	}
};

Appointment.listAppointments = function(tableToAppand, template){
	template = template || "row";
	$.ajax({
        url: "rest/appointments",
        cache: false,
        success: function(data) {
        	console.log(data);
        	for(var d in data){
        		var app = new Appointment(d);
        		tableToAppand.children('tbody').append(app.getHtml(template));
        	}
        },
        error: function(error) {
            console.log("error updating table -" + error.status);
        }
    });
};
