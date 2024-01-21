import { API_REFERENCE, API_TOKEN } from "./api.controller";

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
    }

    getChatMessages = async ({userId, companyId}) => {
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
    }

    getCompanyUserChats = async ({userId, companyId}) => {
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
    }

    getAllChatStatistics = async () => {
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
    }

    getAllCompanies = async () => {
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
    }


    getFeedbackStatistics = async () => {
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
}