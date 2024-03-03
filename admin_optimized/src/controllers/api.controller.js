export const ENDPOINTS = {
    testing: 'https://presszero-testing.eastus.cloudapp.azure.com/en-us/',
    production: 'https://presszero-prod.eastus.cloudapp.azure.com/en-us/',
    quality_assurance: 'https://presszero-qa.eastus.cloudapp.azure.com/en-us/',
    development: 'https://presszero-dev.eastus.cloudapp.azure.com/en-us/',
}

export const ENV_LOCATION = "testing";
export const API_REFERENCE = ENDPOINTS[ENV_LOCATION];
export const API_TOKEN = '1fbbafefe1fca393a4b56caf93bc2ca5427cb875'