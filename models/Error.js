var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var useragent = require('useragent');

var schemaOptions = {
  timestamps: false,
  toJSON: {
    virtuals: true
  }
};

var Schema = mongoose.Schema;

var errorSchema = new Schema({
	//_appId: Schema.Types.ObjectId,
	appId: String,
	data: Schema.Types.Mixed,
}, schemaOptions);

errorSchema.plugin(mongoosePaginate);

errorSchema.virtual('ua').get(function() {
	var data = this.get('data');
	if (!data) {
		return {};
	}
	if (!data.userAgent) {
		return {}
	}

	return useragent.parse(data.userAgent);
});

// errorSchema.options.toJSON = {
// 	transform: function(doc, ret, options) {
// 		//delete ret.appId;
// 	}
// };

var Error = mongoose.model('Error', errorSchema);

module.exports = Error;