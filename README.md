# Setup

## Requirements
- To run sqlite, you need to have Python 3 insatlled
- Node v22 and above

## To run the project in development

- In the root directory, run:

        yarn dev

- Then run the following in another terminal window

        cd backend
        yarn 

## To run the project in production

- From the root directory, run:

        yarn install:all && yarn build:noCheck && yarn prisma generate && yarn start


