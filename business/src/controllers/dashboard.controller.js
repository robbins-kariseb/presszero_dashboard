import { cache_encoder } from "../utilities/helpers";
import { API_REFERENCE, API_TOKEN } from "./api.controller";
import Optimizer from "./optimization.controller";

export default class QuerySets {
    getSingleCompany = async (id) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            filters: {
                id: id
            }
        });

        var requestOptions = {
            method: 'POST',
            mode: "cors",
            cache: "no-cache",
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        return await fetch(`${API_REFERENCE}api/press/zero/filter/company`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    getZendeskIntegrations = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        return await fetch(`${API_REFERENCE}api/press/zero/admin/zendesk/list/all`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    getActiveUsers = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        return await fetch(`${API_REFERENCE}api/press/zero/admin/active/users`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    getRequestedCompanies = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        return await fetch(`${API_REFERENCE}api/press/zero/admin/requested/companies`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    getSingleSubscription = async (id) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "companyId": id
          });
          
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
          

        return await fetch(`${API_REFERENCE}api/press/zero/admin/single/subscription/model`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    getAllCategories = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");
    
        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        return await fetch(`${API_REFERENCE}api/press/zero/models/categories?limit=10000`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    getCompanyStatistics = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({});

        var requestOptions = {
            method: 'POST',
            mode: "cors",
            cache: "no-cache",
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        return await fetch(`${API_REFERENCE}api/press/zero/admin/ca/statistics`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    updateModel = async ({model, fields, id}) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "id": id,
        "fields": fields
        });

        var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        return await fetch(`${API_REFERENCE}api/press/zero/models/${model}`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    getCompanyTicketsAndChats = async ({companyId}) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "companyId": companyId
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        return await fetch(`${API_REFERENCE}api/press/zero/admin/list/company/tickets`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    getModel = async ({model, id}) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "filters": {
                "id": id
            }
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        return await fetch(`${API_REFERENCE}api/press/zero/filter/${model}`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    getFilteredModels = async ({model, filters}) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "filters": filters
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        return await fetch(`${API_REFERENCE}api/press/zero/filter/${model}`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    deleteModel = async ({model, id}) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            id: id,
        });

        var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        return await fetch(`${API_REFERENCE}api/press/zero/models/${model}`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    createModel = async ({model, object}) => {

        if (model === "subscription")
            return this.createSubscription({model, object})

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(object);

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        return await fetch(`${API_REFERENCE}api/press/zero/models/${model}`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    createSubscription = async ({model, object}) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(object);

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        return await fetch(`${API_REFERENCE}api/press/zero/admin/create/subscription`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    uploadFile = async ({base64}) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "base64File": base64
        });

        var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        return await fetch(`${API_REFERENCE}api/press/zero/admin/file/upload`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    manageCategories = async ({companyId, categoryList}) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            companyId, categoryList
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        return await fetch(`${API_REFERENCE}api/press/zero/admin/manage/categories`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    getCompanyTickets = async ({companyId}) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "filters": {
              "companyId": companyId
            }
          });

        var requestOptions = {
            method: 'POST',
            mode: "cors",
            cache: "no-cache",
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        return await fetch(`${API_REFERENCE}api/press/zero/filter/companyUserChat`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    getSubscriptionProducts = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        return await fetch(`${API_REFERENCE}api/press/zero/admin/subscription/products`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    getSubscriptions = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'GET',
            mode: "cors",
            cache: "no-cache",
            headers: myHeaders,
            redirect: 'follow'
        };

        return await fetch(`${API_REFERENCE}api/press/zero/admin/subscription/models`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    getCompanyChatMessages = async ({companyId}) => {
        const optimizer = new Optimizer()
        return await optimizer.RestCacheSerializer({
            fn: async ()=>{
                var myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "filters": {
                        "companyId": companyId
                    }
                });

                var requestOptions = {
                    method: 'POST',
                    mode: "cors",
                    cache: "no-cache",
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                return await fetch(`${API_REFERENCE}api/press/zero/filter/instantChat`, requestOptions)
                .then(response => response.text())
                .then(result => JSON.parse(result))
                .catch(error => {
                    console.log('error', error)
                    return []
                });
            },
            name: "getCompanyChatMessages",
            serial: cache_encoder({companyId}),
        })
    }

    getChatMessages = async ({userId, companyId}) => {
        const optimizer = new Optimizer()
        return await optimizer.RestCacheSerializer({
            fn: async ()=>{
                var myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "filters": {
                    "userId": userId,
                    "companyId": companyId
                    }
                });

                var requestOptions = {
                    method: 'POST',
                    mode: "cors",
                    cache: "no-cache",
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                return await fetch(`${API_REFERENCE}api/press/zero/filter/instantChat`, requestOptions)
                .then(response => response.text())
                .then(result => JSON.parse(result))
                .catch(error => {
                    console.log('error', error)
                    return []
                });
            },
            name: "getChatMessages",
            serial: cache_encoder({userId, companyId}),
        })
    }

    getCompanyUserChats = async ({userId, companyId}) => {
        const optimizer = new Optimizer()
        return await optimizer.RestCacheSerializer({
            fn: async ()=>{
                var myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "filters": {
                    "userId": userId,
                    "companyId": companyId
                    }
                });

                var requestOptions = {
                    method: 'POST',
                    mode: "cors",
                    cache: "no-cache",
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                return await fetch(`${API_REFERENCE}api/press/zero/filter/instantChat`, requestOptions)
                .then(response => response.text())
                .then(result => JSON.parse(result))
                .catch(error => {
                    console.log('error', error)
                    return []
                });
            },
            name: "getCompanyUserChats",
            serial: cache_encoder({userId, companyId}),
        })
    }

    getAllChatStatistics = async () => {
        const optimizer = new Optimizer()
        return await optimizer.RestCacheSerializer({
            fn: async ()=>{
                var myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
                myHeaders.append("Content-Type", "application/json");

                var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
                };

                return await fetch(`${API_REFERENCE}api/press/zero/admin/chat/message/statistics`, requestOptions)
                .then(response => response.text())
                .then(result => JSON.parse(result))
                .catch(error => {
                    console.log('error', error)
                    return []
                });
            },
            name: "getAllChatStatistics",
            serial: cache_encoder({}),
        })
    }

    streamAllCompanies = async (callback) => {
        const companies = [];

        for (var x = 1; x < 10; x++) {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
            myHeaders.append("Content-Type", "application/json");

            const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
            };

            const res = await fetch(`${API_REFERENCE}api/press/zero/models/company?limit=50&page=${x}`, requestOptions)
                .then(response => response.text())
                .then(result => JSON.parse(result))
                .catch(error => {
                    console.log('error', error)
                    return []
                });

            if (res && res.items) {
                if (res.items.length === 0) break;

                res.items.forEach((item) => {
                    companies.push(item);
                });

                if (callback) callback(companies)
            }
        }
    }

    getAllCompanies = async () => {
        const optimizer = new Optimizer()
        return await optimizer.RestCacheSerializer({
            fn: async ()=>{
                var myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
                myHeaders.append("Content-Type", "application/json");

                var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
                };

                return await fetch(`${API_REFERENCE}api/press/zero/models/company?limit=10000`, requestOptions)
                .then(response => response.text())
                .then(result => JSON.parse(result))
                .catch(error => {
                    console.log('error', error)
                    return []
                });
            },
            name: "getAllCompanies",
            serial: cache_encoder({}),
        })
    }

    getFeedbackStatistics = async () => {
        const optimizer = new Optimizer()
        return await optimizer.RestCacheSerializer({
            fn: async ()=>{
                var myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({});

                var requestOptions = {
                    method: 'POST',
                    mode: "cors",
                    cache: "no-cache",
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                return await fetch(`${API_REFERENCE}api/press/zero/admin/feedback/statistics`, requestOptions)
                .then(response => response.text())
                .then(result => JSON.parse(result))
                .catch(error => {
                    console.log('error', error)
                    return []
                });
            },
            name: "getFeedbackStatistics",
            serial: cache_encoder({}),
        })
    }

    getAuthorized = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({});

        var requestOptions = {
            method: 'POST',
            mode: "cors",
            cache: "no-cache",
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        return await fetch(`${API_REFERENCE}api/press/zero/admin/ca/statistics`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    getSocialLinks = async ({companyId}) => {
        const optimizer = new Optimizer()
        return await optimizer.RestCacheSerializer({
            fn: async ()=>{
                var myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "filters": {
                        "companyId": companyId
                    }
                });

                var requestOptions = {
                    method: 'POST',
                    mode: "cors",
                    cache: "no-cache",
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                return await fetch(`${API_REFERENCE}api/press/zero/filter/socialLinks`, requestOptions)
                .then(response => response.text())
                .then(result => JSON.parse(result))
                .catch(error => {
                    console.log('error', error)
                    return []
                });
            },
            name: "getSocialLinks",
            serial: cache_encoder({companyId}),
        })
    }
}