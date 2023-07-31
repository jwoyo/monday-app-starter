import {className} from "./ItemView.css.ts";
import {useMonday} from "../use-monday.ts";
import {useEffect} from "react";

type Props = {};

export function ItemView({}: Props) {
    const {context, sessionToken, settings} = useMonday();
    useEffect(() => {

    })
    return (
        <div className={className}>
            Hey there!
            <pre>{JSON.stringify({context, sessionToken, settings}, null, 2)}</pre>
        </div>
    );
}