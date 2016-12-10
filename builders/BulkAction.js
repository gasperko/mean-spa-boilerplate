'use strict';

function BulkAction(requestParams) {

	if(requestParams && 
		requestParams.action &&
		requestParams.data){

		var isValid = false;
		var action;
		
		switch(requestParams.action) {
			case 'delete':
				isValid = true;
				action = 'remove';
				break;
		}

		if(isValid){

			this.action = action;
			this.data = requestParams.data;
			this.all = !!requestParams.all || false;
		
		}
	}

}



module.exports = BulkAction;