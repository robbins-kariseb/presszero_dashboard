import { API_REFERENCE, API_TOKEN } from "./api.controller";

export default class Integrations  {
    zendeskTest = async ({companyId, token, username, domain}) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "companyId": companyId,
            "domain": domain,
            "username": username,
            "token": token
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        return await fetch(`${API_REFERENCE}api/press/zero/admin/zendesk/integration`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    listZendeskIntegrations = async ({companyId}) => {
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

        return await fetch(`${API_REFERENCE}api/press/zero/admin/zendesk/list/integration`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }
}