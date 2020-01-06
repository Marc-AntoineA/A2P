'using strict';
const mongoose = require('mongoose');

const interviewSlotSchema = mongoose.Schema({
  begin: { type: Date, required: true },
  end: { type: Date, required: true },
  supervisorId: { type: String, required: true },
  applicantId: { type: String },
  processId: { type: String, required: true }
}, { timestamps: { createdAt: 'createdAt' } });

interviewSlotSchema.pre('save', function() {
  return new Promise((resolve, reject) => {
    const err = new Error('This slot intersects others slots');
    interviewSlot.find({
      _id: { $ne: this._id },
      processId: this.processId,
      begin: { $gte: this.begin, $lt: this.end }
    }).then((slots) => {
      if (slots.length > 0) { reject(err); return; }
      interviewSlot.find({
        _id: { $ne: this._id },
        processId: this.processId,
        end: { $gt: this.begin, $lte: this.end }
      }).then((slots) => {
        if (slots.length > 0) { reject(err); return; }
        interviewSlot.find({
          _id: { $ne: this._id },
          processId: this.processId,
          begin: { $lte: this.begin },
          end: { $gte: this.end }
        }).then((slots) => {
          if (slots.length > 0) { reject(err); return; }
          resolve();
        });
      });
    });
  });
});

const interviewSlot = mongoose.model('ItwSlot', interviewSlotSchema);

module.exports.schema = interviewSlotSchema;
module.exports.model = interviewSlot;
