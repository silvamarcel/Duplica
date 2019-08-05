const { admin } = require('./admin');

const getPlainDataWithId = doc => {
  const data = doc.data();
  data.id = doc.id;
  data.createdAt = data.createdAt.toDate();
  data.updatedAt = data.updatedAt.toDate();
  return data;
};

const buildDataWithAudit = data => {
  const now = admin.firestore.FieldValue.serverTimestamp();
  data.createdAt = data.createdAt || now;
  data.updatedAt = now;
  return data;
};

module.exports = {
  getPlainDataWithId,
  buildDataWithAudit
};
