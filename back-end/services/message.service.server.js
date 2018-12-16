var app = require('../../express');
var messageModel = require('../models/message/message.model.server');


app.get    ('/api/lufthansa/message', findMessagesBetweenTwoUsers);
app.get    ('/api/lufthansa/message/:messageId', findMessageById);
app.post   ('/api/lufthansa/message', createMessage);
app.put    ('/api/lufthansa/message/:messageId',updateMessage);
app.delete ('/api/lufthansa/message/:messageId', deleteMessage);


function findMessagesBetweenTwoUsers(req, res) {
    username1 = req.query.username1;
    username2 = req.query.username2;
    messageModel
        .findMessagesBetweenTwoUsers(username1, username2)
        .then(function (messages) {
            res.json(messages);
        })
}

// all parameters send to req
function findMessageById (req, res) {
    messageId = req.params['messageId'];

    messageModel
        .findMessageById (messageId)
        .then(function (message) {
            res.json(message);
        }, function (err) {
            res.send(err);
        });
}

function createMessage (req, res) {
    var message = req.body;
    messageModel
        .createMessage (message)
        .then(function (message) {
            res.json(message);
        }, function (err) {
            res.send(err);
        });
}

function updateMessage (req, res) {
    var newMessage = req.body;
    var messageId = req.params.messageId;

    messageModel
        .updateMessage (messageId, newMessage)
        .then(function () {
            res.sendStatus(200);
        }, function (err) {
            res.send(err);
        });
}

function deleteMessage (req, res) {
    var messageId = req.params.messageId;

    messageModel
        .deleteMessage(messageId)
        .then(function () {
            res.sendStatus(200);
        }, function (err) {
            res.send(err);
        });
}