import { pressZeroEmailTemplate } from "../../../business/src/controllers/message.controller";
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

    outlookTest = async ({companyId, integrationEmail}) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "integrationEmail": integrationEmail,
            "companyId": companyId
        });
          
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
          

        return await fetch(`${API_REFERENCE}api/press/zero/admin/company/email/integration`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    findOutlookProcess = async ({id}) => {
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
          

        return await fetch(`${API_REFERENCE}api/press/zero/filter/outlookCommentLog`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    listOutlookIntegrations = async ({companyId}) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "filters": {
              "companyId": companyId,
              "status": "verified"
            }
          });
          
          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };
          

        return await fetch(`${API_REFERENCE}api/press/zero/filter/outlookCommentLog`, requestOptions)
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

    sendSystemEmail = async ({message, subject, email, subtitle}) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");



        const raw = JSON.stringify({
            "subject": subject,
            "recipient_email": email,
            "message": pressZeroEmailTemplate({
                title: subject,
                subtitle: subtitle||"Press Zero",
                body: message
            })
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        return await fetch(`${API_REFERENCE}api/press/zero/admin/send/email`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }
}