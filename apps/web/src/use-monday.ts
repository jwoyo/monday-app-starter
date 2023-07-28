import {useQuery} from "@tanstack/react-query";
import monday from "monday-sdk-js";
import {
    MondayClientContext,
    MondayClientSessionToken,
    MondayClientSettings
} from "bridge/monday-client-context.types.ts";

export function useMonday() {
    const context = useQuery({
        queryKey: ["monday", "context"],
        queryFn: () => monday().get("context") as Promise<MondayClientContext>
    })
    const settings = useQuery({
        queryKey: ["monday", "settings"],
        queryFn: () => monday().get("settings") as Promise<MondayClientSettings>
    })
    const sessionToken = useQuery({
        queryKey: ["monday", "sessionToken"],
        queryFn: () => monday().get("sessionToken") as Promise<MondayClientSessionToken>
    })
    return {
        contextQuery: context,
        settingsQuery: settings,
        sessionTokenQuery: sessionToken,
        context: context.data?.data,
        settings: settings.data?.data,
        sessionToken: sessionToken.data?.data,
    }
}