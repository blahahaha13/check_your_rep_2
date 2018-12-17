const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IssueSchema = new Schema({
  issueName: String,
  learnMore: String,
});

const Issue = mongoose.model('Issue', IssueSchema);

module.exports = Issue;
