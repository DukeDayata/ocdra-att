import mongoose from 'mongoose';

const castObjectIdOrNull = (val) => {
  if (!val || val === '' || !mongoose.Types.ObjectId.isValid(val)) {
    return null;
  }
  return val;
};

const personnelSnapshotSchema = new mongoose.Schema(
  {
    personnelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Personnel',
      default: null,
      set: castObjectIdOrNull
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    position: {
      type: String,
      required: true,
      trim: true
    },
    office: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { _id: false }
);

const requestedBySchema = new mongoose.Schema(
  {
    personnelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Personnel',
      default: null,
      set: castObjectIdOrNull
    },
    name: {
      type: String,
      trim: true,
      default: ''
    },
    position: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { _id: false }
);

const approvedBySchema = new mongoose.Schema(
  {
    approverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Approver',
      default: null,
      set: castObjectIdOrNull
    },
    name: {
      type: String,
      trim: true,
      default: ''
    },
    position: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { _id: false }
);

const expenseSchema = new mongoose.Schema(
  {
    airfare: {
      type: Number,
      default: 0
    },
    perDiem: {
      type: Number,
      default: 0
    },
    preTravel: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      default: 0
    },
    airfareRaw: {
      type: String,
      default: ''
    },
    perDiemRaw: {
      type: String,
      default: ''
    },
    preTravelRaw: {
      type: String,
      default: ''
    },
    totalAmountRaw: {
      type: String,
      default: ''
    },
    expenseType: {
      type: String,
      enum: ['Airfare', 'Transportation'],
      default: 'Airfare'
    }
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true
    },
    remarks: {
      type: String,
      default: ''
    },
    changedBy: {
      type: String,
      default: 'System'
    },
    changedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const attRecordSchema = new mongoose.Schema(
  {
    referenceNo: {
      type: String,
      required: [true, 'Reference number is required'],
      unique: true,
      index: true,
      trim: true
    },
    attType: {
      type: String,
      enum: ['Local', 'Abroad'],
      required: [true, 'ATT Type is required'],
      index: true
    },
    personnel: {
      type: [personnelSnapshotSchema],
      validate: [
        arr => Array.isArray(arr) && arr.length > 0,
        'At least one personnel member must be assigned'
      ]
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true
    },
    travelStartDate: {
      type: Date
    },
    travelEndDate: {
      type: Date
    },
    periodOfTravel: {
      type: String,
      required: [true, 'Period of travel is required'],
      trim: true
    },
    officeStation: {
      type: String,
      default: 'Commission on Higher Education - Central Office',
      trim: true
    },
    purpose: {
      type: String,
      required: [true, 'Purpose of travel is required'],
      trim: true
    },
    travelClassification: {
      type: String,
      enum: ['Official Business', 'Official Time Only', 'Personal Time', 'Personal Travel'],
      required: [true, 'Travel classification is required']
    },
    datePrepared: {
      type: Date,
      default: Date.now
    },
    requestedBy: requestedBySchema,
    fundsAvailable: {
      type: String,
      default: 'Diana C. Aguilar',
      trim: true
    },
    fundsAvailablePosition: {
      type: String,
      default: 'Chief Administrative Officer',
      trim: true
    },
    sourceOfFunds: {
      type: String,
      default: 'Personal',
      trim: true
    },
    expenses: expenseSchema,
    paymentMode: {
      type: String,
      enum: ['None', 'Cash Advance', 'Reimbursement', ''],
      default: ''
    },
    approvedBy: approvedBySchema,
    status: {
      type: String,
      enum: [
        'Draft',
        'Generated',
        'Submitted',
        'For Signature',
        'Signed',
        'Return',
        'Disapproved',
        'Cancelled',
        'Archived'
      ],
      default: 'Generated',
      index: true
    },
    statusHistory: [statusHistorySchema],
    submittedBy: {
      type: String,
      default: 'system',
      trim: true
    },
    archived: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

attRecordSchema.index({ createdAt: -1 });
attRecordSchema.index({ referenceNo: 'text', destination: 'text', purpose: 'text', 'personnel.name': 'text' });

export default mongoose.model('ATTRecord', attRecordSchema);
