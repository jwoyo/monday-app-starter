import {className} from "./ItemView.css.ts";
import {useMonday} from "../use-monday.ts";
import {useEffect} from "react";

type Props = {};

export function ItemView({}: Props) {
    const {context, sessionToken, settings} = useMonday();
    useEffect(() => {
        fetch("http://127.0.0.1:5001/monday-app-checklist-prod/us-central1/helloWorld", {
            headers: {
                "Authorization": "JWT " + sessionToken
            }
        })
    })
    return (
        <div className={className}>
            Hey there!
            <pre>{JSON.stringify({context, sessionToken, settings}, null, 2)}</pre>
        </div>
    );
}