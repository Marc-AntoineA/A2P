'using strict';
const mongoose = require('mongoose');


const commentSchema = mongoose.Schema({
  supervisorId: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: { createdAt: 'createdAt' } });

const comment = mongoose.model('InterviewSlot', commentSchema);

module.exports.schema = commentSchema;
module.exports.model = comment;
