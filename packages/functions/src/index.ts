import {onRequest} from 'firebase-functions/v2/https';
import express from 'express';
import cors from 'cors';
import {MONDAY_APP_SECRET, MONDAY_APP_SIGNING_SECRET} from './variables';
import * as trpcExpress from '@trpc/server/adapters/express';
import {createContext} from './server';
import {router} from './router';
import {createOpenApiExpressMiddleware} from 'trpc-openapi';

export const checklistExpressMiddleware = trpcExpress.createExpressMiddleware({
  router,
  createContext,
});
export const checklistExpressMiddlewareOpenApi = createOpenApiExpressMiddleware({
  router,
  createContext,
});

const app = express()
    .use(
        cors({
          origin: true, // allow all origins for now
          credentials: true,
        })
    )
    .use(
        '/trpc',
        checklistExpressMiddleware
    )
    .use(
        '/trpc-open-api',
        checklistExpressMiddlewareOpenApi
    );

export const checklist = onRequest({secrets: [MONDAY_APP_SECRET, MONDAY_APP_SIGNING_SECRET]}, app);
