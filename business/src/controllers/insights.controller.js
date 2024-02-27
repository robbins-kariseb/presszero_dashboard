import { API_REFERENCE, API_TOKEN } from "./api.controller";


export default class SmartInsights {
  queryModel = async ({message, companyId, topicId}) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "message": message,
            "companyId": companyId,
            "topicId": topicId,
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        return await fetch(`${API_REFERENCE}api/press/zero/admin/smart/chat`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });

  }

  listInsights = async ({companyId}) => {
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

    return await fetch(`${API_REFERENCE}api/press/zero/admin/list/smart/chat`, requestOptions)
    .then(response => response.text())
    .then(result => JSON.parse(result))
    .catch(error => {
        console.log('error', error)
        return []
    });

}
}


