var app = angular.module("myApp", ["ngRoute"]);
var API = "http://localhost:8080/api/";
app.controller('ChatController', function($scope, ChatService) {
    $scope.messages = [];
    $scope.conversations = [];
    
    $scope.sendMessage = function() {
        var messageModel = {
        };
        ChatService.sendMessage(messageModel).then(function(response) {
            $scope.messages.push(response.data);
        });
    };

    $scope.getMessages = function(conversationId) {
        ChatService.getMessagesByConversationId(conversationId).then(function(response) {
            $scope.messages = response.data;
        });
    };

    $scope.createConversation = function() {
        var conversationModel = {
        };
        ChatService.createConversation(conversationModel).then(function(response) {
            $scope.conversations.push(response.data);
        });
    };
});