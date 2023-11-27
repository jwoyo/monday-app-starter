# Monday.com App Development Starter

This repository offers a comprehensive technology stack to build monday.com apps. 💼
It implements a simple checklist application that can be used as a starting point for your own monday.com app. 🚀

## Features 📊

- **Technology Stack:** Built on **[TypeScript](https://www.typescriptlang.org/)**, *
  *[Firebase & Cloud Functions (2nd gen)](https://firebase.google.com/)**, and **[React](https://reactjs.org/)**,
  aligned with the [Monday Vibe Components](https://style.monday.com/?path=/docs/media-icon--icons-list).
- **Mono Repository:** Backend and client live in one repository, managed by **[pnpm](https://github.com/pnpm/pnpm)**
  workspaces and **[Turborepo](https://turbo.build/repo)**. 🚀
- **Communication Layer:** Utilizes **[trpc](https://github.com/trpc/trpc)** for typesafe backend and client
  communication.
- **Data Management:** Data fetching and management with **[react-query](https://github.com/tannerlinsley/react-query)
  **.
- **User-friendly Forms:** Employs **[react-hook-form](https://github.com/react-hook-form/react-hook-form)** for form
  validation.
- **Immutability Made Easy:** Simplify data transformations and DTO operations using *
  *[immer](https://github.com/immerjs/immer)**.
- **Stylish UI:** Combine Monday Vibe Components with **[antd](https://github.com/ant-design/ant-design)** for a
  polished UI.
- **Dark Mode:** Supports all 4 monday themes.
- **i18n:** Comes with a ready to use solution for internationalization that matches the monday users language using *
  *[react-i18next](https://react.i18next.com/)**.
- **CSS at build time**: State-of-the-art stylesheets that do not impact runtime performance with *
  *[vanilla-extract](https://vanilla-extract.style/)**.
- **GraphQL Power:** Leverage a generated GraphQL client to enable **typesafe access** to the Monday GraphQL gateway. In
  client and on the server! 🔒

## Authentication and Events Handling 🔐

- **OAuth 2.0 Authentication:** Seamlessly integrate your Monday apps with secure authorization using OAuth 2.0
  authentication.
- **Webtrigger Events:** Effortlessly handle event authentication for webtrigger events, ensuring a seamless and secure
  user experience.

## Getting Started 🏁

### Prerequisites

1. Clone this repository
1. Run `pnpm install` to install all dependencies
1. Make sure you have the [Firebase CLI](https://firebase.google.com/docs/cli) installed. ```firebase --version```
   should return a version number (last tested with 12.4.6).
1. Make sure that you are logged in to your firebase account via ```firebase login ```.
1. You should also have a Firebase project ready or create a new one. Which has Firestore, Firebase Hosting, Cloud Run,
   Cloud Build APIs enabled. See [here](https://firebase.google.com/docs/projects/learn-more) for more information.
1. Also have a monday.com app ready. See [here](https://developer.monday.com/apps/docs/manage) for more information.

### Setup infrastructure

1. Copy the .env.monday-app-checklist-prod file and name it .env.local.
1. Open .env.local and replace "monday-app-checklist-prod" with your GCP/Firebase project id (mind there are multiple
   occurrences).
1. Set MONDAY_APP_CLIENT_ID respectively to the value of your app which can be found in you monday developer view.
1. Open .firebaserc and replace "monday-app-checklist-prod" with your GCP/Firebase project id.
1. Run ```firebase use <your-project-id>``` to select your project.
1. Run ```firebase functions:secrets:set MONDAY_APP_SECRET``` and paste your monday app secret (can be found under "
   client secret" in you monday developer view).
1. Run ```firebase functions:secrets:set MONDAY_APP_SIGNING_SECRET``` and paste your monday app signing secret  (can be
   found under "signing secret" in you monday developer view).
1. Make sure you have Firestore enabled and set-up in your Firebase project.
1. Run ```firebase deploy``` to deploy the app to your firebase project, paste environment variables when asked.
1. You should see a success message for the deployment that looks like the following. Remember the Function URL.

```
✔  functions[checklist(us-central1)] Successful create operation.
Function URL (checklist(us-central1)): https://checklist-???-uc.a.run.app
i  functions: cleaning up build files...
i  hosting[monday-app-checklist-dev]: finalizing version...
✔  hosting[monday-app-checklist-dev]: version finalized
i  hosting[monday-app-checklist-dev]: releasing new version...
✔  hosting[monday-app-checklist-dev]: release complete
Running command: pnpm --filter functions run post-deploy

> functions@ post-deploy /Users/jwolf/Code/monday-playground/packages/functions
> node post-deploy.js

✔  functions: Finished running postdeploy script.

✔  Deploy complete!
```

### Setup monday.com app
Now the ugly part begins. You can neither clone nor import the app configuration from this repository as monday does not support that. 
Hence, we will configure the app in the monday Developer Center UI. As long there is no dedicated IaaS solution by monday we document that configuration in the monday.config.yml file you find in this repository. Install the app on your account afterward.

### Develop locally
- This set-up allows you to develop locally with the Firestore emulator by running ```npm run dev```. This will emulate Firestore and the Cloud Functions locally. Also, it ships the web client from your computer.
- To make the iFrames of your app actually display the content from your local machine your can redirect traffic by using:
```npx localhost-mapper http://localhost:5173 https://monday-app-checklist-[your-projects-suffic-here].web.app ```
- Your browser will probably complain about the https certificate and won't show the iFrames's content. You can start a Chrome instance with disabled security checks by running:
```/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --ignore-certificate-errors --ignore-urlfetcher-cert-requests &> /dev/null```
- Remember that this tricks only your local machine to connect to localhost. Features likes monday workflows involve direct calls from the monday backend to your app. To make such functionality work in the local dev setup you will need to change the URLs referenced in the modules in the monday Developer Center. This is something that obviously can not be done with the production environment as it would affect real users. 
## Known issues 🐛

- We are using React 18. But mondays vibe components and its peer dependencies complain about this version. So we have
  to live with respective warnings for now and be careful when using those components:

```
WARN with peer dependencies found
apps/web
├─┬ monday-ui-react-core 2.17.1
│ ├─┬ monday-ui-style 0.1.174
│ │ └─┬ postcss-scss 4.0.6
│ │   └── ✕ unmet peer postcss@^8.4.19: found 8.4.4 in monday-ui-style
│ ├─┬ react-dates 21.8.0
│ │ ├── ✕ unmet peer react@"^0.14 || ^15.5.4 || ^16.1.1": found 18.2.0
│ │ ├── ✕ unmet peer react-dom@"^0.14 || ^15.5.4 || ^16.1.1": found 18.2.0
│ │ └─┬ airbnb-prop-types 2.16.0
│ │   └── ✕ unmet peer react@"^0.14 || ^15.0.0 || ^16.0.0-alpha": found 18.2.0
│ ├─┬ react-select 3.2.0
│ │ ├── ✕ unmet peer react@"^16.8.0 || ^17.0.0": found 18.2.0
│ │ ├── ✕ unmet peer react-dom@"^16.8.0 || ^17.0.0": found 18.2.0
│ │ └─┬ react-input-autosize 3.0.0
│ │   └── ✕ unmet peer react@"^16.3.0 || ^17.0.0": found 18.2.0
│ └─┬ react-windowed-select 2.0.5
│   ├── ✕ unmet peer react@^16.8.0: found 18.2.0
│   ├── ✕ unmet peer react-dom@^16.8.0: found 18.2.0
│   ├─┬ react-select 3.1.0
│   │ ├── ✕ unmet peer react@^16.8.0: found 18.2.0
│   │ ├── ✕ unmet peer react-dom@^16.8.0: found 18.2.0
│   │ └─┬ react-input-autosize 2.2.2
│   │   └── ✕ unmet peer react@"^0.14.9 || ^15.3.0 || ^16.0.0-rc || ^16.0": found 18.2.0
│   └─┬ react-window 1.8.5
│     ├── ✕ unmet peer react@"^15.0.0 || ^16.0.0": found 18.2.0
│     └── ✕ unmet peer react-dom@"^15.0.0 || ^16.0.0": found 18.2.0
└─┬ react-with-direction 1.4.0
  ├── ✕ unmet peer react@"^0.14 || ^15 || ^16": found 18.2.0
  └── ✕ unmet peer react-dom@"^0.14 || ^15 || ^16": found 18.2.0
```

## Upcoming features 📈

- Getting started guide
- Handling of app uninstallation
- Test Set-up
- CI/CD Set-up

