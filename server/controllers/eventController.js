const db = require('../models/models');
const queries = require('../utils/queries');

const eventController = {};


eventController.createEvent = (req, res, next) => {
  const { userid, username } = res.locals.allUserInfo;

  const queryString = queries.createEvent;

  const {
    eventtitle, eventlocation, eventdate, eventstarttime, eventdetails,
  } = req.body;

  const queryValues = [eventtitle, eventdate, eventstarttime, eventstarttime, eventlocation, eventdetails, userid, username, '{}'];
  db.query(queryString, queryValues)
    .then((data) => {
      res.locals.eventID = data.rows[0];
      return next();
    })
    .catch((err) => {
      return next({
        log: `Error occurred with queries.createEvent OR eventController.createEvent middleware: ${err}`,
        message: { err: 'An error occured with SQL when creating event.' },
      });
    });
};

eventController.addNewEventToJoinTable = (req, res, next) => {
  const queryString = queries.addNewEventToJoinTable;
  const queryValues = [res.locals.eventID.eventid];
  db.query(queryString, queryValues)
    .then((data) => {
      res.locals.usersandevents = data.rows[0];
      return next();
    })
    .catch((err) => {
      return next({
        log: `Error occurred with queries.addtoUsersAndEvents OR eventController.addNewEventToJoinTable middleware: ${err}`,
        message: { err: 'An error occured with SQL when adding to addtoUsersAndEvents table.' },
      });
    });
};

eventController.verifyAttendee = (req, res, next) => {
  const title = req.query.eventtitle; // verify with frontend

  const { username } = res.locals.allUserInfo;

  const queryString = queries.selectEventAttendees;
  const queryValues = [title];

  db.query(queryString, queryValues)
    .then((data) => {
      const attendees = [];
      for (const attendeeObj of data.rows) {
        attendees.push(attendeeObj.username);
      }
      if (attendees.includes(username)) {
        return next({
          log: 'Error: User is already an attendee',
          message: { err: 'User is already an attendee' },
        });
      }
      res.locals.eventID = data.rows[0].eventid;
      res.locals.eventTitle = data.rows[0].eventtitle;
      res.locals.eventDate = data.rows[0].eventdate;
      res.locals.eventStartTime = data.rows[0].eventstarttime;
      res.locals.eventEndTime = data.rows[0].eventendtime;
      res.locals.eventDetails = data.rows[0].eventdetails;
      res.locals.eventLocation = data.rows[0].eventlocation;
      return next();
    })
    .catch((err) => next({
      log: `Error occurred with queries.selectEventAttendees OR eventController.verifyAttendee middleware: ${err}`,
      message: { err: 'An error occured with SQL when verifying if user attended said event.' },
    }));
};

//  (userid, username, eventid, eventtitle, eventdate, eventstarttime, eventendtime, eventdetails, eventlocation)
eventController.addAttendee = (req, res, next) => {
  const title = req.query.eventtitle;

  const { userid, username } = res.locals.allUserInfo;
  // eventsID is saved in res.locals.eventID

  const queryString = queries.addUserToEvent;
  const queryValues = [
    userid,
    username,
    res.locals.eventID,
    title,
    res.locals.eventDate,
    res.locals.eventStartTime,
    res.locals.eventEndTime,
    res.locals.eventDetails,
    res.locals.eventLocation,
  ];

  db.query(queryString, queryValues)
    .then((data) => {
      return next();
    })
    .catch((err) => next({
      log: `Error occurred with queries.addUserToEvent OR eventController.addAttendee middleware: ${err}`,
      message: { err: 'An error occured with SQL adding a user to an existing event as an attendee.' },
    }));
};
// extracts all events and then pulls the user and events DB and appends all attendees to each event
eventController.allEvents = (req, res, next) => {
  const queryString = queries.getAllEvents;
  // pulls all events
  db.query(queryString)
    .then((data) => {
      if (!data.rows) {
        res.locals.allEventsInfo = [];
      } else {
        // then grabs all the attendees fromt he user and events table joined with the user table
        db.query(queries.getAttendeeEvents).then((eventAndUserData) => {
          db.query(queries.getContentEvents).then((eventAndContentData) => {
            // goes through the table and creates an attendees array with the list of user data
            const mergedTable = data.rows.map((e) => {
              e.attendees = eventAndUserData.rows.filter((entry) => entry.eventid == e.eventid);
              e.content = eventAndContentData.rows.filter((entry) => entry.eventid == e.eventid);
              return e;
            });
            res.locals.allEventsInfo = mergedTable;
            return next();
          });
        });
      }
    })
    .catch((err) => next({
      log: `Error occurred with queries.getAllEvents OR eventController.allEvents middleware: ${err}`,
      message: { err: 'An error occured with SQL when retrieving all events information.' },
    }));
};

// filters out all events to only return the ones that the current user is attending
eventController.filterForUser = (req, res, next) => {
  const { userid } = res.locals.allUserInfo;

  const filtered = res.locals.allEventsInfo.filter((event) => event.attendees.some((attendee) => attendee.userid === userid));
  res.locals.allEventsInfo = filtered;
  return next();
};

eventController.updateEvent = (req, res, next) => {
  const { eventid } = req.params;
  const {
    eventtitle,
    eventdate,
    eventstarttime,
    eventlocation,
    eventdetails,
  } = req.body;

  const eventendtime = eventstarttime;

  const queryValues = [
    eventid,
    eventtitle,
    eventdate,
    eventstarttime,
    eventendtime,
    eventlocation,
    eventdetails,
  ];

  db.query(queries.updateEvent, queryValues)
    .then((resp) => {
      return next();
    })
    .catch((err) => next({
      log: `Error occurred with eventController.updateEvent middleware: ${err}`,
      message: { err: 'An error occured with SQL when updating event information.' },
    }));
};

eventController.deleteEvent = (req, res, next) => {
  const { eventid } = req.params;

  db.query(queries.deleteUserEvents, [eventid]) //Disassociates event from users
    .then((resp) => {
      db.query(queries.deleteEventContents, [eventid]) //Deletes all associated content with event
        .then((resp) => {
          db.query(queries.deleteEvent, [eventid])  //Deletes events itself
            .then((resp) => {
              return next();
            });
        });
    })
    .catch((err) => next({
      log: `Error occurred with eventController.deleteEvent middleware: ${err}`,
      message: { err: 'An error occured with SQL when deleting event information.' },
    }));
};

module.exports = eventController;
