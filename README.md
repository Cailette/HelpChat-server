# HelpChat Server
HelpChat-server is the server engine of HelpChat. Written in <b>Node.js</b> and <b>Express.js</b>. <b>Socket.io</b> and <b>MongoDB</b> database were used in the project. 

- <a href="https://github.com/nodejs">Node.js</a>
- <a href="https://github.com/expressjs/express">Express.js</a>
- <a href="https://github.com/socketio/socket.io">Socket.io</a>
- <a href="https://github.com/mongodb/mongo">MongoDB</a>
### Other:
- <a href="https://github.com/dcodeIO/bcrypt.js">Bcryptjs</a>
- <a href="https://github.com/hapijs/joi">Joi</a>
- <a href="https://github.com/auth0/node-jsonwebtoken">Jsonwebtoken</a>
- <a href="https://github.com/Automattic/mongoose">Mongoose</a>
- <a href="https://github.com/moment/moment">Moment</a>
- <a href="https://github.com/mogaal/sendemail">Sendmail</a>

Local install
-- 
1. `mkdir <folder_name>`
2. `cd <folder_name>`
3. `git clone https://github.com/Cailette/HelpChat-server.git` .
4. `npm install`
5. `npm start` OR `npm run nodemon`
6. then load http://localhost:3000/ in your browser to access the app

Debug
--
- <a href="https://npmjs.org/package/nodemon">nodemon</a>
- `npm -g install nodemon`
- `npm run nodemon`

Unit tests
--
- <a href="https://github.com/chaijs/chai">Chai</a>
- <a href="https://github.com/mochajs/mocha">Mocha</a>
- <a href="https://github.com/sinonjs/sinon">Sinon</a>
- `npm install mocha`
- `npm run test`

Configuration
--
Configure server by creating a `.env` file with variables:
```
DB_USER=<Your database username>
DB_PASS=<Your database password>
DB_CLUSTER=<Your cluster name>
SECRET_KEY=<Your secret key>
```

