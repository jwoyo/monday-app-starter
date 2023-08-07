import {createBrowserRouter, Outlet, RouterProvider} from 'react-router-dom';
import {ItemView} from './item-view/ItemView.tsx';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {trpc, useTrpcClient} from './trpc.ts';
import React from 'react';
import {Info} from 'monday-ui-react-core/icons';
import {AttentionBox} from 'monday-ui-react-core';
import {errorMessageStyles} from './App.css.ts';
import {CallbackDestination} from './oauth/CallbackDestination';
import {MondayOAuthBoundary} from './oauth/MondayOAuthBoundary';
import {MondayBoundary} from './MondayBoundary';
import {Modal} from './components/Modal.tsx';
import {NewBlueprint} from './blueprints/NewBlueprint.tsx';

const router = createBrowserRouter([
  {
    path: '/module',
    children: [
      {
        path: 'item-view',
        element: <ItemView/>,
      },
      {
        path: 'blueprints',
        element: <Outlet/>,
        children: [
          {
            path: '',
            element: <Modal headline="Your checklist blueprints"><div>list</div></Modal>,
          },
          {
            path: 'create',
            element: <Modal headline="Create new blueprint"><NewBlueprint/></Modal>,
          },
          {
            path: ':blueprintId',
            element: <Modal headline="Edit blueprint"><div>list</div></Modal>,
          },
        ],
      },
    ],
    element: <MondayBoundary>
      <MondayOAuthBoundary>
        <Outlet/>
      </MondayOAuthBoundary>
    </MondayBoundary>,
  },
  {
    path: '/oauth',
    children: [
      {
        path: 'callback',
        element: <CallbackDestination/>,
      },
    ],
    element: <Outlet/>,
  },
  {
    path: '/',
    element: <div className={errorMessageStyles}>
      <AttentionBox title="Welcome"
        text="This is the main page of a monday.com app web client. It is not meant to be opened directly."
        icon={Info}/>
    </div>,
  },
  {
    path: '/*',
    element: <div className={errorMessageStyles}>
      <AttentionBox title="404 – No valid route"
        text="This page does not exist. Please check the URL."
        icon={Info}/>
    </div>,
  },
]);

const queryClient = new QueryClient();

/**
 * initializes react-query
 * @return {JSX.Element}
 */
function App() {
  return <QueryClientProvider client={queryClient}>
    <TrpcAwareApp/>
  </QueryClientProvider>;
}

/**
 * injects trpc client into the app
 * @return {JSX.Element}
 */
function TrpcAwareApp() {
  const trpcClient = useTrpcClient();
  return <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <RouterProvider router={router}/>
  </trpc.Provider>;
}

export default App;
