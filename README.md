# Beatdrops
![CD](https://github.com/matthewhung09/beatdrops/actions/workflows/node.js.yml/badge.svg)

An web-based application where you can anonymously share music!

by Matthew Hung, Adelle Vo, Griffin Scotti, Naomi Donato

## Environment Setup

### Frontend (https://beatdrops.herokuapp.com)

Create a `.env` file with the following variables.
```
REACT_APP_CLIENT_ID='YOUR_CLIENT_ID'
REACT_APP_URL=http://localhost:5000
REACT_APP_REDIRECT=http://localhost:3000
```
Run these commands in the frontend folder to install dependencies and start the server
```
npm install
npm run dev
```

### Backend (https://beatdrops-api.herokuapp.com)

Create a `.env` file with the following variables.
```
CLIENT_ID='YOUR_CLIENT_ID'
CLIENT_SECRET='YOUR_CLIENT_SECRET
CONNECTION_URL='YOUR_CONNECTION_URL'
JWT_SECRET='YOUR_JWT_SECRET'
FRONTEND_URL=http://localhost:3000
EMAIL_SERVICE=Gmail
EMAIL_USER='YOUR_EMAIL'
EMAIL_PASS='YOUR_PASS'
GOOGLE_CLIENT_ID='YOUR_CLIENT_ID'
GOOGLE_CLIENT_SECRET='YOUR_CLIENT_SECRET'
GOOGLE_REDIRECT_URL='YOUR_REDIRECT_URL'
GOOGLE_REFRESH_TOKEN='YOUR_REFRESH_TOKEN'
```
Run these commands in the backend folder to install dependencies and start the server
```
npm install
npm run dev
```

## Testing
### Running Tests
To run unit tests in the backend:
```
npm test
```
To run API and E2E tests:
```
./node_modules/.bin/cypress open
```
Then click on the testing file in the opened cypress window.
### Code Coverage

![alt text](https://github.com/matthewhung09/beatdrops/blob/main/images/coverage_report.PNG)

## Style Checker

Prettier: Style checker that auto-formats your code and allows you to toggle specific formatting rules. Command-line interface and IDE plugins available.

Configuring "Format on Save" in Visual Studio Code:

1. File
2. Preferences
3. Settings
4. Search for "Format On Save" and check the box.

To format all files, run

`npx prettier --write . `

## External Project Docs

Storyboard: https://www.figma.com/file/rHUc0rkb2ESU2wNWrxs2Vy/Team-F---308?node-id=0%3A1 \
Product Spec: https://docs.google.com/document/d/1jwzeS3_eT3y_dK8E0HfiQFx5vckhO2nUL89Dgi97kEg/edit?usp=sharing
