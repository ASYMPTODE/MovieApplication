import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongod

beforeAll(async () => {
  jest.setTimeout(30000)
  mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri('movie_mern_test')
  await mongoose.connect(uri)
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()
  for (const c of collections) {
    await c.deleteMany({})
  }
})

afterAll(async () => {
  await mongoose.disconnect()
  if (mongod) await mongod.stop()
})
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  if (mongoose.connection.readyState) await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const c of collections) await c.deleteMany({});
});
