# Meew Frontend

Link to [Backend](https://github.com/Bringordie/meew_eventmap_backend)

****Demo:****

Install Expo Client:

[Apple](https://apps.apple.com/us/app/expo-client/id982107779)

[Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US)

Expo app demo:

https://expo.io/@bringordie/projects/meew-demo

Open the link on your phone and open the client. Or open the link on a computer and take and QR scan the code.

**You should see a LOGIN screen. If that is not the case shake your phone and reload**

**Login credentials**

Username: t2

Password secret

****Setup:****

1. Download the github branch.
2. Run a npm i to install the node-module dependencies
3. In the **meew_assignment_frontend** folder change the url inside settings.js to the correct working url.
4. Download the latest version of NPM

```
https://www.npmjs.com/get-npm
```

5. Download the latest version of Expo

```
npm install expo-cli --global
```

6. Add a setting.js file in the outer folder with

```
export const SERVER_URL = "BACKEND URL";
```

****Code files:****

App.js

    - Main "app" file. Here is where the have our main View that leads to other components.

GetLoginData.js

    - Component where you can login. Once a successfully login has been accomplished the events will be collected also.

CreateEvent.js

    - Component for creating an event.

serverFacade.js

    - Facade for all backend calls.

settings.js

    - Contains the backend url that is used in serverFacade.
