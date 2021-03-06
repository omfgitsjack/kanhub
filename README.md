# KanHub

## Team Members
- Jack Yiu
- Kenny Lam

## Description
Our project will be to create a chrome extension that would “inject” code and UI elements onto the existing Github repo interface that will help developers to organize their internal team structure by allowing users to create their own groups within the repo. We will also create a "Standup" feature that will allow developers to do their daily standup meetings right within GitHub without relying on other applications such as slack. We will also include a real-time chat feature that allows collaborators to quickly discuss what they are working on at the moment so that they will always be on the same page. The role of the real-time chat is similar to how each issue has a conversation thread. We are hoping this extension would create a seamless experience for current developers to help organize their team.

## [API Docs](https://app.swaggerhub.com/api/omfgitsjack/kanhub/2.0.3)
- All api routes (with the exception of /auth/github and /auth/github/callback) require session id.
- Curl commands are found by clicking on 'Try it out' and executing the command (you may need to fill in some path params)
- The server response from swagger is inaccurate, but you will be able to see the curl command that you can copy into your terminal

## [Demo Video](https://youtu.be/1uJNxMebBZw)

## Chrome Extension Installation
### Prerequisites
- A valid account on [Github](https://github.com/)
- You will require [Google Chrome browser](https://www.google.com/chrome/browser/desktop/index.html) to install this extension (latest version preferred)

### How to install
#### Installing from [KanHub.me](https://kanhub.me:8080) (recommended)
1. The easiest way to install would be to [install it from our landing page](https://kanhub.me:8080) or you can [go directly to the webstore and install it there](https://chrome.google.com/webstore/detail/kanhub/peacnodjjlhhodekaiafamddcgpjnbdo)

#### Installing from the source
1. Clone our repo, cd into chrome-extension and npm install
2. Now we will build the chrome-extension: npm run build
3. Open up chrome & go into your extensions manager (Settings -> More Tools -> Extensions)
4. Enable 'Developer Mode' found at the top
5. Click on 'Load unpacked extension...' and select omfgitsklampz/chrome-extension/build
6. You should now see KanHub loaded as an extension on the top right bar of your chrome, click on it and then select 'Authenticate with GitHub'

#### Installing from the build file
1. Download the build.crx file [found in the latest-build folder](./latest-build)
2. Open Google Chrome browser, go to your extensions manager (Settings -> More tools -> Extensions) and drag and drop this file into the window
3. Add the extension by clicking "Add extension"
4. Authenticate by clicking on the icon in the top right bar of chrome and selecting 'Authenticate with GitHub'
5. If you add the extension this way, Chrome may disable the extension next time you restart. Just go back the the extensions manager and re-enable it. If you cannot re-enable it, you will have to delete the extension and add it back from step 2 above.

## KanHub Tutorial
- Once authenticated, you can now navigate to any repository, and each repository will have an additional 2 tabs: Team and Standup
- In the team tab you'll have the option to create a team and assign a specific label to the team. Doing so will immediately tell you all of the closed & issues that your team has and visualizes it as a graph. In addition you'll be able to see the members in your team as well as an archive of past standups.
- Via the standup tab, Members of the same team can start an online standup session that allows developers to do their standup meetings without having to open up a 3rd party app. It features a real-time card for the current user that's presenting as well as a real-time chat that enables your team to reference issues (i.e. #1, #2) or refer a person using (i.e. @omfgitsjack). The standup tab is also designed to be fault tolerant so that late users can join a startup and current users (even the presenter) can disconnect & reconnect.

## Some additional details
- Secure: Our server (kanhub.me)[https://kanhub.me:8080] is deployed on DigitalOcean, uses SSL and a custom domain name. We allow github authentication and provide session cookies after authenticating. Our websocket traffic is secured through the use of JWT & SSL as well. 
- Easily Deployed: Through the use of docker, we have 3 separate containers for the nodejs-express server, postgres database and redis database. In fact, we simply need to `docker-compose build && docker-compose up` to deploy our services.
- Fault Tolerant Real-time standups: We use redis to cache our standup session's state and periodically write to disk, so even if our app-server goes down we can recover without losing any state.

## Beta Version Key Features
- Installing the extension
- Github authentication
- Single room real-time chat
- Team tab where developers can create different teams within the repo
- Backend for team/standup features

## Final Version Key Features:
- [x] Frontend for team/standup features
- [x] Multi-room chat
- [x] Standup Archive
- [x] Team issue tagging/overview

## Technology Used
- ReactJS
- NodeJS
- Express
- Postgres
- Websockets
- Docker
- Socket.io

## Key Challenges
- [x] Learn how to create a chrome extension (https://developer.chrome.com/extensions/content_scripts)
- [x] Learn how OAuth w/ Github works
- [x] Learn React
- [ ] Learn Redux
- [x] Learn Postgres
- [x] Deploying entire app & db in different docker containers
- [x] Securely send XHR requests that are cross origin
- [x] Securely store and access cookies while respecting SameSite policies.
- [x] Learn websockets & see if there's a need for RabbitMQ
- [x] Learn how to use Github’s API
- [ ] Figure out how to use webhooks
