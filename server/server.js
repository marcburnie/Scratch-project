const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

// added for multimedia handling
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
// multimedia handling above

console.log(process.env.REACT_APP_PLACES_API)
const app = express();
const apiRouter = require('./routers/api');
const contentRouter = require('./routers/content');

// enable files upload
app.use(fileUpload({
	createParentPath: true,
}));

// PARSERS AND MULTIMEDIA HANDLERS
app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

// BODY PARSERS & COOKIE PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// SERVE UP STATIC FILES
app.use('/', express.static(path.join(__dirname, '../dist')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// SERVE INDEX.HTML ON THE ROUTE '/'
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// API ROUTER
app.use('/api', apiRouter);

// CONTENT ROUTER
app.use('/content', contentRouter);

// HANDLING UNKNOWN URLS
app.use('*', (req, res) => {
	res.status(404).send('URL path not found');
});

// ERROR HANDLER
app.use((err, req, res, next) => {
	res.status(401).send(err.message); // WHAT IS FRONT-END EXPECTING? JSON OR STRING?
});

// app.listen(3000); //listens on port 3000 -> http://localhost:3000/
app.listen(process.env.PORT || 3000);
module.exports = app;
