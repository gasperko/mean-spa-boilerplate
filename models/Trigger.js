var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
//require('mongoose-function')(mongoose);

var schemaOptions = {
	timestamps: true,
	toJSON: {
		virtuals: true
	}
};

var Schema = mongoose.Schema;

var triggerSchema = new Schema({
	appId: String,
	name: String,
	eventName: String,
	callback: String,
	enabled: Boolean
	//callback: Function
}, schemaOptions);

triggerSchema.plugin(mongoosePaginate);

// triggerSchema.virtual('ua').get(function() {
// 	var data = this.get('data');
// 	if (!data) {
// 		return {};
// 	}
// 	if (!data.userAgent) {
// 		return {}
// 	}

// 	return useragent.parse(data.userAgent);
// });

// triggerSchema.options.toJSON = {
// 	transform: function(doc, ret, options) {
// 		//delete ret.appId;
// 	}
// };

var Trigger = mongoose.model('Trigger', triggerSchema);

module.exports = Trigger;