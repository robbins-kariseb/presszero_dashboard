# Press Zero Documentation

## 1. Introduction 

This Software Design Document (SDD) presents the system architecture for the Press Zero Chat Platform, an innovative B2B2C customer service application aiming to redefine customer service through groundbreaking one-to-many live chat capabilities. Focused on transforming traditional customer service processes, Press Zero envisions revolutionizing the customer service industry by streamlining and enhancing the entire customer service experience. 

 

## 1.1 Background	 

In response to the limitations of traditional customer service approaches, Press Zero seeks to leverage cutting-edge technologies to provide a unique and efficient customer service solution. This document outlines the comprehensive system architecture, highlighting key aspects defined in the Systems Requirement Specification (SRS) Document.  

 

This document provides a comprehensive and detailed description of the proposed system and Mobile Application as defined by the users in the Systems Requirement Specification Document 

 

## 2. System Context 

The Press Zero Chat Platform is a revolutionary B2B2C customer service application designed to transform traditional customer service processes. The system introduces innovative one-to-many live chat capabilities, aiming to streamline and reimagine the entire customer service experience through its business app for business agents and seamless integrations with third party platforms such as CRM’s and email services.  

 

## 3. Architecture Overview 

Concerning the Press Zero system architecture, subject to its core principles encapsulating the Client Server Architecture, this section takes a deeper dive into how the technology stack organizes different modules to facilitate optimal functionality and performance. Herein, we Identify the key components, dataflow between different modules and micro-services, and background tasks that are essential to meeting the functional requirements.  

 

## 3.1 Logical View 

- Aligned with the core principles of Client-Server Architecture, this section delves into the technology stack, organizing various modules to ensure optimal functionality and performance. It identifies key components, outlines data flow between modules and micro-services, and defines background tasks crucial to meeting functional requirements.  

## 3.1.1 Peer-to-Peer Communication 

 

- Press Zero's architecture prioritizes extensibility, aiming to accommodate future advanced requirements. A crucial aspect of this extensibility is the integration of "happy transformers" within the workflow. This integration necessitates the persistence of data to a datastore, a process detailed in the following description and illustrated in the accompanying diagram(s). 

## 3.1.1.1 Data Persistence Workflow 

- Before diving into the specifics of peer-to-peer communication, it's essential to outline the workflow that enables the integration of custom modules and the interaction with the WebSocket. Press Zero leverages a WebSocket, implemented in Python, to facilitate communication with external APIs for CRUD (Create, Read, Update, Delete) operations related to message storage. These messages, along with other Django models are stored on a Postgres Database backend. APIs, subject to CRUD are exposed for non-sensitive models and interfaces with the Business Mobile Application, Customer Mobile Application, Administrative Dashboard, Customer Dashboard, and the Press Zero Web Socket. Filters are set in place to filter out sensitive fields dynamically by means of key identification per the key-value-pair concerned with outbound JSON. 

## 3.1.1.2 Message Storage 

- The WebSocket initiates CRUD operations to store messages in a designated datastore. Upon completion of the CRUD operation, the backend generates a JSON response containing information about the saved message. 

## 3.1.1.3 Peer-to-peer communication Overview 

- The diagram illustrates the architecture's core component: peer-to-peer communication between businesses and customers. This communication is facilitated through WebSocket connections, and nodes are identified by composite keys—specifically, the Company ID and User ID. 

## 3.1.1.4 WebSocket Connection 

- The WebSocket serves as the communication bridge between business and customer nodes. Connections are established based on unique composite keys, ensuring a secure and direct communication channel. 

## 3.1.1.5 Node Identification 

- Nodes in the system are distinguished by the Company ID and User ID composite keys. These keys form a unique identifier for both businesses and customers, enabling targeted communication.
  
## 3.1.1.6 Diagram 

- The diagram visually represents the intricate process of peer-to-peer communication, showcasing the seamless interaction between businesses and customers. As data is persisted in the datastore through the WebSocket, it creates a foundation for real-time communication between nodes—enhancing the overall responsiveness and effectiveness of the Press Zero Chat Platform.

 ![d1.png](https://github.com/helloadaire/presszero_dashboard/blob/main/d1.png?raw=true) 

## 3.1.2 WebSocket (Customer Mobile Application) 

The cornerstone of Press Zero's communication infrastructure is the utilization of Web Sockets, playing a pivotal role in facilitating seamless communication between different system components. The primary objective is to establish efficient Peer-to-Peer channels, enabling direct communication between customers (A) and businesses (B). This section explores the intricate details of Web Sockets integration, shedding light on the process initiated by the Customer Mobile Application. 

## 3.1.2.1 WebSocket Integration Points 

Press Zero's customer application initiates communication through a sophisticated flow that seamlessly connects the WebSocket to essential integration points. These integration points include three core modules: the Django ORM (Object-Relational Mapping) exposed via API by the backend, Outlook integration, and Zendesk integration. 

## 3.1.2.2 Django ORM Integration 

- The WebSocket interfaces with the Django ORM through an API exposed by the backend. 
- This integration facilitates efficient data storage and retrieval related to chat messages. 

 

## 3.1.2.3 Outlook Integration 

- Integration with Outlook serves as a crucial component of the communication flow. 
- Messages are relayed to the Outlook integration module based on specific triggers. 

 

## 3.1.2.4 Zendesk Integration 
- The WebSocket seamlessly integrates with Zendesk, providing a comprehensive customer support experience. 
- Messages are relayed to Zendesk, allowing for efficient handling of customer inquiries. 

## 3.1.2.5 Diagram 

  ![d2.png](https://github.com/helloadaire/presszero_dashboard/blob/main/d2.png?raw=true) 

## 3.1.3 Web Socket (Business Mobile Application) 

- The heart of Press Zero's communication infrastructure lies in the strategic use of Web Sockets, forming a crucial element in establishing seamless communication across various system components. The primary goal is to facilitate efficient Peer-to-Peer channels, enabling direct communication between businesses (B) and customers (A). This section delves into the detailed workings of the Web Sockets integration, illuminating the process initiated by the Business Mobile Application. 

 

## 3.1.3.1 Web Socket Integration Points 

- Press Zero's business application initiates communication through a well-orchestrated flow, connecting the WebSocket to key integration points. These points include three vital modules: the Django ORM, exposed via API by the backend; Outlook integration; and Zendesk integration. 

 

## 3.1.3.2 Django ORM Integration 

- The WebSocket interfaces with the Django ORM through a backend-exposed API. 
- This integration ensures efficient storage and retrieval of chat messages within the system. 

## 3.1.3.3 Outlook Integration 

- Integration with Outlook is a pivotal component of the communication workflow. 
- Messages are relayed to the Outlook integration module based on specific triggers. 

## 3.1.3.4 Zendesk Integration 

- The WebSocket seamlessly integrates with Zendesk, enhancing the overall customer support experience. 
- Messages are relayed to Zendesk, streamlining the handling of customer inquiries. 

 

## 3.1.3.5 Web Socket Functionality 

- Designed to provide flexibility and control, the WebSocket empowers project engineers by enabling parallel execution of multiple triggers during the processing of incoming requests. This design choice enhances responsiveness and ensures optimal performance within the system. 

 

## 3.1.3.6 Business Applications Integration 

- The diagram illustrates the initiation of a connection to the WebSocket by the Business Mobile Application, utilizing the WSS (WebSocket Secure) protocol. The initial connection involves a Keep Alive message, designating the business application client as an eligible recipient for incoming messages. Eligibility is determined by a unique identification match with the Company ID and User ID composite key pair. 

 

## 3.1.3.7 Identification Mechanisms 

- To identify business app users, the "system" keyword is employed in the createdBy field, as showcased in the diagram. This mechanism ensures that messages are appropriately associated with the corresponding users within the communication channel. 
- Subsequent sections will provide an in-depth exploration of the specific steps and components depicted in the diagram, offering a comprehensive understanding of the WebSocket's role in facilitating communication within the Press Zero Chat Platform. 

## 3.1.3.8 Diagram 

   ![d3.png](https://github.com/helloadaire/presszero_dashboard/blob/main/d3.png?raw=true) 

## 3.1.4 Peer-to-peer Relay – Inbound (Zendesk) 

- In the Press Zero ecosystem, the Peer-to-Peer relay messages framework orchestrated by Zendesk plays a pivotal role in ensuring that all messages sent from Zendesk to the user not only reside on Zendesk servers but are also seamlessly queried and transmitted back to the user in reasonable time. This section provides a comprehensive understanding of the intricate process depicted in the diagram outlining Zendesk's Peer-to-Peer relay messages. 

 

## 3.1.4.1 Framework Implementation 

- The Zendesk Peer-to-Peer relay messages framework is meticulously implemented to guarantee the timely capture and delivery of messages. Through API interactions, messages sent from Zendesk to the user are not only captured but also relayed back to the user. This integration is seamlessly woven into the overarching workflow for parallel processing, leveraging the WebSocket to initiate calls to external systems. 

 

## 3.1.4.2 Workflow Description 

- Zendesk Integration Workflow 
- Zendesk integration is seamlessly embedded in the overall workflow designed for parallel processing within the WebSocket. 
- The integration ensures that Zendesk becomes an active participant in the communication ecosystem. 
- API Queries for Message Transmission 
- If Zendesk is integrated with a specific company, the API queries Zendesk tickets. 
- It checks if the Sender ID is not equal to the Recipient ID. 
- Ticket Creation or Message Relay 
- If the Sender ID and Recipient ID are not equal, a new ticket is created if it doesn't already exist. 
- Otherwise, the relay message is sent to the client WebSocket. 

 

## 3.1.4.3 Workflow Execution 

- The diagram below illustrates the step-by-step execution of the Peer-to-Peer relay messages from Zendesk. Key components include: 
- Database CRUD Operations on Companies: 
- Background services execute CRUD operations on companies, ensuring a seamless interaction between Zendesk and the Press Zero ecosystem. 
- Query Zendesk Tickets 
- The workflow queries Zendesk tickets, determining the need for ticket creation or direct message relay based on the Sender and Recipient IDs. 
- Relay Message Execution 
- If the Sender ID is not equal to the Requester ID, indicating a message from Zendesk to the user, the workflow proceeds to either create a new ticket or relay the message to the client WebSocket. 
- Background Services 
- The Zendesk integration in the Peer-to-Peer relay messages framework exemplifies Press Zero's commitment to real-time communication and responsiveness. Background services continuously execute CRUD operations, ensuring the seamless flow of information between Zendesk, the Press Zero database, and the WebSocket. 
- The subsequent sections will delve into the specific steps and components depicted in the diagram, providing a comprehensive understanding of how Zendesk contributes to the Peer-to-Peer relay messages within the Press Zero Chat Platform. 

## 3.1.4.4 Diagram 

  ![d4.png](https://github.com/helloadaire/presszero_dashboard/blob/main/d4.png?raw=true) 

## 3.1.5 Parallel Processing 

- Press Zero's WebSocket facilitates real-time communication within the application by enabling seamless interaction among various components. This section provides an in-depth exploration of parallel processing conducted by the WebSocket, focusing on four distinct modules: CRUD operations, Notifications, Integrations (including Zendesk, Outlook, and Press Zero Node 2), and robust error handling mechanisms. 

## 3.1.5.1 Web Socket Parallel Processing Overview 

- The WebSocket employs parallel processing to handle multiple requests simultaneously, ensuring efficient communication between clients while maintaining system responsiveness. This approach streamlines the workflow and accelerates interaction between clients by reducing synchronous runtime. 

CRUD Operations 
- The WebSocket conducts CRUD operations to persist and retrieve data from the database. These operations enable seamless storage and retrieval of chat messages, user information, and other essential data within the Press Zero ecosystem. 
- Notifications 
- Press Zero's WebSocket integrates with Firebase Cloud Messaging (FCM) using PUB/SUB, enabling the delivery of real-time notifications to all subscribed nodes. For incoming messages, a PUB request is sent to push notifications to all subscribed nodes, ensuring timely delivery of important updates to users. 
- Integrations 
- Integrations with external systems, including Zendesk, Outlook, and Press Zero Node 2, play a crucial role in enhancing the functionality and interoperability of the Press Zero platform. 
- Zendesk Integration 
- The WebSocket seamlessly integrates with Zendesk, allowing for seamless communication and interaction with Zendesk tickets and messages. 
- Outlook Integration 
- Integration with Outlook enables the WebSocket to relay messages and notifications, enhancing communication capabilities within the application. 
- Press Zero Integration (Node 2) 
- WebSocket ensures that messages sent from Node 1 are received by Node 2, facilitating smooth communication between interconnected nodes within the Press Zero ecosystem. 

## 3.1.5.2 Error Handling and Robustness 
- To ensure system stability and reliability, robust error handling mechanisms are implemented within the WebSocket. If one of the parallel processes encounters an error, it is isolated to prevent cascading failures, ensuring that other processes remain unaffected. This approach enhances the resilience of the system and maintains uninterrupted communication between clients. 

## 3.1.5.3 Diagram 
- The accompanying diagram illustrates the parallel processing capabilities of the WebSocket, showcasing the seamless interaction among different modules. Each module operates independently, executing tasks concurrently to optimize system performance and responsiveness. 
- Subsequent sections will delve into the specific functionalities and interactions of each module depicted in the diagram, providing a comprehensive understanding of how parallel processing enhances the functionality of the Press Zero Chat Platform. 

  ![d5.png](https://github.com/helloadaire/presszero_dashboard/blob/main/d5.png?raw=true) 

## 3.1.6 Web Socket - Keep Alive 
- In the dynamic architecture of Press Zero, maintaining a persistent and responsive connection between the client and the server is paramount. The implementation of the Keep-Alive mechanism ensures the vitality of connections within the WebSocket pool, allowing them to receive incoming messages seamlessly. This section elaborates on the intricate details of the Keep-Alive feature, a pivotal element in the latest stable release. 

## 3.1.6.1 Keep-Alive Mechanism 
- The Press Zero WebSocket necessitates the initiator of the connection to dispatch a Keep-Alive request. This request serves a crucial role, as it safeguards the connection's position within the pool of connections eligible to receive incoming messages. The objective is to establish and sustain a persistent link between the client and server, guaranteeing the immediate relay of all incoming messages to the client upon connection establishment. 

## 3.1.6.2 Implementation in Latest Stable Release 
- Within the latest stable release, the Keep-Alive feature assumes a central role in preserving the integrity and responsiveness of connections. Its deployment ensures that connections remain active and ready to receive messages as soon as the client establishes a connection with the server. 

## 3.1.6.3 Operational Flow 
- The operational flow of the Keep-Alive mechanism involves the client initiating the connection, sending a Keep-Alive request to the WebSocket. The WebSocket, in turn, registers the client, verifying the integration status with Outlook and Zendesk. 

## 3.1.6.4 Integration Status Checks 
- Outlook Integration: The WebSocket checks if Outlook integration is active. If integrated, it proceeds with sending the relay message should the message type not be a Keep-Alive. 
- Zendesk Integration: Similarly, the WebSocket checks the integration status with Zendesk. If integrated, the message is sent through if the message type is not a Keep-Alive process continues. 

## 3.1.6.5 Keep-Alive Execution 
- Based on the message type, the WebSocket executes the Keep-Alive process, maintaining the connection within the pool. This ensures that all subsequent incoming messages are promptly relayed to the client. 

## 3.1.6.6 Diagram 
- The accompanying diagram visually represents the Keep-Alive mechanism within the Press Zero WebSocket. The interaction between the client, WebSocket, and integrated systems (Outlook and Zendesk) is illustrated, showcasing the crucial steps in preserving connection persistence. 
- Subsequent sections will delve into specific functionalities and interactions depicted in the diagram, offering a comprehensive understanding of how the Keep-Alive feature enhances the reliability and responsiveness of the Press Zero Chat Platform. 

 ![d6.png](https://github.com/helloadaire/presszero_dashboard/blob/main/d6.png?raw=true) 


## 3.1.7 Sentiment Analysis with Happy Transformer 

Sentiment analysis is a crucial component within the Press Zero Chat Platform, contributing to the comprehensive reporting capabilities of the system. This section outlines the workflow for evaluating the sentiment of incoming chat messages, incorporating best practices to enhance understanding and satisfaction assessment. 

## 3.1.7.1 Purpose and Importance 

- Concerned with Reporting, the primary goal is to assess the sentiment of incoming chat messages. This evaluation serves to provide valuable insights for both system administrators and business stakeholders. Understanding the context and sentiment of each chat is instrumental in gauging overall customer satisfaction and identifying potential customer churn. The workflow described below outlines the systematic approach adopted by Press Zero to achieve this objective. 

## 3.1.7.2 Workflow Overview 

- The workflow commences with the reception of incoming chat messages through WebSocket requests. These messages are promptly written to the database, initiating background processes to monitor for new messages. Upon the detection of a new message, the system triggers the sentiment analysis process, leveraging both Natural Language Toolkit (NLTK) and Happy Transformer. 

## 3.1.7.3 Sentiment Analysis Process 

- WebSocket Integration: Incoming chat messages are received through WebSocket requests, capturing real-time interactions between users. 

- Database Interaction: The system ensures the seamless persistence of chat messages through Create, Read, Update, and Delete (CRUD) operations on the database. 

- Background Processes: Continuous monitoring for new messages is facilitated through background processes, ensuring swift detection of incoming content. 

- Sentiment Analysis Execution: Upon identifying a new message, the system initiates sentiment analysis, employing both the Natural Language Toolkit and the Happy Transformer. 

- Contextual Analysis with Happy Transformer: The Happy Transformer is specifically employed for contextual sentiment analysis, providing a nuanced understanding of the overall sentiment within the chat. 

- Score Extraction: The sentiment analysis process yields a score ranging from 1 to 10, representing the overall sentiment of the text within the chat. 

- Database Update: The calculated sentiment score is stored in the database, associating it with the corresponding chat message. 

## 3.1.7.4 Outcome and Reporting 

- The final step involves rendering a comprehensive Sentiment Analysis Report, consolidating the sentiment scores of individual chat messages. This report empowers system and business administrators with valuable insights into customer satisfaction trends and identifies potential areas of improvement. 

## 3.1.7.5 Best Practices 

- Real-time Analysis: The utilization of WebSocket ensures real-time analysis of incoming chat messages, providing immediate feedback. 
- Holistic Assessment: Incorporating both NLTK and the Happy Transformer enables a holistic assessment of sentiment, capturing nuanced contextual nuances. 
- Continuous Monitoring: Background processes ensure continuous monitoring for new messages, maintaining an up-to-date sentiment analysis. 

## 3.1.7.6 Diagram 

- The accompanying diagram visually represents the Sentiment Analysis workflow within the Press Zero Chat Platform, illustrating the seamless integration of various components in achieving accurate sentiment assessments. 

 ![d7.png](https://github.com/helloadaire/presszero_dashboard/blob/main/d7.png?raw=true) 

- Subsequent sections will delve into specific functionalities and interactions depicted in the diagram, offering a comprehensive understanding of how Sentiment Analysis enhances the reporting capabilities of the Press Zero Chat Platform. 

## 3.1.8 Firebase Web Socket Integration 

- The integration of Firebase Cloud Messaging (FCM) with the WebSocket is a strategic decision within the Press Zero Chat Platform to streamline and enhance the delivery of notifications. This section outlines the seamless integration of Firebase with the WebSocket, detailing the workflow and its significance within the broader system architecture. 

## 3.1.8.1 Purpose and Importance 

- Notifications play a pivotal role in maintaining real-time communication within the Press Zero Chat Platform. The purpose of integrating Firebase with the WebSocket is to efficiently control the distribution of notifications, ensuring they reach the intended recipients based on user IDs and application types. This integration enhances user experience by delivering relevant updates while also optimizing resource usage. 

## 3.1.8.2 Workflow Overview 

- The integration of Firebase with the WebSocket involves a well-defined workflow that aligns with the overall architecture of the Press Zero Chat Platform. The process seamlessly synchronizes with the delivery of notifications and leverages Firebase FCM's PUB/SUB capabilities. 

## 3.1.8.3 Workflow Execution 

- WebSocket Initialization (ON INIT): The WebSocket initializes with an ON INIT event, marking the beginning of the connection process. 

- Token Acquisition: During initialization, the WebSocket acquires a unique token associated with the user's device. 

- Subscribe to Topic with Token: Utilizing the acquired token, the WebSocket subscribes to a specific topic associated with the user's ID and application type. For instance, a user with ID 43 might subscribe to the topic "customer-app-43." 

- Firebase Admin Interaction: Interaction with the Firebase Admin facilitates CRUD operations on chat messages through database operations (Create, Read, Update, Delete). 

- Notification Sending Process: When a new chat message is detected, the WebSocket triggers a POST request to the Firebase server, initiating the process of sending notifications to subscribers. 

- Firebase FCM PUB/SUB: Firebase FCM's PUB/SUB mechanism efficiently sends notifications to subscribers based on the subscribed topics, ensuring precise and targeted delivery. 

## 3.1.8.4 Best Practices 

- Topic-Based Subscription: Utilizing topics for subscription allows for granular control over notifications, ensuring that users receive updates relevant to their user ID and application type. 

- Efficient Resource Usage: Firebase FCM's PUB/SUB mechanism optimizes resource usage by delivering notifications only to devices subscribed to specific topics. 

## 3.1.8.5 Diagram 

- The accompanying diagram visually represents the Firebase/WebSocket integration within the Press Zero Chat Platform. It illustrates the sequential steps involved in the workflow, showcasing the synchronization between the WebSocket, Firebase Admin, and Firebase FCM for efficient notification delivery. 

- Subsequent sections will delve into specific functionalities and interactions depicted in the diagram, offering a comprehensive understanding of how Firebase/WebSocket integration enhances the notification system within the Press Zero Chat Platform. 

 ![d8.png](https://github.com/helloadaire/presszero_dashboard/blob/main/d8.png?raw=true) 

## Authenticate User

### Description:

- This API authenticates a user and provides access to authorized agents for querying various endpoints. The user must be authorized to access the specified resource, denoted by `api_key` and `api_secret`.

- Endpoint: `/authenticate/user`

- Request:
  -
  ```
  {
    "api_key": "...",
    "api_secret": "..."
  }
  JSON```

- Response:
  - ```{
    "token": "generated_token",
    "is_authenticated": true,
    "is_new": true
    }```

- Error Response:
  - ```{
    "details": "Unauthorized!"
    }```

## PressZero Users Registration (Deprecated)

### Description:

- This API has been deprecated. Please use the Models API for creating, retrieving, and deleting user data..

- Endpoint: `/presszero/users/registration`

- Request:
  - ```{
    "name": "Herbert123",
    "surname": "Mutonga123",
    "contact": "123456",
    "country": "Spain",
    "email": "email@domain.com",
    "image": "BLOB",
    "phoneNumber": "265817809301"
    }```

- Response:
  - ```{
    "userId": 1,
    "response": "Invalid email or password."
    }```


## PressZero SMS Verification

### Description:

- This API verifies a user's phone number by checking the provided verification code against the database. It is used to authenticate the user and issue an authentication token.

- Endpoint: `/presszero/sms/verification`

- Request:
  - ```{
    "phoneNumber": "+264814628740",
    "verificationCode": "123456"
    }```

- Response:
  - ```{
    "response": "successful",
    "userId": 1,
    "isRegistered": true
    }```

- Error Responses
  - ```{
    "response": "invalid"
    }```

## PressZero Email Verification

### Description:

- This API verifies a user's email address by checking the provided verification code against the database. It is used to authenticate the user and issue an authentication token.

- Endpoint: `/presszero/email/verification`

- Request:
  - ```{
    "email": "email@domain.com",
    "verificationCode": "123456"
    }```

- Response:
  - ```{
    "response": "successful",
    "userId": 1,
    "isRegistered": true
    }```

- Error Responses
  - ```{
    "response": "invalid"
    }```

- Verification code expired
  - ```{
    "response": "expired"
    }```


## PressZero Send SMS OTP

### Description:

- This API sends a One-Time Password (OTP) to the provided phone number for user verification.

- Endpoint: `/presszero/send/sms/otp`

- Request:
  - ```{
    "phoneNumber": "+264814628740"
    }```

- Response:
  - ```{
    "response": "successful"
    }```

- Error Responses
  - ```{
    "response": "failed"
    }```

## PressZero Manage Chats

### Description:

- This API allows users to manage their chat conversations. It supports updating the status of messages and deleting entire chat histories.

- #### Methods
  - `POST`: Update chat status
  - `DELETE`: Delete chat history

- Endpoint: `/presszero/manage/chats`

- Request:
  - ```{
        "userId": 1,
        "companyId": 2,
        "status": "read"
    }```

- Response:
  - ```{
        "response": "changed to 'read'",
        "messageCount": 5
    }```


