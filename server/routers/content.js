const express = require("express");
const router = express.Router();
const path = require('path');
const fileController = require('../controllers/fileController');
const contentController = require('../controllers/contentController');
// const cookieController = require('../controllers/cookieController');
// const eventController = require('../controllers/eventController');
// const loginController = require('../controllers/loginController');

router.post('/',
  fileController.verifyUser,
  fileController.getUser,
  contentController.createContent,
  (req, res) => {
    return res.status(200).json('Post succcessfully created.');
  });

router.put('/:contentid',
  cookieController.isLoggedIn,
  fileController.userCanModifyContent,
  contentController.updateContent,
  (req, res) => {
    return res.status(200).json('Post succcessfully updated.');
  });

router.delete('/:contentid',
  cookieController.isLoggedIn,
  fileController.userCanModifyContent,
  contentController.deleteContent,
  (req, res) => {
    return res.status(200).json('Post succcessfully deleted.');
  });


module.exports = router;
