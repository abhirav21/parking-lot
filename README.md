# parking-lot

a [Sails v1](https://sailsjs.com) application

# Steps to run
1. npm i
2. run script `database/migrations/202009281800_initialize_db.sql` on mysql commandline (only for creating db) 
3. change database credentials in 'config/datastores.js' (username, password, dbname). 
3. run command `sails lift alter` - to create database structure and start the project
4. on prompt press 1.
5. provided postman colllection (parkinglot.postman_collection.json)
6. import postman collection to postman
7. start with POST /parkinglot api for creating a parkinglot

    