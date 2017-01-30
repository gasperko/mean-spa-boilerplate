'use strict';

const mongoose = require('mongoose');

function castIdList(list) {
	return list = list.map(function(d) {
		return mongoose.Types.ObjectId(d);
	});
}

function BulkAction(requestParams) {

	if(requestParams) {
		this.setData(requestParams);
	}

}

BulkAction.prototype.setData = function setData(requestParams) {
	
	if (requestParams.action) {

		var isValid = false;
		var action;
		var execute;

		switch (requestParams.action) {
			case 'delete':
				isValid = true;
				action = 'remove';
				execute = function(entity, response) {

					var query = {};

					if (!this.all) {
						query = {
							_id: {
								$in: this.data
							}
						};
					}

					entity[this.action](
						query,
						function(err, errors) {

							if (err) {
								return response.status(401).send(err);
							}

							response.send(errors);

						});

				};

				break;
			case 'read':
				isValid = true;
				action = 'update';
				execute = function(entity, response) {

					var query = {};

					this.data = castIdList(this.data);

					if (!this.all) {
						query = {
							_id: {
								$in: this.data
							}
						};
					}

					var bulk = entity.collection.initializeOrderedBulkOp();
				    bulk.find(query).update({$set: {_new: false}});
				    bulk.execute(function (err) {
				         
						if (err) {
							return response.status(401).send(err);
						}

						response.send();                  
				    });


				};

				break;
			case 'unread':
				isValid = true;
				action = 'update';
				execute = function(entity, response) {

					var query = {};

					this.data = castIdList(this.data);

					if (!this.all) {
						query = {
							_id: {
								$in: this.data
							}
						};
					}

					var bulk = entity.collection.initializeOrderedBulkOp();
				    bulk.find(query).update({$set: {_new: true}});
				    bulk.execute(function (err) {
				         
						if (err) {
							return response.status(401).send(err);
						}

						response.send();                  
				    });	

				};

				break;
		}

		if (isValid) {

			this.action = action;
			this.execute = execute;
			this.data = requestParams.data || [];
			this.all = !!requestParams.all || false;

		}
	}
};



module.exports = BulkAction;