# what is it?
chat and maybe fe server

# socket.io chat
Node.JS client/server application based on [Express.js](http://expressjs.com/), [Socket.IO 1.x](http://socket.io/) and [socket.io-redis](https://github.com/socketio/socket.io-redis).

# TO RUN:
locally? modify host file: 127.0.0.1 www.xesoft.ml

create a nodejs launch configuration:
- pointing to js file: _root\app\app.js
- define a CONFIG_URL env variable valued with the path of your local file config.yml
- define and ACCESS_KEY_ID env variable valued with the dynamo ACCESS_KEY_ID
- define a SECRET_ACCESS_KEY env variable valued with the dynamo SECRET_ACCESS_KEY
- define and COGNITO_ACCESS_KEY_ID env variable valued with the cognito ACCESS_KEY_ID
- define a COGNITO_SECRET_ACCESS_KEY env variable valued with the cognito SECRET_ACCESS_KEY
 
run the nodejs launcher   
OR  
execute this command in terminal (nodejs required):  
`npm install;CONFIG_URL=config.yml ACCESS_KEY_ID=.... SECRET_ACCESS_KEY=.... COGNITO_ACCESS_KEY_ID=.... COGNITO_SECRET_ACCESS_KEY=.... node _root/app/app.js`

then open your browser here: https://www.xesoft.ml:3001/login.html