const db = require('../models/models');
const queries = require('../utils/queries');

const contentController = {};

contentController.createContent = (req, res, next) => {
  const { userid } = res.locals.allUserInfo;
  const { eventid, content } = req.body;
  const queryString = queries.createContent;

  // define new date/time
  const now = new Date();
  const contentdate = now.toDateString();
  const contenttime = now.toTimeString().split(' ')[0];

  const queryValues = [userid, eventid, content, contentdate, contenttime];
  db.query(queryString, queryValues)
    .then((data) => {
      return next();
    })
    .catch((err) => {
      return next({
        log: `Error occurred with queries.createContent OR contentController.createCotent middleware: ${err}`,
        message: { err: 'An error occured with SQL when creating content.' },
      });
    });
};

contentController.updateContent = (req, res, next) => {
  const { contentid } = req.params;
  const { content } = req.body;
  const queryValues = [contentid, content];

  db.query(queries.updateContent, queryValues)
    .then((resp) => {
      return next();
    })
    .catch((err) => next({
      log: `Error occurred with contentController.deleteContent middleware: ${err}`,
      message: { err: 'An error occured with SQL when deleting content information.' },
    }));
};

contentController.deleteContent = (req, res, next) => {
  const { contentid } = req.params;

  db.query(queries.deleteContent, [contentid])
    .then((resp) => {
      return next();
    })
    .catch((err) => next({
      log: `Error occurred with contentController.deleteContent middleware: ${err}`,
      message: { err: 'An error occured with SQL when deleting content information.' },
    }));
};

module.exports = contentController;
