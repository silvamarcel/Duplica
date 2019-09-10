const appError = require('../../utils/error');
const { db } = require('../../utils/admin');
const {
  buildDataWithAudit,
  getPlainDataWithId,
  getDeletedData,
} = require('../../utils/builder');
const appValidation = require('../../utils/validation');

const factoriesRef = db.collection('factories');

const goNext = (doc, req, next) => {
  req.factory = doc;
  return next();
};

const getDoc = (id) => {
  return factoriesRef.doc(id);
};

const getById = (id) => {
  return getDoc(id).get();
};

const getByName = (name) => {
  return factoriesRef
    .where('name', '==', name)
    .get();
};

const params = (req, res, next, id) => {
  getById(id)
    .then(doc => {
      const data = doc.data() || {};
      if (!doc.exists || data.deletedAt) {
        return next(appError.buildError(null, 404, 'Factory not found!'));
      }
      return goNext(doc, req, next);
    })
    .catch(appError.catchError(next));
};

const list = (req, res, next) => {
  factoriesRef
    .orderBy('name')
    .get()
    .then(collection => {
      const factories = [];
      collection.forEach(doc => {
        factories.push(getPlainDataWithId(doc));
      });
      return res.json(factories);
    })
    .catch(appError.catchError(next));
};

const create = async (req, res, next) => {
  await appValidation.validateRequest(req, res);
  const newFactory = buildDataWithAudit(req.body);
  const docs = await getByName(newFactory.name);
  if (!docs.empty) {
    return next(appError.buildError(null, 409, 'Factory already exists!'));
  }
  return factoriesRef
    .add(newFactory)
    .then(doc => {
      const { id } = doc;
      return getById(id);
    })
    .then(doc => {
      return res.json(getPlainDataWithId(doc));
    })
    .catch(appError.catchError(next));
};

const read = (req, res) => res.json(getPlainDataWithId(req.factory));

const update = async (req, res, next) => {
  await appValidation.validateRequest(req, res);
  const actualFactory = getPlainDataWithId(req.factory);
  const factory = buildDataWithAudit(req.body, actualFactory.createdAt);
  return getDoc(req.factory.id)
    .update(factory)
    .then(() => {
      return getById(req.factory.id);
    })
    .then((doc) => res.json(getPlainDataWithId(doc)))
    .catch(appError.catchError(next));
};

const deleteFactory = async (req, res, next) => {
  const doc = await getById(req.factory.id);
  const factory = getDeletedData(doc);
  return getDoc(req.factory.id)
    .update(factory)
    .then(() => {
      return res.json('Factory successfully deleted!');
    })
    .catch(appError.catchError(next));
};

module.exports = {
  params,
  list,
  create,
  read,
  update,
  delete: deleteFactory,
};
