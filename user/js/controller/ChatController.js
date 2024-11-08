app.controller("ChatController", [
  "$scope",
  "$http",
  function ($scope, $http) {
    $scope.friends = [];
    $scope.messages = [];
    $scope.currentChatUser = "";
    $scope.newMessage = "";
    $scope.socket = null;

    // Function to retrieve the username from cookies
    function getUsernameFromCookie() {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; username=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    }
    function initWebSocket() {
      const username = getUsernameFromCookie();
      $scope.socket = new WebSocket(
        `ws://localhost:8080/chat?username=${username}`
      );

      // Handle incoming messages
      $scope.socket.onmessage = function (event) {
        const message = JSON.parse(event.data);
        $scope.$apply(function () {
          $scope.messages.push(message);
        });
      };

      // Log connection status
      $scope.socket.onopen = function () {
        console.log("WebSocket connection established.");
      };

      $scope.socket.onclose = function () {
        console.log("WebSocket connection closed.");
      };

      $scope.socket.onerror = function (error) {
        console.error("WebSocket error:", error);
      };
    }

    // Load messages between the current user and the selected friend
    $scope.loadMessages = function (friendUsername) {
      $scope.currentChatUser = friendUsername;
      const username = getUsernameFromCookie();
      $http
        .get(
          `http://localhost:8080/api/chat/messages?user1=${username}&user2=${friendUsername}`
        )
        .then(
          function (response) {
            $scope.messages = response.data; // Load existing messages
          },
          function (error) {
            console.error("Error loading messages:", error);
          }
        );
    };

    // Send a message
    $scope.sendMessage = function () {
      if ($scope.newMessage && $scope.currentChatUser) {
        const chatMessage = {
          sender: getUsernameFromCookie(),
          receiver: $scope.currentChatUser,
          content: $scope.newMessage,
          timestamp: new Date().toLocaleTimeString(),
        };

        // Send message through WebSocket
        $scope.socket.send(JSON.stringify(chatMessage));

        // Display the sent message locally
        $scope.messages.push({
          sender: chatMessage.sender,
          content: chatMessage.content,
          timestamp: chatMessage.timestamp,
          senderAvatar: "images/resources/user2.jpg", // Adjust as necessary
        });

        $scope.newMessage = ""; // Clear input
      }
    };

    // Load friends and initialize WebSocket connection on controller init
    $scope.loadFriends = function () {
      const username = getUsernameFromCookie();
      $http.get(`http://localhost:8080/api/chat/list/${username}`).then(
        function (response) {
          $scope.friends = response.data; // Load friends list
        },
        function (error) {
          console.error("Error loading friends:", error);
        }
      );
    };

    // Initial load of friends and WebSocket setup
    $scope.loadFriends();
    initWebSocket();
  },
]);
