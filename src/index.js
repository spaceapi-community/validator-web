import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const parsedUrl = new URL(window.location.href);

ReactDOM.render(<App checkUrl={parsedUrl.searchParams.get('url')} />, document.getElementById('root'));
serviceWorker.register();
