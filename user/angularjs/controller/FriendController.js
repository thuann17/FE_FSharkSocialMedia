app.controller(
  "friendsCtrl",
  function ($scope, $routeParams, AboutService, FriendService) {
    $scope.friends = [];
    $scope.user = null;
    $scope.username = $routeParams.username; // Lấy username từ URL
    $scope.username2 = "";
    const username1 = $routeParams.username;
    $scope.usersWithoutFriends = [];
    $scope.mutualFriendCount = 0;
    $scope.userTarget = ""; // Username of the user you want to add as a friend
    $scope.userSrc = $routeParams.username;
    $scope.followers = [];

    $scope.getUserByUsername = function () {
      // Get username from route parameters
      var username = $routeParams.username; // Get the username from route params

      // Call the fetchAccounts method from AboutService with the username
      AboutService.getAccounts(username) // Calling API with username
        .then(function (response) {
          // On success, assign the response data to $scope.user
          $scope.user = response.data;
        })
        .catch(function (error) {
          // On error, log and show an alert
          console.error("Error fetching account:", error);
          alert("Không thể lấy thông tin tài khoản");
        });
    };

    //xóa bạn bè
    $scope.deleteFriend = function (id) {
      // Show  modal xác nhận
      $("#confirmDeleteModal").modal("show");

      $("#confirmDeleteBtn")
        .off("click")
        .on("click", function () {
          FriendService.deleteFriend(id).then(
            function (response) {
              // xóa thành công
              $.toast({
                heading: "Thông báo",
                text: "Xóa thành công!",
                showHideTransition: "fade",
                icon: "success",
                hideAfter: 3000,
                loaderBg: "#fa6342",
                position: "bottom-right",
              });

              $scope.getFriendsByUsername(); // Reload the list
              $("#confirmDeleteModal").modal("hide"); // Ẩn modal
            },
            function (error) {
              console.error("Error deleting friend request:", error);
              // Display error toast notification
              $.toast({
                heading: "Error",
                text:
                  "Error deleting friend request: " +
                  (error.data.message || "An unexpected error occurred."),
                showHideTransition: "fade",
                icon: "error",
                hideAfter: 3000,
                loaderBg: "#fa6342",
                position: "bottom-right",
              });
            }
          );
        });
    };

    //load gợi ý kết bạn
    $scope.error = "";

    //load gợi ý kết bạn
    $scope.loadUsersWithoutFriends = function () {
      // Ensure username is available
      if ($scope.username) {
        // Call the service to get users without friends
        FriendService.getUsersWithoutFriends($scope.username)
          .then(function (response) {
            // Success: Assign data to $scope
            $scope.usersWithoutFriends = response.data;
            console.log("Users without friends:", $scope.usersWithoutFriends);
          })
          .catch(function (error) {
            // Error handling
            console.error("Failed to load users without friends:", error);
            $scope.errorMessage = "An error occurred while fetching users.";
          });
      } else {
        // Handle case where username is not provided
        console.error("Username is required!");
        $scope.errorMessage = "Please enter a username.";
      }
    };

    

    //Hiển thị bài đang
    $scope.loadPosts = function () {
      // Trạng thái đang tải
      $scope.isLoading = true;
      $scope.error = ""; // Reset lỗi mỗi lần gọi API

      // Kiểm tra nếu username không có giá trị
      if (!$scope.username) {
        $scope.error = "Vui lòng nhập tên người dùng.";
        $scope.isLoading = false;
        return;
      }

      // Gọi service để lấy bài đăng theo username
      PostService.getPostsWithImages($scope.username).then(
        function (response) {
          $scope.posts = response.data; // Gán dữ liệu trả về cho biến posts
          console.log($scope.posts); // Kiểm tra dữ liệu trả về
          $scope.isLoading = false; // Đổi trạng thái khi đã tải xong
        },
        function (error) {
          // Xử lý lỗi khi gọi API thất bại
          $scope.error = "Không thể tải bài đăng. Vui lòng thử lại."; // Thông báo lỗi khi có sự cố
          $scope.isLoading = false; // Đổi trạng thái khi có lỗi
        }
      );
    };

    $scope.getImageSrc = function (imageString) {
      // Match the image filename after "user/image="
      var matches = imageString.match(/user\/image=([^,]+)/);

      if (matches) {
        // Extract the filename and remove the closing parenthesis if it's at the end
        var filename = matches[1];
        return "/user/images/" + filename.replace(/\)$/, ""); // Remove the closing parenthesis if it exists
      }
      return ""; // Return empty string if no match is found
    };

    $scope.loadFollowers = function () {
      if (!$scope.username) {
        $scope.errorMessage = "Please enter a username.";
        return;
      }

      // Call the service to get followers for the specified username
      FriendService.getFollowers($scope.username)
        .then(function (response) {
          if (response.data && response.data.length > 0) {
            $scope.followers = response.data; // Set followers data
            $scope.errorMessage = null; // Clear any previous error
          } else {
            $scope.followers = [];
            $scope.loadUsersWithoutFriends();
            $scope.errorMessage = "No followers found.";
          }
        })
        .catch(function (error) {
          console.error("Error loading followers:", error);
          $scope.errorMessage = "An error occurred while loading followers.";
        });
    };

    //xóa bạn bè
    $scope.deleteFriend = function (id) {
      // Show  modal xác nhận
      $("#confirmDeleteModal").modal("show");

      $("#confirmDeleteBtn")
        .off("click")
        .on("click", function () {
          FriendService.deleteFriend(id).then(
            function (response) {
              // xóa thành công
              $.toast({
                heading: "Thông báo",
                text: "Xóa thành công!",
                showHideTransition: "fade",
                icon: "success",
                hideAfter: 3000,
                loaderBg: "#fa6342",
                position: "bottom-right",
              });

              $scope.loadFollowers(); // Reload the list
              $scope.loadUsersWithoutFriends();
              $("#confirmDeleteModal").modal("hide"); // Ẩn modal
            },
            function (error) {
              console.error("Error deleting friend request:", error);
              // Display error toast notification
              $.toast({
                heading: "Error",
                text:
                  "Error deleting friend request: " +
                  (error.data.message || "An unexpected error occurred."),
                showHideTransition: "fade",
                icon: "error",
                hideAfter: 3000,
                loaderBg: "#fa6342",
                position: "bottom-right",
              });
            }
          );
        });
    };

    // Function to update the friend status when accepting a request
    $scope.updateStatus = function (friendId) {
      // Call the FriendService to update the status
      FriendService.updateFriendStatus(friendId)
        .then(function (updatedFriend) {
          // If update is successful, show the toast notification
          $.toast({
            heading: "Thông báo",
            text: "Đã chấp nhận lời mời kết bạn.",
            showHideTransition: "fade",
            icon: "success",
            hideAfter: 3000,
            loaderBg: "#fa6342",
            position: "bottom-right",
          });

          // Find the friend in the list and update their status
          const friendIndex = $scope.friends.findIndex(
            (f) => f.id === updatedFriend.id
          );
          if (friendIndex !== -1) {
            $scope.friends[friendIndex].status = true; // Set status to true (accepted)
          }
          $scope.loadFollowers();
        })
        .catch(function (error) {
          console.error("Error updating friend status:", error);
          alert("Failed to update friend status.");
        });
    };

    //gửi yêu cầu kết bạn
    $scope.addFriend = function (username1, username2) {
      FriendService.addFriend(username1, username2)
        .then(function (response) {
          // Display success message using toast
          $.toast({
            heading: "Thông báo",
            text: response.data,
            showHideTransition: "fade",
            icon: "success",
            hideAfter: 3000,
            loaderBg: "#fa6342",
            position: "bottom-right",
          });
          $scope.loadUsersWithoutFriends(); // Reload user list or any necessary data
          $scope.loadFollowers();
        })
        .catch(function (error) {
          // Display error message
          $.toast({
            heading: "Thông báo",
            text: "Đã gửi yêu cầu kết bạn.",
            showHideTransition: "fade",
            icon: "success",
            hideAfter: 3000,
            loaderBg: "#fa6342",
            position: "bottom-right",
          });
          $scope.loadUsersWithoutFriends(); // Reload user list or any necessary data
          $scope.loadFollowers();
        });
    };

    $scope.getGender = function () {
      return $scope.user && $scope.user.gender ? "Nam" : "Nữ"; // gender là true cho Nam và false cho Nữ
    };

    $scope.loadUsersWithoutFriends();
    $scope.loadFollowers();
    $scope.getUserByUsername();
  }
);
