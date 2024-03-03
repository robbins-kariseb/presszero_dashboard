import { cache_encoder } from "../utilities/helpers";
import { API_REFERENCE, API_TOKEN } from "./api.controller";

export default class Optimizer {
    RestCacheSerializer = async ({fn, name, serial, callback}) => {
        const key = `${name}_${serial}`;

        const cache = window.localStorage.getItem(key);

        if (!cache) {
            console.log("Writing Cache: ", key)
            const res = await fn();
            window.localStorage.setItem(key, JSON.stringify(res));
            if (callback) callback(res)
            return res;
        } else {
            console.log("Reading Cache: ", key)
            const res = window.localStorage.getItem(key, JSON.stringify(JSON.parse(cache)));

            if (fn) fn().then((update)=>{
                window.localStorage.setItem(key, JSON.stringify(update));
                if (callback) callback(update)
            })

            return JSON.parse(res);
        }
    }
}