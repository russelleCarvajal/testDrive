
import appConfig from './config/config.js';

// PureCloud OAuth information
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;

// API instances
const usersApi = new platformClient.UsersApi();
const notificationsApi = new platformClient.NotificationsApi();
const analyticsApi = new platformClient.AnalyticsApi();
const routingApi = new platformClient.RoutingApi();

let userName, imgUri, newUser;

function oAuthlogIn(){
    const redirectUri = window.location.href;
    const queryString = window.location.search.substring(1);
    const pcEnvironment = queryString.split('=');

    let clientId = appConfig.clientIDs[pcEnvironment[1]];

    return client.loginImplicitGrant(clientId, redirectUri,)
    .then(() => {   
        client.setPersistSettings(true);
        console.log("Im in again !!!!!" + appConfig['redirectUriBase'])
        
    return usersApi.getUsersMe()
    }).then((myInfo) => {
        console.log(myInfo);
        userName = myInfo.name;
        imgUri = myInfo.images[0].imageUri;
    }) 
    .catch((err) => {
    });    
}

// Create a user
function createUSer() {
    let opt = {
        'name': 'Juan Dela Cruz',
        'email': 'juandelacruz5@genesys.com',
        'department': '',
        'password': 'Bfgsdfg11!'   
    };
    usersApi.postUsers(opt)
    .then((data)=> {
        newUser = data.id;
        console.log(newUser);
    })
}

// Create a user
function deleteUSer() {
    usersApi.deleteUser(newUser)
    .then((data)=> {
        console.log(data);
    })
}

// Open chat function
function openChat() {
    let chatConfig = {
        "webchatAppUrl": "https://apps.mypurecloud.com/webchat",
        "webchatServiceUrl": "https://realtime.mypurecloud.com:443",
        "orgId": "15341",
        "orgGuid": "03671e89-0883-48b0-8284-cd5260c38745",
        "orgName": "genesys4",
        "queueName": "Russ TestQueue",
        "logLevel": "DEBUG",
        "locale": "en",
        "data": {
            "firstName": userName,
            "lastName": "",
            "addressStreet": "",
            "addressCity": "",
            "addressPostalCode": "",
            "addressState": "",
            "phoneNumber": "",
            "customField1Label": "",
            "customField1": "",
            "customField2Label": "",
            "customField2": "",
            "customField3Label": "",
            "customField3": "",
            "email": ""
        },
        "companyLogo": {
            "width": 600,
            "height": 149,
            "url": "https://d3a63qt71m2kua.cloudfront.net/developer-tools/1447/assets/images/PC-blue-nomark.png"
        },
        "companyLogoSmall": {
            "width": 25,
            "height": 25,
            "url": "https://d3a63qt71m2kua.cloudfront.net/developer-tools/1447/assets/images/companylogo.png"
        },
        "agentAvatar": {
            "width": 462,
            "height": 462,
            "url": imgUri
        },
        "welcomeMessage": "Thanks for chatting using the dev tools chat page.",
        "cssClass": "webchat-frame",
        "css": {
            "width": "100%",
            "height": "100%"
        }
        };
    ININ.webchat.create(chatConfig).then(function(webchat) {
    // Render to popup
      return webchat.renderPopup({
        width: 400,
        height: 400,
        title: 'Chat',
        //set newTab to true if using screen share
        // newTab: true
      }).catch(function(error) {
        console.error('Error starting chat');
        console.error(error);
      });
    }).catch(function(error) {
      console.error('Error initializing chat');
      console.error(error);
    });
}

export {oAuthlogIn, openChat, createUSer, deleteUSer}
