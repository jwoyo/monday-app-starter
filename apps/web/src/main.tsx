import React from 'react';
import ReactDOM from 'react-dom';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import 'monday-ui-react-core/tokens';
import i18n from './i18n';
i18n;


/**
 * this is the main entry point for the app. mind the React and monday-ui-react import side effects.
 */
const root = createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
      <App/>
    </React.StrictMode>
);
