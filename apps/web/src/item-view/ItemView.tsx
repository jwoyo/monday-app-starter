import {className} from "./ItemView.css.ts";
import {useMonday} from "../use-monday.ts";

type Props = {};

export function ItemView({}: Props) {
    const {context, sessionToken, itemIds, settings} = useMonday();
    return (
        <div className={className}>
            Hey there!
            {JSON.stringify({context, sessionToken, itemIds, settings})}
        </div>
    );
}