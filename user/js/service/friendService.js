app.service('FriendService', function($http, API) {
    // phuong thuc lay danh sach ban be
    this.getFriendsByUsername = function(username) {
        return $http.get(API + "friendrequests/" + username) // Use the username passed as an argument
            .then(function(response) {
                return response.data; // Return the data from the response
            })
            .catch(function(error) {
                console.error("Error fetching friends:", error);
                throw error; // Propagate the error to the caller
            });
    };
    
    //phuong thuc xóa 
    this.deleteFriend = function(id) {
        return $http.delete(API + "friendrequests/" + id) // Use the ID directly in the URL
            .then(function(response) {
                return response; // Return the response from the server
            })
            .catch(function(error) {
                console.error("Error deleting friend request:", error);
                throw error; // Propagate the error to the caller
            });
    };
    
   //lay bạn chung
//    this.getMutualFriends = function(username1, username2) {
//     return $http.get('/api/friends/mutual/' + username1 + '/' + username2)
//         .then(function(response) {
//             return response.data; // Return the data from the response
//         })
//         .catch(function(error) {
//             console.error('Error fetching mutual friends:', error);
//             throw error; // Rethrow the error for further handling
//         });
//     };

    //thêm bạn
    this.addFriend = function(username1, username2) {
        return $http({
            method: 'POST',
            url: 'http://localhost:8080/api/friendrequests/add',
            params: {
                username1: username1,
                username2: username2
            }
        });
    };

    //lấy danh sách followẻ
    this.getFollowers = function(username) {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/api/friendrequests/followers', // Correct endpoint
            params: { username: username } // Pass the username as a query parameter
        })
        .then(function(response) {
            return response.data; // Return the list of followers
        })
        .catch(function(error) {
            console.error('Error fetching followers:', error);
            throw error; // Propagate the error to the caller
        });
    };
});