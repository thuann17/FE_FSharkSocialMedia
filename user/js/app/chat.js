var app = angular.module('chatApp', []);

        app.controller('ChatController', function($scope, $http) {
            var stompClient = null;
            $scope.messages = [];
            $scope.message = {};

            function connect() {
                var socket = new SockJS('/ws');
                stompClient = Stomp.over(socket);
                
                stompClient.connect({}, function(frame) {
                    stompClient.subscribe('/topic/public', function(chatMessage) {
                        $scope.$apply(function() {
                            $scope.messages.push(JSON.parse(chatMessage.body));
                        });
                    });
                });
            }

            $scope.sendMessage = function() {
                if (stompClient && $scope.message.content) {
                    var chatMessage = {
                        sender: 'User', // Replace with dynamic username if needed
                        content: $scope.message.content
                    };
                    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
                    $scope.message.content = '';
                }
            };

            // Load messages from server
            $http.get('/messages').then(function(response) {
                $scope.messages = response.data;
            });

            connect();
        });