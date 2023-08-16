import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.tsx';
import 'monday-ui-react-core/tokens';

/**
 * this is the main entry point for the app. mind the React and monday-ui-react import side effects.
 */
ReactDOM.render(
    <React.StrictMode>
      <App/>
    </React.StrictMode>,
    document.getElementById('root')!
);
