import mongoose, { Document, Schema } from "mongoose";

export enum ServiceType {
  SERVICES = "services",
  PROVIDER = "provider",
}

export interface ServiceInput {
  label: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface IService extends Document {
  _id: string;
  type: ServiceType;
  name: string;
  description: string;
  tags: string[];
  note: number[];
  inputJSON: ServiceInput[];
  outputJSON: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(ServiceType),
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    note: {
      type: [Number],
      default: [],
      validate: {
        validator: function (notes: number[]) {
          return notes.every((note) => note >= 0 && note <= 5);
        },
        message: "Les notes doivent être comprises entre 0 et 5",
      },
    },
    inputJSON: {
      type: [{
        label: { type: String, required: true },
        type: {
          type: String,
          enum: ['string', 'number', 'boolean', 'date', 'select'],
          required: true,
        },
        placeholder: { type: String, default: "" },
        required: { type: Boolean, default: false },
        options: { type: [String], default: [] }, // Pour les champs de type 'select'&
      }],
      required: true,
    },
    outputJSON: {
      type: Object,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les recherches
ServiceSchema.index({ name: 1 });
ServiceSchema.index({ type: 1 });
ServiceSchema.index({ tags: 1 });

export const Service = mongoose.model<IService>("Service", ServiceSchema);
