app.service("UserService", function($http, API) {
    // Method to get user information based on username
    this.getUserByUsername = function(username) {
        return $http.get(`${API}about/${username}`)
            .then(function(response) {
                return response.data; // Return user data
            })
            .catch(function(error) {
                console.error("Error fetching user:", error);
                throw error; // Propagate error to the caller
            });
    };
    
    this.getUsersWithoutFriends = function(username) {
        return $http.get(`${API}friendrequests/without-friends/${username}`)
            .then(function(response) {
                return response.data; // Return the array of users
            })
            .catch(function(error) {
                console.error("Error fetching users without friends:", error);
                throw error; // Propagate error to the caller
            });
    };
    

});
