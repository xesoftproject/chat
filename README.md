# what is it
Webserver + login, chat and audio rest services

# TO RUN:

## locally

modify host file: 127.0.0.1 www.xesoft.ml

retrieve a valid config.yml, put in the root of the project

create a nodejs launch configuration:
- pointing to js file: src\app.js
- define a CONFIG_URL env variable valued with the path of your local file config.yml
- define and ACCESS_KEY_ID env variable valued with the dynamo ACCESS_KEY_ID
- define a SECRET_ACCESS_KEY env variable valued with the dynamo SECRET_ACCESS_KEY
- define and COGNITO_ACCESS_KEY_ID env variable valued with the cognito ACCESS_KEY_ID
- define a COGNITO_SECRET_ACCESS_KEY env variable valued with the cognito SECRET_ACCESS_KEY
- define a MYPWD env variable
 
run the nodejs launcher   
OR  
execute this command in terminal (nodejs required):  
`npm install;CONFIG_URL=config.yml ACCESS_KEY_ID=.... SECRET_ACCESS_KEY=.... COGNITO_ACCESS_KEY_ID=.... COGNITO_SECRET_ACCESS_KEY=.... node _root/app/app.js`

then open your browser here: https://www.xesoft.ml/login.html 
