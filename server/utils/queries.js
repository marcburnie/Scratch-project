const db = require('../models/models.js'); // remove after testing

const queries = {};

// GET ALL EVENTS
queries.getAllEvents = `
SELECT * FROM events
`;

queries.getAttendeeEvents = `
SELECT u.*, ue.eventid
FROM usersandevents ue
JOIN users u
ON u.userid = ue.userid
`;

// GET USER'S EVENTS
queries.userEvents = `
SELECT * FROM usersandevents WHERE userid=$1
`;

// GET ALL USER'S PERSONAL INFO
queries.userInfo = 'SELECT * FROM users WHERE username=$1'; // const values = [req.query.id]

// QUERY TO ADD USER
queries.addUser = `
INSERT INTO users
  (username, firstname, lastname, profilephoto)
VALUES($1, $2, $3, $4)
RETURNING username
;
`;

// QUERY FOR WHEN USER CREATES EVENT
queries.createEvent = `
INSERT INTO events
  (eventtitle, eventdate, eventstarttime, eventendtime, eventlocation, eventdetails, eventownerid, eventownerusername, eventmessages)
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING eventid
;
`;

// query for when creater deletes event
queries.deleteEvent = `
DELETE FROM events
WHERE eventid=$1
`;

// QUERY FOR DELETING EVENT ON USER EVENT TABLE
queries.deleteUserEvents = `
DELETE FROM usersandevents
WHERE eventid=$1
`;

// QUERY FOR WHEN USER UPDATES EVENTS
queries.updateEvent = `
UPDATE events
SET eventtitle=$2,eventdate= $3, eventstarttime=$4, eventendtime= $5, eventlocation= $6, eventdetails=$7 
WHERE eventid=$1
`;

// QUERY FOR WHEN USER TRIES TO MODIFY OR DELETE EVENT
queries.checkEventOwner = `
SELECT eventownerusername
FROM events
WHERE eventid=$1
 `;

// ADDS ALL CURRENT EVENTS TO USERSANDEVENTS
queries.addNewEventToJoinTable = `
INSERT INTO usersandevents (userid, username, eventid, eventtitle, eventdate, eventstarttime, eventendtime, eventdetails, eventlocation)
SELECT eventownerid, eventownerusername, eventid, eventtitle, eventdate, eventstarttime, eventendtime, eventdetails, eventlocation FROM events
WHERE eventid=$1
RETURNING usersandevents;
`;

// USERS ADDS THEMSELVES TO OTHER PEOPLE'S EVENTS
queries.addUserToEvent = `INSERT INTO usersandevents
  (userid, username, eventid, eventtitle, eventdate, eventstarttime, eventendtime, eventdetails, eventlocation)
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING eventid
;
`;

// GRAB EVENT'S ATTENDEES
queries.selectEventAttendees =
  'SELECT * FROM usersandevents WHERE eventtitle=$1';

// GRAB CONTENT OWNER
queries.checkCommentOwner = `
SELECT username FROM content JOIN users ON users.userid = content.userid WHERE contentid = $1`

// CREATING CONTENT
queries.createContent = `
INSERT INTO content (userid, eventid, content, contentdate, contenttime) VALUES ($1, $2, $3, $4, $5)`

// UPDATING CONTENT
queries.updateContent = `
UPDATE content SET content = $2 WHERE contentid=$1`

// DELETING CONTENT
queries.deleteContent = `
DELETE FROM content WHERE contentid=$1`

// CLEAR ALL TABLES & DATA
queries.clearAll = `
DROP TABLE usersandevents;
DROP TABLE events;
DROP TABLE users;
`;

module.exports = queries;
