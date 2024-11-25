app.controller("chatCtrl", function ($scope, $cookies, ChatService) {
  // Khai báo các biến
  $scope.friends = [];
  $scope.messages = [];
  $scope.selectedFriend = null;
  $scope.newMessage = "";
  $scope.username = "";
  $scope.connected = false;
  $scope.connecting = false;
  $scope.messageContent = "";
  $scope.errorMessage = "";

  let stompClient = null;

  // Lấy tên người dùng hiện tại từ cookie
  const currentUsername = $cookies.get("username");
  if (!currentUsername) {
    console.error("Username not found in cookies.");
    return;
  }
  $scope.currentUser = currentUsername;

  // Lấy danh sách bạn bè của người dùng
  $scope.fetchFriends = function (username) {
    ChatService.getFriends(username)
      .then(function (response) {
        $scope.friends = response.data;
        console.log("Friend List: ", $scope.friends);
      })
      .catch(function (error) {
        console.error("Error fetching friends:", error);
      });
  };

  // Chọn bạn bè để bắt đầu trò chuyện
  $scope.selectFriend = function (friend) {
    if (!friend || !currentUsername) {
      console.warn("Invalid usernames:", currentUsername, friend);
      return;
    }

    // Cập nhật người nhận tin nhắn
    $scope.selectedFriend = friend;
    // Lấy tin nhắn giữa người dùng hiện tại và bạn bè được chọn
    ChatService.getMessages(currentUsername, friend.friendName)
      .then(function (response) {
        if (response.data && !response.data.error) {
          $scope.messages = response.data;
        } else {
          console.error("Failed to fetch messages:", response.data.error);
          $scope.errorMessage =
            "Failed to fetch messages. Please try again later.";
        }
      })
      .catch(function (error) {
        console.error("Error fetching messages:", error);
      });
  };

  // Kết nối WebSocket
  $scope.connect = function () {
    if ($scope.currentUser.trim()) {
      $scope.connecting = true;
      var socket = new SockJS("http://localhost:8080/ws");
      stompClient = Stomp.over(socket);

      stompClient.connect({}, onConnected, onError);
    }
  };

  // Xử lý khi kết nối WebSocket thành công
  function onConnected() {
    stompClient.subscribe("/topic/public", onMessageReceived);
    stompClient.send(
      "/app/chat.addUser",
      {},
      JSON.stringify({ sender: $scope.username, type: "JOIN" })
    );

    $scope.connecting = false;
    $scope.connected = true;
    $scope.$apply();
  }

  // Xử lý khi kết nối WebSocket thất bại
  function onError(error) {
    $scope.connecting = false;
    $scope.$apply();
    console.log(
      "Could not connect to WebSocket server. Please refresh the page and try again!" +
        error
    );
  }

  // Gửi tin nhắn
  $scope.sendMessage = function () {
    if ($scope.newMessage.trim()) {
      var chatMessage = {
        sender: $scope.currentUser,
        content: $scope.newMessage,
        receiver: $scope.selectedFriend ? $scope.selectedFriend.friendName : "",
        type: "CHAT",
      };

      stompClient.send(
        "/app/chat.sendMessage",
        {},
        JSON.stringify(chatMessage)
      );
      $scope.newMessage = ""; // Xóa ô nhập sau khi gửi
    }
  };

  // Xử lý tin nhắn nhận được
  function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    // if (message.type === "JOIN") {
    //   message.content = message.sender + " joined!";
    // } else if (message.type === "LEAVE") {
    //   message.content = message.sender + " left!";
    // }

    $scope.messages.push(message);
    $scope.$apply();
  }

  // Lấy danh sách bạn bè khi controller được tải
  $scope.fetchFriends(currentUsername);

  // Kết nối WebSocket nếu username hợp lệ
  if ($scope.currentUser) {
    $scope.connect();
  } else {
    console.warn("No username found in cookies.");
  }
});
