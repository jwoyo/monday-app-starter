import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import {ItemView} from "./item-view/ItemView.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useMonday} from "./use-monday.ts";
import {ReactElement} from "react";
import {Info} from "monday-ui-react-core/icons";
import {AttentionBox} from "monday-ui-react-core";
import {errorMessageStyles} from "./App.css.ts";

const router = createBrowserRouter([
    {
        path: "/module",
        children: [
            {
                path: "item-view",
                element: <ItemView/>,
            },
        ],
        element: <MondayBoundary>
            <Outlet/>
        </MondayBoundary>,
    },
    {
        path: "/",
        element: <div className={errorMessageStyles}>
            <AttentionBox title="Welcome"
                          text="This is the main page of a monday.com app web client. It is not meant to be opened directly."
                          icon={Info}/>
        </div>
    },
    {
        path: "/*",
        element: <div className={errorMessageStyles}>
            <AttentionBox title="404 – No valid route"
                          text="This page does not exist. Please check the URL."
                          icon={Info}/>
        </div>
    },
]);

const queryClient = new QueryClient()

function App() {
    return <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}/>
    </QueryClientProvider>
}

function MondayBoundary({children}: { children: ReactElement }) {
    const {contextQuery} = useMonday();
    if (contextQuery.isLoading) {
        // Monday.com postMessage calls seem to load very fast, so we don't need to show a loading indicator.
        return <></>
    }
    if (contextQuery.isError || (contextQuery.data && !contextQuery.data.data?.app?.id)) {
        return <div className={errorMessageStyles}>
            <AttentionBox title="No monday.com context found"
                          text="If you see this message you likely opened this application outside of monday.com"
                          icon={Info}/>
        </div>
    }
    return children;
}

export default App
