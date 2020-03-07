import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import "./index.css"

import ExperimentWindow from './ExperimentWindow.js';

const history = createBrowserHistory();

ReactDOM.render(
    <ExperimentWindow history={history} />, 
    document.getElementById('root')
);
