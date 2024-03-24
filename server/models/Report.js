const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  filedBy: { type: String, required: true },
  filedAgainst: { type: String, required: true },
  complaint: { type: String, required: true },
  itemType: { type: String, required: true },
  itemNumber: { type: String, required: true },
  resolved: { type: Boolean, default: false },
  filedAt: { type: Date, default: Date.now }
});

// Create the Report model
const ReportModel = mongoose.model('Report', reportSchema);

module.exports = ReportModel;