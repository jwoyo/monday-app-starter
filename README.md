# Monday.com App Development Starter 

This repository offers a comprehensive technology stack to build monday.com apps. 💼
It implements a simple checklist application that can be used as a starting point for your own monday.com app. 🚀

## Features 📊

- **Technology Stack:** Built on **[TypeScript](https://www.typescriptlang.org/)**, **[Firebase & Cloud Functions (2nd gen)](https://firebase.google.com/)**, and **[React](https://reactjs.org/)**, aligned with the [Monday Vibe Components](https://style.monday.com/?path=/docs/media-icon--icons-list).
- **Mono Repository:** Backend and client live in one repository, managed by **[pnpm](https://github.com/pnpm/pnpm)** workspaces and **[Turborepo](https://turbo.build/repo)**. 🚀
- **Communication Layer:** Utilizes **[trpc](https://github.com/trpc/trpc)** for typesafe backend and client communication.
- **Data Management:** Data fetching and management with **[react-query](https://github.com/tannerlinsley/react-query)**.
- **User-friendly Forms:** Employs **[react-hook-form](https://github.com/react-hook-form/react-hook-form)** for form validation.
- **Immutability Made Easy:** Simplify data transformations and DTO operations using **[immer](https://github.com/immerjs/immer)**.
- **Stylish UI:** Combine Monday Vibe Components with **[antd](https://github.com/ant-design/ant-design)** for a polished UI.
- **Dark Mode:** Supports all 4 monday themes.
- **i18n:** Comes with a ready to use solution for internationalization that matches the monday users language using **[react-i18next](https://react.i18next.com/)**.
- **CSS at build time**: State-of-the-art stylesheets that do not impact runtime performance with **[vanilla-extract](https://vanilla-extract.style/)**.
- **GraphQL Power:** Leverage a generated GraphQL client to enable **typesafe access** to the Monday GraphQL gateway. In client and on the server! 🔒

## Authentication and Events Handling 🔐

- **OAuth 2.0 Authentication:** Seamlessly integrate your Monday apps with secure authorization using OAuth 2.0 authentication.
- **Webtrigger Events:** Effortlessly handle event authentication for webtrigger events, ensuring a seamless and secure user experience.

## Getting Started 🏁

(TODO)

## Known issues 🐛

- We are using React 18. But mondays vibe components and its peer dependencies complain about this version. So we have to live with respective warnings for now and be careful when using those components:
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

