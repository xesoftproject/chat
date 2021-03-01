# what is it?
chat and maybe fe server

# socket.io chat
Node.JS client/server application based on [Express.js](http://expressjs.com/), [Socket.IO 1.x](http://socket.io/) and [socket.io-redis](https://github.com/socketio/socket.io-redis).

# TO RUN:
- in _root/app/public/javascripts/index.js: valorize the jwt (L:8) with a valid jwt (use Dario login package)
  
create a nodejs launch configuration:
- pointing to js file: _root\app\app.js
- define a CONFIG_URL env variable valued with the path of your local file config.yml
- define and ACCESS_KEY_ID env variable valued with the dynamo ACCESS_KEY_ID
- define a SECRET_ACCESS_KEY env variable valued with the dynamo SECRET_ACCESS_KEY
 
run the nodejs launcher   
OR  
execute this command in terminal (nodejs required):  
`npm install;CONFIG_URL=config.yml ACCESS_KEY_ID=.... SECRET_ACCESS_KEY=.... node _root/app/app.js`

then open your browser here: http://localhost:3000/
or if you deployed in cloud http://www.xesoft.ml:3000/