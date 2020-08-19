const db = require('../models/models');
const queries = require('../utils/queries');

const contentController = {};

contentController.createContent = (req, res, next) => {
  const { userid } = res.locals.allUserInfo;
  //   const { eventid } = req.params;
  // need to get eventid
  const queryString = queries.createContent; // make this query
  const {
    eventid, content, contentdate, contenttime,
  } = req.body;
  const queryValues = [userid, eventid, content, contentdate, contenttime];
  db.query(queryString, queryValues)
    .then((data) => {
      console.log('>>> contentController.createContent DATA ', data);
      return next();
    })
    .catch((err) => {
      console.log('>>> eventController.createEvent ERR ', err);
      return next({
        log: `Error occurred with queries.createContent OR contentController.createCotent middleware: ${err}`,
        message: { err: 'An error occured with SQL when creating content.' },
      });
    });
};

contentController.deleteContent = (req, res, next) => {
    const {userid}
}
