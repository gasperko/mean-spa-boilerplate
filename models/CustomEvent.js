var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var eventSchema = new Schema({
  appId: String,
  eventName: String,
  data: Schema.Types.Mixed,
}, {
    timestamps: true
});

eventSchema.plugin(mongoosePaginate);

var CustomEvent = mongoose.model('CustomEvent', eventSchema);

module.exports = CustomEvent;
