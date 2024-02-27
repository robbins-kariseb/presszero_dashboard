
import requests

from openai import OpenAI
api_key = "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"
client = OpenAI(api_key=api_key)

class GenerativeAssessmentController:
    def __init__(self, company_id) -> None:
        self.company_id = company_id
        self.companyData = self.query_company()['response'][0]
    
    def query_company(self):
        headers = {
            "Authorization": "Bearer 1fbbafefe1fca393a4b56caf93bc2ca5427cb875",
            "Content-Type": "application/json",
            "Cookie": "csrftoken=15gHbG70JD2lngAgnxJFlvPAoo75PywH; sessionid=jsa9z088iid9anynkqum1xsc9l9jrrn2"
        }

        data = {
            "filters": {
                "id": self.company_id
            }
        }

        url = "https://presszero-testing.eastus.cloudapp.azure.com/en-us/api/press/zero/filter/company"

        try:
            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()  # Raises an error for 4xx or 5xx status codes
            return response.json()  # Returns JSON data from the response
        except requests.exceptions.RequestException as e:
            print('Error:', e)
            return None  # Return None in case of an error
    
    def query_chats(self):
        headers = {
            "Authorization": "Bearer 1fbbafefe1fca393a4b56caf93bc2ca5427cb875",
            "Content-Type": "application/json",
            "Cookie": "csrftoken=15gHbG70JD2lngAgnxJFlvPAoo75PywH; sessionid=jsa9z088iid9anynkqum1xsc9l9jrrn2"
        }

        data = {
            "filters": {
                "companyId": self.company_id
            }
        }

        url = "https://presszero-testing.eastus.cloudapp.azure.com/en-us/api/press/zero/filter/instantChat"

        try:
            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()  # Raises an error for 4xx or 5xx status codes
            return response.json()  # Returns JSON data from the response
        except requests.exceptions.RequestException as e:
            print('Error:', e)
            return None  # Return None in case of an error
    
    def query_model(self, message):
        chats = self.query_chats()
        
        if chats and chats['response'] and len(chats['response']) > 0:
            messages = [{"role": "user", "content": f"I will provide you with a series of chat messages from different customers to a company called {self.companyData['businessName']}, and this information should be the basis for the questions that follow!"},]
            count = 0
            for chat in chats['response']:
                if count > 20:
                    break
                messages.append({"role": "user", "content": chat['messageBody']})
                
                count = count + 1
                
            messages.append({"role": "user", "content": message})
            
            print(messages)
            
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages
            )
            
            return response['choices'][0]['message']['content']
        
controller = GenerativeAssessmentController(154784)

print(controller.query_model("How might I improve customer service?"))