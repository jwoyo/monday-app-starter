import {createTRPCProxyClient, httpBatchLink} from "@trpc/client";
import {AppRouter} from "functions/checklist.server.ts";

export const checklistFunctionUrl = import.meta.env.__FUNCTION_URL_CHECKLIST__;

export const trpc = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: checklistFunctionUrl,
        }),
    ],
});