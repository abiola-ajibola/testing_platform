# Setup

## Requirements
- Database management system is PostgreSQL
- Node v22 and above

## To run the project in development

- Install all dependencies, in the root directory run;

        yarn install:all

- To start the app in development, in the root directory, run:

        yarn dev

- and then run the following in another terminal window

        cd backend
        yarn dev

## To run the project in production

- From the root directory, run:

        yarn install:all && yarn build:noCheck && yarn prisma generate && yarn start


