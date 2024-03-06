import { API_REFERENCE, API_TOKEN, APP_REFERENCE } from "./api.controller";
import { pressZeroEmailTemplate } from "./message.controller";
const CryptoJS = require("crypto-js");
const salt = '00-_-21..Po>o/|:KpO';

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

    inviteCompanyCustomer = async ({companyId, name, surname, email}) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({companyId, name, surname, email});

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        return await fetch(`${API_REFERENCE}api/press/zero/models/businessCustomerInvitations`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    sendSystemEmail = async ({message, subject, email, subtitle, action}) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");



        const raw = JSON.stringify({
            "subject": subject,
            "recipient_email": email,
            "message": pressZeroEmailTemplate({
                title: subject,
                subtitle: subtitle||"Press Zero",
                body: message,
                action: action,
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

    updateAccessKeys = async ({userId, access_key}) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "userId": userId,
            "password": access_key
        });

        const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
        };

        return await fetch(`${API_REFERENCE}api/press/zero/admin/update/accessKeys`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => {
            console.log('error', error)
            return []
        });
    }

    createMagicLink = async ({email, password}) => {
        // String to encrypt
        const string = `{"email": "${email}", "password": "${password}"}`;

        // Encrypt the string using AES encryption
        const encryptedString = CryptoJS.AES.encrypt(string, salt).toString();

        return `${APP_REFERENCE}login/?key=${encryptedString}`
    }

    extractMagicLink = () => {
        const urlParts = window.location.href.split('?')
        let json = '';

        if (urlParts.length === 2) {
            const keyVal = urlParts[1].split('=')

            if (keyVal[0] === 'key') {
                json = keyVal[1];

                if (json.length > 0) {
                    // Encrypted string
                    const encryptedString = json; // Replace "encrypted string here" with your actual encrypted string

                    // Decrypt the string using AES decryption
                    const decryptedBytes = CryptoJS.AES.decrypt(encryptedString, salt);
                    const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);

                    console.log("Decrypted String:", decryptedString);

                    try {
                        const res = JSON.parse(decryptedString)
                        console.log(res)
                        return res;
                    } catch (ex) {
                        return null;
                    }
                }
            }
        } else {
            return null;
        }
    }
}