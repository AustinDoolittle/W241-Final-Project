import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router, Route } from 'react-router-dom';
import "./index.css"
import MainWindow from './MainWindow.js';

const history = createBrowserHistory();

ReactDOM.render(
    <Router history={history}>
        <Route path='/' component={MainWindow}/>
    </Router>,
    document.getElementById('root')
);
