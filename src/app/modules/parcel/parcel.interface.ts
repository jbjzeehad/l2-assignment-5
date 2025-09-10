import { Types } from "mongoose";

export enum ParcelTypes {
  Document = "Document",
  Box = "Box",
  Fragile = "Fragile",
  Electronics = "Electronics",
  Clothing = "Clothing",
  Perishable = "Perishable",
  Other = "Other",
}

export enum ParcelStatus {
  Requested = "Requested",
  Approved = "Approved",
  Dispatched = "Dispatched",
  InTransit = "In Transit",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
  Blocked = "Blocked",
}

export interface ParcelStatusLog {
  timestamp: Date;
  status: ParcelStatus;
  updatedBy: Types.ObjectId;
  location: string;
  notes?: string;
}

export interface IParcel {
  _id: string;
  title: string;
  weight: number;
  deliveryDate: Date;
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  trackingId?: string;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  toAddress: string;
  toPhone: string;
  fromPhone: string;
  fromAddress: string;
  fee: number;
  type: ParcelTypes;
  status: ParcelStatus;
  statusLogs: ParcelStatusLog[];
}

export interface ICreateParcel {
  title: string;
  weight: number;
  deliveryDate: Date;
  receiverEmail: string;
  fee: number;
  type: ParcelTypes;
  receiver?: Types.ObjectId;
}
