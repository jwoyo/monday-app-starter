import {className} from "./ItemView.css.ts";
import {useMonday} from "../use-monday.ts";

type Props = {};

export function ItemView({}: Props) {
    const {context, sessionToken, itemIds, settings} = useMonday();
    return (
        <div className={className}>
            Hey there!123
            <pre>{JSON.stringify({context, sessionToken, itemIds, settings}, null, 2)}</pre>
        </div>
    );
}