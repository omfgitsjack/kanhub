#KanHub

##Team Members
- Jack Yiu
- Kenny Lam

##Description
Our project will be to create a chrome extension that would “inject” code and UI elements onto the existing Github repo interface that will help developers to organize their internal team structure by allowing users to create their own groups within the repo. We will also create a "Standup" feature that will allow developers to do their daily standup meetings right within GitHub without relying on other applications such as slack. We will also include a real-time chat feature that allows collaborators to quickly discuss what they are working on at the moment so that they will always be on the same page. The role of the real-time chat is similar to how each issue has a conversation thread. We are hoping this extension would create a seamless experience for current developers to help organize their team.

##Beta Version Key Features
- Installing the extension
- Github authentication
- Single room real-time chat
- Team tab where developers can create different teams within the repo
- Backend for team/standup features

##Final Version Key Features:
- Frontend for team/standup features
- Multi-room chat

##Technology Used
- ReactJS
- React-Redux
- NodeJS
- Express
- Postgres
- Websockets
- Docker
- RabbitMQ

##Key Challenges
- [x] Learn how to create a chrome extension (https://developer.chrome.com/extensions/content_scripts)
- [x] Learn how OAuth w/ Github works
- [x] Learn React
- [ ] Learn Redux
- [x] Learn Postgres
- [x] Deploying entire app & db in different docker containers
- [x] Securely send XHR requests that are cross origin
- [x] Securely store and access cookies while respecting SameSite policies.
- [ ] Learn websockets & see if there's a need for RabbitMQ
- [ ] Learn how to use Github’s API
- [ ] Figure out how to use webhooks
