app.service("ChatService", function ($http, API) {
  this.getFriends = function (username) {
    let url = `${API}friendrequests/${username}`;
    return $http.get(url);
  };
  this.getMessages = function (user1, user2) {
    let url = `${API}user/chat/messages?user1=${user1}&user2=${user2}`;
    return $http.get(url);
  };
});
