import React from "react";
import ReactDOM from "react-dom";
import App from "./App.tsx";
import "monday-ui-react-core/tokens";
import {checklistFunctionUrl} from "./api-client.ts";
console.log(checklistFunctionUrl);
ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root')!
)
