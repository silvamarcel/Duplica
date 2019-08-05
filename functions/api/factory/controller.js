const appError = require('../../utils/error');
const { db } = require('../../utils/admin');
const {
  buildDataWithAudit,
  getPlainDataWithId
} = require('../../utils/builder');
const appValidation = require('../../utils/validation');

const factoriesRef = db.collection('factories');

const goNext = (doc, req, next) => {
  req.factory = doc;
  return next();
};

const params = (req, res, next, id) => {
  factoriesRef.doc(id)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return next(appError.buildError(null, 403, 'Invalid id'));
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
  appValidation.validateRequest(req, res);
  return factoriesRef.add(buildDataWithAudit(req.body))
    .then(doc => {
      return doc.get();
    })
    .then(doc => {
      return res.json(getPlainDataWithId(doc));
    })
    .catch(appError.catchError(next));
};

const read = (req, res, next) => {
  if (!req.factory.exists) {
    return next(appError.buildError(null, 404, 'Factory not found!'));
  }
  return res.json(getPlainDataWithId(req.factory));
};

const update = async (req, res, next) => {
  appValidation.validateRequest(req, res);
  return req.factory.update(req.body)
    .then(doc => {
      return res.json(getPlainDataWithId(doc));
    })
    .catch(appError.catchError(next));
};

const deleteFactory = async (req, res, next) => {
  if (!req.factory.exists) {
    return next(appError.buildError(null, 404, 'Factory not found!'));
  }
  return req.factory.delete()
    .then(doc => {
      return res.json(getPlainDataWithId(doc));
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
