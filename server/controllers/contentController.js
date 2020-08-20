const db = require('../models/models');
const queries = require('../utils/queries');
const path = require('path');
const contentController = {};

const express = require('express');
const app = express();

// added for multimedia handling
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const _ = require('lodash');

// enable files upload
app.use(
	fileUpload({
		createParentPath: true,
	})
);

//add other middleware
app.use(cors());
app.use(morgan('dev'));

contentController.createContent = (req, res, next) => {
	const { userid } = res.locals.allUserInfo;
	const { eventid } = req.body;
	let content;
	const queryString = queries.createContent;

	// define new date/time
	const now = new Date();
	const contentdate = now.toDateString();
	const contenttime = now.toTimeString().split(' ')[0];

	try {
		//check if a file is uploaded
		if (!req.files) {
			/////////
			content = req.body.content;
			const queryValues = [userid, eventid, content, contentdate, contenttime];
			db.query(queryString, queryValues)
				.then((data) => {
					res.locals.createdContent = data.rows[0]
					return next();
				})
				.catch((err) => {
					return next({
						log: `Error occurred with queries.createContent OR contentController.createCotent middleware: ${err}`,
						message: { err: 'An error occured with SQL when creating content.' },
					});
				});
			////////
			// content = req.body.content;
		} else {
			//Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
			const file = req.files.file;

			//Use the mv() method to place the file in upload directory (i.e. "uploads")
			file.mv(`./uploads/${userid}/${file.name}`);

			//save file url to content
			content = path.resolve('/uploads/' + userid + '/' + file.name);
		}
	} catch (err) {
		res.status(500).send(err);
	}

	// const queryValues = [userid, eventid, content, contentdate, contenttime];
	// db.query(queryString, queryValues)
	// 	.then((data) => {
	// 		return next();
	// 	})
	// 	.catch((err) => {
	// 		return next({
	// 			log: `Error occurred with queries.createContent OR contentController.createCotent middleware: ${err}`,
	// 			message: { err: 'An error occured with SQL when creating content.' },
	// 		});
	// 	});


};

contentController.updateContent = (req, res, next) => {
	const { contentid } = req.params;
	const { content } = req.body;
	const queryValues = [contentid, content];

	db.query(queries.updateContent, queryValues)
		.then((resp) => {
			return next();
		})
		.catch((err) =>
			next({
				log: `Error occurred with contentController.deleteContent middleware: ${err}`,
				message: {
					err: 'An error occured with SQL when deleting content information.',
				},
			})
		);
};

contentController.deleteContent = (req, res, next) => {
	const { contentid } = req.params;

	db.query(queries.deleteContent, [contentid])
		.then((resp) => {
			return next();
		})
		.catch((err) =>
			next({
				log: `Error occurred with contentController.deleteContent middleware: ${err}`,
				message: {
					err: 'An error occured with SQL when deleting content information.',
				},
			})
		);
};

module.exports = contentController;
