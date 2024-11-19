app.service("ChatService", function ($http, API) {
    this.getFriends = function(username) {
        let url = `${API}friendrequests/${username}`;  // Use backticks for string interpolation
        return $http.get(url);  // Return the HTTP GET request promise
    };
})
app.controller("chatCtrl", function ($scope, $http) {
 
});
