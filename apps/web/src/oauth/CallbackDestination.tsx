import React, {useEffect, useState} from "react";
import {trpc} from "../trpc.ts";
import {AttentionBox, Skeleton} from "monday-ui-react-core";
import {ThumbsUp} from "monday-ui-react-core/icons";

type Props = {};

export function CallbackDestination({}: Props) {
    const {mutate, isSuccess, isError} = trpc.OAuth.exchangeCode.useMutation({});
    const [rejectionError, setRejectionError] = useState<string | null>(null);
    useEffect(function reactToCallbackOnComponentLoad(){
        const searchParams = new URLSearchParams(window.location.search);
        const error = searchParams.get("error");
        if (error) {
            const errorDescription = searchParams.get("error_description");
            setRejectionError(error + (errorDescription ? ": " + errorDescription : ""));
            return;
        }
        const code = searchParams.get("code");
        if (!code) {
            return;
        }
        mutate({code});
    }, [mutate]);

    useEffect(function closeWindowOnSuccess() {
        if (isSuccess) {
            window.opener?.postMessage("success", "*");
            window.close();
        }
    }, [isSuccess]);

    if (isSuccess) {
        return <AttentionBox title="Success! You're doing great"
                             text="We connected you with your brand new monday.com app. If this windows doesn't close itself, please close it yourself."
                             type={AttentionBox.types.SUCCESS}
                             icon={ThumbsUp}/>
    }

    if (isError) {
        return <AttentionBox title="Oh no. Could not connect to monday.app"
                             text="We could not sign up your account to this monday.com app. Please try again or contact app support."
                             type={AttentionBox.types.DANGER}/>
    }

    if (rejectionError) {
        return <AttentionBox title={rejectionError}
                             text={"Please try again or contact app support."}
                             type={AttentionBox.types.DANGER}/>
    }

    return (
        <Skeleton width={660} height={84}/>
    );
}

