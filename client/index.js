import 'bootstrap/dist/css/bootstrap.css';
require('dotenv').config()

console.log('index.js', process.env)

console.log('REACT_APP_PLACES_API', process.env.REACT_APP_PLACES_API)
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import styles from './stylesheets/styles.scss';

// import Sample from './Sample.jsx';

//<h3>Can you see me?</h3>,
render(
	(<BrowserRouter>
		<App />
	</BrowserRouter>),

	document.getElementById('root'),
);