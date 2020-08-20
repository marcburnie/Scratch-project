const express = require('express');
const router = express.Router();
// const path = require('path');
const fileController = require('../controllers/fileController');
const cookieController = require('../controllers/cookieController');
const eventController = require('../controllers/eventController');

router.get('/',
  eventController.allEvents,
  (req, res) => res.status(200).json(res.locals.allEventsInfo));

router.delete('/:eventid',
  cookieController.isLoggedIn,
  fileController.userCanModifyEvent,
  eventController.deleteEvent,
  (req, res) => res.status(200).json({}));

router.put('/:eventid',
  cookieController.isLoggedIn,
  fileController.userCanModifyEvent,
  eventController.updateEvent,
  (req, res) => res.status(200).json({}));

module.exports = router;
