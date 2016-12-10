var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var appSchema = new Schema({
  appId: { type: String, required: true, index: { unique: true } },
  name: { type: String, required: true},
  host: String,
  _userId: { type: Schema.Types.ObjectId, required: true }
}, {
    timestamps: true
});

var App = mongoose.model('App', appSchema);

module.exports = App;
