'using strict';
const mongoose = require('mongoose');

const interviewSlotSchema = mongoose.Schema({
  begin: { type: Date, required: true },
  end: { type: Date, required: true },
  supervisorId: { type: String, required: true },
  applicantId: { type: String },
  processId: { type: String, required: true }
}, { timestamps: { createdAt: 'createdAt' } });

const interviewSlot = mongoose.model('ItwSlot', interviewSlotSchema);

module.exports.schema = interviewSlotSchema;
module.exports.model = interviewSlot;
