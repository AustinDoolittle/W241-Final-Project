import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import "./index.css"

import Main from './Main';

const history = createBrowserHistory();

ReactDOM.render(
    <Main history={history} />, 
    document.getElementById('root')
);
