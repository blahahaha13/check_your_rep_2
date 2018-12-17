const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RepSchema = new Schema({
  name: String,
  address: [{
    line1: String,
    line2: String,
    city: String,
    state: String,
    zip: String
  }],
  party: String,
  phones: [String],
  urls: [String],
  photoUrl: {
    type: [String],
    default: '/images/user_default.png'
  }
});

const Rep = mongoose.model('Rep', RepSchema);

module.exports = Rep;
