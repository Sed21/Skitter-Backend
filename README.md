Repository to store backend part of application of Skitter.

Skitter is an online service that offers unlimited audiobooks to listen to.

Project's API is done!

To start up Backend part of Skitter app make sure you have completed following steps:

- Set up **Postgres** database server or docker container
- Set up environmental variables: 
    * SKITTER_HOST
    * SKITTER_PORT
    
    * JWT_SECRET
    * SAVE_PATH
    
    * POSTGRES_HOST
    * POSTGRES_SCHEMA_NAME
    * POSTGRES_USERNAME
    * POSTGRES_PASSWORD
    * POSTGRES_DATABASE
    * POSTGRES_PORT
    * START_WITH_RESET = optional parameter
    * POSTGRES_INIT_DOC
    
- Run `npm i` in project root to install dependencies
- Run `npm start` to start **Skitter API**
- Production ready builds can be generated using `npm run build` script
    
Have fun using our API!