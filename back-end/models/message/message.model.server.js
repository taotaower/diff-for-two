var mongoose = require('mongoose');
var messageSchema = require('./message.schema.server');
var messageModel = mongoose.model('MessageModel', messageSchema);
var userModel = require('../user/user.model.server');

messageModel.findMessagesBetweenTwoUsers = findMessagesBetweenTwoUsers;
messageModel.findMessageById = findMessageById;
messageModel.createMessage = createMessage;
messageModel.updateMessage = updateMessage;
messageModel.deleteMessage = deleteMessage;


module.exports = messageModel;

function findMessagesBetweenTwoUsers(username1, username2) {
    return messageModel
        .find({ $or : [   { $and : [  { "from" : username1 }, { "to" : username2 } ] } ,  { $and : [  { "to" : username1 }, { "from" : username2 } ] }  ] }  )
        .sort( { date : -1 })
        .exec(function(err, docs) { return docs; });
}

function findMessageById(messageId) {
    return messageModel.findById(messageId);
}

function createMessage(message) {
    username1 = message.from;
    username2 = message.to;
    return messageModel.create(message)
        .then(function (message) {
            userModel.addMessage(username1, message._id);
            userModel.addMessage(username2, message._id);
            return message;
        });
}

function updateMessage(messageId, newMessage) {
    return messageModel.update({_id: messageId}, {$set: newMessage});
}

function deleteMessage(messageId) {
    return messageModel
        .remove({_id: messageId})
        .then(function () {
            return userModel.deleteMessage(messageId);
        });
}