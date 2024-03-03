const cache = {};

export default class Optimizer {
    RestCacheSerializer = async ({fn, name, serial, callback}) => {
        const key = `${name}_${serial}`;

        // Check if data exists in cache
        if (cache[key]) {
            console.log("Reading Cache from memory: ", key);
            if (callback) callback(cache[key]);

            setTimeout(async () => {
                console.log("Fetching from API: ", key);
                const res = await fn();
                // Cache data in memory
                cache[key] = res;
                if (callback) callback(res);
            }, 50);
            return cache[key];
        } else {
            console.log("Fetching from API: ", key);
            const res = await fn();
            // Cache data in memory
            cache[key] = res;
            if (callback) callback(res);
            return res;
        }
    }
}

// export default class Optimizer {
//     RestCacheSerializer = async ({fn, name, serial, callback}) => {
//         const key = `${name}_${serial}`;

//         const cache = window.localStorage.getItem(key);

//         if (!cache) {
//             console.log("Writing Cache: ", key)
//             const res = await fn();
//             window.localStorage.setItem(key, JSON.stringify(res));
//             if (callback) callback(res)
//             return res;
//         } else {
//             try {
//                 console.log("Reading Cache: ", key)
//                 const res = window.localStorage.getItem(key, JSON.stringify(JSON.parse(cache)));

//                 if (fn) setTimeout(() => {
//                     fn().then((update)=>{
//                         if (update === undefined) return;
//                         window.localStorage.setItem(key, JSON.stringify(update));
//                         if (callback) callback(update)
//                     })
//                 }, 50);

//                 return JSON.parse(res);
//             } 
//             catch (ex) {
//                 console.log("Writing Cache: ", key, ex)
//                 const res = await fn();
//                 window.localStorage.setItem(key, JSON.stringify(res));
//                 if (callback) callback(res)
//                 return res;
//             }
//         }
//     }
// }