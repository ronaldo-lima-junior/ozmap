import { model, Schema, Document } from 'mongoose'

export enum SyncStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum SyncType {
  CABLE = 'CABLE',
  BOX = 'BOX',
  DROP_CABLE = 'DROP_CABLE',
  CUSTOMER = 'CUSTOMER',
}

export interface ISync extends Document {
  externalId: string
  type: SyncType
  status: SyncStatus
  updatedAt: Date
}

const syncSchema: Schema = new Schema({
  externalId: { type: String, required: true },
  type: { type: String, enum: Object.values(SyncType), required: true },
  status: { type: String, enum: Object.values(SyncStatus), required: true },
  updatedAt: { type: Date, default: Date.now },
})

syncSchema.index({ externalId: 1, type: 1 }, { unique: true })

export const Sync = model<ISync>('Sync', syncSchema)
