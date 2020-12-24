# what is it?
chat and maybe fe server

# socket.io chat
Node.JS client/server application based on [Express.js](http://expressjs.com/), [Socket.IO 1.x](http://socket.io/) and [socket.io-redis](https://github.com/socketio/socket.io-redis).

#TO RUN:
check on config.yml that vcChatDebugging is set to true

create a nodejs launch configuration:
- pointing to js file: _root\app\app.js
- define a CONFIG_URL env variable valued with the path of your local file config.yml

run the nodejs launcher

then open your browser here: http://localhost:3000/