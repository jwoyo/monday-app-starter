import {useQuery} from "@tanstack/react-query";
import monday from "monday-sdk-js";
import {ClientData} from "monday-sdk-js/types/client-data.interface.ts";

export function useMonday() {
    const [context, settings, itemIds, sessionToken] = ['context', 'settings', 'itemIds', 'sessionToken'].map(key => useQuery({
        queryKey: ["monday", key],
        queryFn: () => monday().get(key as Parameters<ClientData["get"]>[0])
    }));
    return {
        context,
        settings,
        itemIds,
        sessionToken
    }
}