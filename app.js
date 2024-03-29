const _ = require('lodash');
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const cors = require('cors')

var port = process.env.PORT || 3000;
var favicon = require('serve-favicon')
var path = require('path')

var TODOS = [
    { 'id': 1, 'user_id': 1, 'name': "Get Milk", 'completed': false },
    { 'id': 2, 'user_id': 1, 'name': "Fetch Kids", 'completed': true },
    { 'id': 3, 'user_id': 2, 'name': "Buy flowers for wife", 'completed': false },
    { 'id': 4, 'user_id': 3, 'name': "Finish Angular JWT", 'completed': false },
    { 'id': 4, 'user_id': 4, 'name': "Finish Angular JWT Todo App", 'completed': false },
];
var USERS = [
    { 'id': 1, 'username': 'jemma@email.com' },
    { 'id': 2, 'username': 'paul@email.com' },
    { 'id': 3, 'username': 'sebastian@email.com' },
    { 'id': 4, 'username': 'leo@email.com' },
];
function getTodos(userID) {
    var todos = _.filter(TODOS, ['user_id', userID]);

    return todos;
}
function getTodo(todoID) {
    var todo = _.find(TODOS, function (todo) { return todo.id == todoID; })

    return todo;
}
function getUsers() {
    return USERS;
}

app.use(cors());
app.use(bodyParser.json());
app.use(expressJwt({secret: 'todo-app-super-shared-secret'}).unless({path: ['/api/auth']}));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.get('/', function (req, res) {
    res.send('Angular JWT Todo API Server')
});

app.get('/api/todos', function (req, res) {
    res.type("json");
    res.send(getTodos(req.user.userID));
});
app.get('/api/todos/:id', function (req, res) {
    var todoID = req.params.id;
    res.type("json");
    res.send(getTodo(todoID));
});
app.get('/api/users', function (req, res) {
    res.type("json");
    res.send(getUsers());
});

app.post('/api/auth', function(req, res) {
  const body = req.body;

  const user = USERS.find(user => user.username == body.username);
  if(!user || body.password != '12345678') return res.sendStatus(401);
  
  var token = jwt.sign({userID: user.id}, 'todo-app-super-shared-secret', {expiresIn: '2h'});
  res.send({token});
});

app.listen(port, function () {
    console.log('Angular JWT Todo API Server listening on port: ' + port)
});