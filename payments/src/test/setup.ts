import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(userID?: string): string[];
    }
  }
}

let mongo: any;

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY =
  'sk_test_51HEsXDH5CPmGUOobw9OtcHBEW4VCYq0sHAhPAAnp2nN0H6HZzxKrkR9KuLiy1RMl89p31pCSWgOwdlgooeAuw3KF00v1LROBjJ';

beforeAll(async () => {
  process.env.JWT_KEY = 'test';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  collections.forEach(async (collection) => {
    await collection.deleteMany({});
  });
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (userID?: string) => {
  // Create JWT
  const token = jwt.sign(
    {
      id: userID || new mongoose.Types.ObjectId().toHexString(),
      email: 'test@test.com',
    },
    process.env.JWT_KEY!
  );

  // Take JSON and encode it to base64
  const base64 = Buffer.from(JSON.stringify({ jwt: token })).toString('base64');

  // return a string thats the cookie
  return [`express:sess=${base64}`];
};
