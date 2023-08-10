### checklists for monday.com

This is a proof of concept for a checklist app for monday.com. It is a work in progress. It is a demonstration of a working technology stack for building monday.com apps.
Functionality is inspired by this Jira app: https://marketplace.atlassian.com/apps/1213231/issue-checklist-for-jira-pro?hosting=cloud&tab=overview
### Technology Stack
- Typescript
- Firebase & Cloud Functions 2gen only (no other GCP services!, 100% deployable via firebase cli)
- React 16 (meh, peer deps of mondays vibe components don't like newer versions right now)
- trpc (https://trpc.io) for backend and derived client frontend
- react-query
- superjson
- form validation via react-hook-form
- generated graphql client for mondays api

#### TODOS
##### Infrastructure
- handle session token expiration
- generate graphql client
- handle uninstallation for oauth tokens
- @ mentions
##### App
- basic template functionality
- auto creation for checklists
- save as templates
- checklist change log
- embedding of values to item column