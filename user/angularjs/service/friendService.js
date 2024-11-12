app.service("FriendService", function ($http, API) {
    // Lấy tài khoản theo username
    this.getFriends = function(username) {
       // API URL with the username
       let url = `${API}friendrequests/${username}`;  // Use backticks for string interpolation

       return $http.get(url);  // Return the HTTP GET request promise
   };


   //goi y ket ban
   this.getUsersWithoutFriends = function(username) {
    // URL to the backend API
    let url = `${API}friendrequests/without-friends/${username}`;
    
    // Make the GET request and return the promise
    return $http.get(url);
  };


  //LAY danh sach follower
  this.getFollowers = function(username) {
    // URL to backend API
    let url = `${API}friendrequests/followers?username=${username}`;
    
    // Make the GET request to fetch followers and return the promise
    return $http.get(url);
  };

   //xóa bạn 
   // Phương thức xóa bạn
    this.deleteFriend = function(id) {
        let url = `${API}friendrequests/${id}`; // Sử dụng ID trong URL
        
        return $http.delete(url); // Gọi API với phương thức DELETE
    };

    //chấp nhận yêu cầu kết bạn
    this.updateFriendStatus = function(friendId) {
      var url = `${API}friendrequests/${friendId}/update-status`;
      console.log("Sending PUT request to:", url);
      return $http.put(url);
  };

  //gui yeu cầu kết bạn
  this.addFriend = function(username1, username2) {
    var url = `${API}friendrequests/add/${username1}/${username2}`;
    
    return $http.post(url)
        .then(function(response) {
            return response.data;  // Return success message from backend
        })
        .catch(function(error) {
            // Handle errors (e.g., duplicate friend request, invalid usernames)
            console.error('Error adding friend:', error);
            throw error;  // Pass the error to the controller
        });
};

 });
 