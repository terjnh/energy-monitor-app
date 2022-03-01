import { ObjectId } from 'mongodb';
import { dbProjectionUsers } from './user';
import { DEVICES } from '../constants';


export async function findDeviceById(db, id) {
  const devices = await db
    .collection(DEVICES)
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' },
      { $project: dbProjectionUsers('creator.') },
    ])
    .toArray();
  if (!devices[0]) return null;
  return devices[0];
}

export async function updateDeviceById(db, id, data) {
  return db
    .collection(DEVICES)
    .findOneAndUpdate(
      { "_id": ObjectId(id) },
      {
        $set: data,
        $push: { energyConsumption: (data.energy ? data.energy : "0") },
      },
      { returnDocument: 'after' }
    )
    // .then(({ value }) => value);
}


export async function findDevices(db, before, by, limit = 10) {
  return db
    .collection('devices')
    .aggregate([
      {
        $match: {
          ...(by && { creatorId: new ObjectId(by) }),
          ...(before && { createdAt: { $lt: before } }),
        },
      },
      { $sort: { _id: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' },
      { $project: dbProjectionUsers('creator.') },
    ])
    .toArray();
}


export async function insertDevice(db, { name, creatorId }) {
  const device = {
    name,
    creatorId,
    energyConsumption: [],
    createdAt: new Date(),
  };
  const { insertedId } = await db.collection('devices').insertOne(device);
  device._id = insertedId;
  return device;
}