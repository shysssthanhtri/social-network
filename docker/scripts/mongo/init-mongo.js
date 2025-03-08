// init-mongo.js

const authDb = db.getSiblingDB(process.env.MONGO_AUTH_DATABASE);
authDb.createUser({
  user: process.env.MONGO_AUTH_USERNAME,
  pwd: process.env.MONGO_AUTH_PASSWORD,
  roles: [{ role: 'readWrite', db: process.env.MONGO_AUTH_DATABASE }]
});

const userDb = db.getSiblingDB(process.env.MONGO_USER_DATABASE);
userDb.createUser({
  user: process.env.MONGO_USER_USERNAME,
  pwd: process.env.MONGO_USER_PASSWORD,
  roles: [{ role: 'readWrite', db: process.env.MONGO_USER_DATABASE }]
});
