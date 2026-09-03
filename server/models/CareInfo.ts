import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICareInfo extends Document {
  userId: mongoose.Types.ObjectId;
  careNeeded?: string;
  additionalInfo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CareInfoSchema: Schema<ICareInfo> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
    careNeeded: { type: String, required: false, trim: true },
    additionalInfo: { type: String, required: false, trim: true },
  },
  {
    timestamps: true,
    autoIndex: process.env.NODE_ENV !== 'production',
  }
);

// Indexes for query performance
// userId already indexed in schema

const CareInfo: Model<ICareInfo> =
  mongoose.models.CareInfo || mongoose.model<ICareInfo>('CareInfo', CareInfoSchema, 'care_info');

export default CareInfo;
