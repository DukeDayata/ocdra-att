import mongoose from 'mongoose';

const approverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Approver name is required'],
      trim: true,
      index: true
    },
    position: {
      type: String,
      required: [true, 'Approver position is required'],
      trim: true
    },
    active: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Approver', approverSchema);
