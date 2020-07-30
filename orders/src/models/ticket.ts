import mongoose from 'mongoose';

interface TicketAttrs {
  id: string;
  name: string;
}

export interface TicketDocument extends mongoose.Document {
  id: string;
  name: string;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
  build(attrs: TicketAttrs): TicketDocument;
}
