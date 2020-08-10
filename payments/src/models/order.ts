import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@tripb3000/common';

interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderDocument extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDocument> {
  build(attrs: OrderAttrs): OrderDocument;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<OrderDocument | null>;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  const { id: _id, ...order } = attrs;
  return new Order({ _id, ...order });
};
orderSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Order.findOne({ _id: event.id, version: event.version - 1 });
};

const Order = mongoose.model<OrderDocument, OrderModel>('Order', orderSchema);

export { Order };
