const moment = require('moment');

const getNow = () => moment().toISOString();

const getPlainDataWithId = doc => {
  const data = doc.data();
  data.id = doc.id;
  return data;
};

const buildDataWithAudit = (data, createdAt) => {
  const now = getNow();
  data.createdAt = createdAt || now;
  data.updatedAt = now;
  data.deletedAt = null;
  return data;
};

const getDeletedData = doc => {
  const data = doc.data();
  const now = getNow();
  data.updatedAt = now;
  data.deletedAt = now;
  return data;
};

module.exports = {
  getPlainDataWithId,
  buildDataWithAudit,
  getDeletedData,
};
