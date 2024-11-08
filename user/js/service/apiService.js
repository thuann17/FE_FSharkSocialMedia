app.service("ApiService", function ($http, API) {
  // lấy danh sách bạn bè
  this.getFriends = function (username) {
    return $http
      .get(`${API}chat/list/${username}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching friends:", error);
        throw error;
      });
  };
  this.getMessages = function (sender, recipient) {
    return $http
      .get(`${API}chat/messages?user1=${sender}&user2=${recipient}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching messages:", error);
        throw error;
      });
  };
});
