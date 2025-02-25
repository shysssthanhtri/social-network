// init-mongo.js

const socialDb = db.getSiblingDB(process.env.MONGO_AUTH_DATABASE);
socialDb.createUser({
  user: process.env.MONGO_AUTH_USERNAME,
  pwd: process.env.MONGO_AUTH_PASSWORD,
  roles: [{ role: 'readWrite', db: process.env.MONGO_AUTH_DATABASE }]
});
