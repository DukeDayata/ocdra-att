import mongoose from 'mongoose';

const personnelSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      trim: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Personnel name is required'],
      trim: true,
      index: true
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true
    },
    office: {
      type: String,
      default: 'Commission on Higher Education - Central Office',
      trim: true
    },
    region: {
      type: String,
      trim: true,
      default: ''
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
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

personnelSchema.index({ name: 'text', position: 'text', office: 'text' });

export default mongoose.model('Personnel', personnelSchema);
