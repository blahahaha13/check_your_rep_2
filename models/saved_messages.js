const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SavedMessagesSchema = new Schema({
  photoUrl: String,
  representative: String,
  partyAffiliation: String,
  name: String,
  email: String,
  content: String,
});

const SavedMessages = mongoose.model('SavedMessages', SavedMessagesSchema);

module.exports = SavedMessages;
