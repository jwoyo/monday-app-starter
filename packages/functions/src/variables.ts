import {defineSecret, defineString} from 'firebase-functions/params';

export const MONDAY_APP_SECRET = defineSecret('MONDAY_APP_SECRET');
export const MONDAY_APP_CLIENT_ID = defineString('MONDAY_APP_CLIENT_ID');
export const MONDAY_APP_HOSTING_URL = defineString('MONDAY_APP_HOSTING_URL');
