// Set Up Mongo server
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/check_your_rep_app", { useNewUrlParser: true} );

// Model Exports

module.exports.SavedMessages = require('./saved_messages.js');
module.exports.Issue = require('./issue.js');
module.exports.Rep = require('./rep.js');
