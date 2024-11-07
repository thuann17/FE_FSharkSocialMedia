app.controller('friendCtrl', function($scope, FriendService, UserService ,$routeParams) {
    $scope.friends = [];
    $scope.user = null;
    $scope.username = $routeParams.username; // Lấy username từ URL
    $scope.username2 = ''; 
    const username1 = $routeParams.username;
    $scope.usersWithoutFriends = [];
    $scope.mutualFriendCount = 0;
    $scope.userTarget = '';  // Username of the user you want to add as a friend
    $scope.userSrc = $routeParams.username; 
    $scope.followers = []; 


    // Hàm để lấy thông tin người dùng
    $scope.fetchUser = function () {
        UserService.getUserByUsername($scope.username)
            .then(function (data) {
                $scope.user = data;
            })
            .catch(function (error) {
                console.error("Error fetching user:", error);
                $scope.user = null;
            });
    };

    //load thông tin bạn bè
    $scope.loadFriends = function() {
        FriendService.getFriendsByUsername($scope.username)
            .then(function(friends) {
                $scope.friends = friends;
            })
            .catch(function(error) {
                console.error("Failed to load friends:", error);
            });
    };

    //load gợi ý kết bạn
    $scope.loadUsersWithoutFriends = function() {
        if ($scope.username) { 
            UserService.getUsersWithoutFriends($scope.username)  
                .then(function(users) {
                    $scope.usersWithoutFriends = users; 
                    console.log("Users without friends:", users); 
                })
                .catch(function(error) {
                    console.error("Failed to load users without friends:", error); 
                    $scope.errorMessage = "An error occurred while fetching users.";  
                });
        } else {
            console.error("Username is required!");  
            $scope.errorMessage = "Please enter a username.";  
        }
    };


    //lấy danh sách bạn chung
    $scope.getMutualFriends = function(username2) {
        FriendService.getMutualFriends(username1, username2)
            .then(function(mutualFriends) {
                $scope.mutualFriendCount = mutualFriends.length;
            })
            .catch(function(error) {
                console.error("Failed to load mutual friends:", error);
            });
    };

    // // Load users without friends and fetch mutual friends when the view is fully loaded
    // $scope.$on('$viewContentLoaded', function() {
    //     UserService.getUsersWithoutFriends()
    //         .then(function(users) {
    //             if (users.length > 0) {
    //                 $scope.getMutualFriends(users[0].username); 
    //             }
    //         })
    //         .catch(function(error) {
    //             console.error("Failed to load users without friends:", error);
    //         });
    // });

    //thêm ban bè
    $scope.addFriend = function(username1, username2) {
        FriendService.addFriend(username1, username2)
            .then(function(response) {
                // Check if the response is successful and contains the expected message
                if (response.status === 200) {
                    $.toast({
                        heading: 'Thông báo',
                        text: 'Kết bạn thành công!',
                        showHideTransition: 'fade',
                        icon: 'success',
                        hideAfter: 3000,
                        loaderBg: '#fa6342',
                        position: 'bottom-right'
                    });
    
                    // Reload the list of users without friends
                    $scope.loadUsersWithoutFriends();
                } else {
                    // If the response is not 200, handle it as an error
                    $.toast({
                        heading: 'Lỗi',
                        text: "Không thể kết bạn: " + (response.data.message || "Vui lòng thử lại sau"),
                        showHideTransition: 'fade',
                        icon: 'error',
                        hideAfter: 3000,
                        loaderBg: '#fa6342',
                        position: 'bottom-right'
                    });
                }
            })
            .catch(function(error) {
                // Log the error and display a toast message for any failure
                const errorMessage = error && error.data && error.data.message 
                    ? error.data.message 
                    : "Vui lòng thử lại sau";
    
                $.toast({
                    heading: 'Lỗi',
                    text: "Không thể kết bạn: " + errorMessage,
                    showHideTransition: 'fade',
                    icon: 'error',
                    hideAfter: 3000,
                    loaderBg: '#fa6342',
                    position: 'bottom-right'
                });
                console.error("Error adding friend:", errorMessage);
            });
    };

    //load danh sách follower
    $scope.loadFollowers = function() {
        var username = $routeParams.username;  // Assuming username is passed via the route
        FriendService.getFollowers(username)  // Passing username to service
            .then(function(data) {
                $scope.followers = data;  // Assigning the returned data to scope
            })
            .catch(function(error) {
                alert("Failed to load followers: " + (error.message || "Please try again later"));
            });
    };

    

    $scope.loadFollowers();
    $scope.loadUsersWithoutFriends();
  //  $scope.getMutualFriends();
    $scope.fetchUser(); 

   
});