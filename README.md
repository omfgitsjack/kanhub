#Bankan

##Team Members
- Jack Yiu
- Kenny Lam

##Description
With their recent launch of “project boards”, Github can now be used as a tool to manage and organize a project’s workflow. Tasks and issues are represented by cards that are separated into different columns (usually a “todo” and “done” column). This is akin to other organizational tools such as Trello. 

However, the project board feature is still very primitive and lacks many features that would help streamline this workflow. For example, when opening and closing an issue, the developer will still have to manually reflect these changes on their project board by creating a new card and adding the details there or by deleting the card when the issue is closed. There is currently no way to automate this process.

Our project will be to create a chrome extension that would “inject” code and UI elements onto the existing Github project board that will help it sync with the project’s issues. We will allow developers to create “rulesets” that would be used to determine which issues are synced to which column. We will also include a real-time chat feature that allows collaborators to quickly discuss what they are working on at the moment so that they will always be on the same page. We are hoping this extension would create a seamless experience for current developers to help manage their issues.

##Beta Version Key Features
- Installing the extension
- Github authentication
- Syncing Github issues with its project board (opening/closing issue moves it to open/closed column of the project board)
- Single room real-time chat
- Simple notifications when a change is made (open/close issue, new message in chat, etc…)

##Final Version Key Features:
- Create “rules” for project board columns that will listen for issue changes to automatically update board
- Multi-room chat
- Create issue from chat
- Ability to subscribe/unsubscribe to notifications from issue boards/chat rooms

##Technology Used
- ReactJS
- React-Redux
- NodeJS
- Express
- Postgres
- Websockets

##Key Challenges
- Learn how to create a chrome extension (https://developer.chrome.com/extensions/content_scripts)
- Learn how OAuth w/ Github works
- Learn React + Redux
- Learn Postgres
- Learn how to use Github’s API
- Figure out how to use webhooks so that we could listen for changes in the issues tab to sync with the project board
