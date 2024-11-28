app.controller(
  "aboutCtrl",
  function ($scope, $routeParams, AboutService, FriendService, PostService) {
    $scope.accounts = [];
    $scope.toggleStatus = {};
    $scope.currentPage = 1;
    $scope.pageSize = 7;
    $scope.totalItems = 0;
    $scope.pages = [];
    $scope.selectedAccount = null;
    $scope.statusText = "";
    $scope.user = null;
    $scope.friends = [];
    $scope.username = $routeParams.username; 
    $scope.usersWithoutFriends = [];
    $scope.posts = []; 
    $scope.isLoading = false;
    $scope.error = "";
    $scope.likeCount = [];
    $scope.comments = [];
    $scope.postId = null; 
    $scope.errorMessage = null;

    $scope.getUserByUsername = function () {
      var username = $scope.username;
      AboutService.getAccounts(username)
        .then(function (response) {
          $scope.user = response.data;
        })
        .catch(function (error) {
          console.error("Error fetching account:", error);
          alert("Không thể lấy thông tin tài khoản");
        });
    };

    //lấy danh sách bạn bè
    $scope.getFriendsByUsername = function () {
      const username = $routeParams.username; // Lấy username từ URL

      FriendService.getFriends(username) // Gọi hàm trong service
        .then(function (response) {
          $scope.friends = response.data;
        })
        .catch(function (error) {
          // Xử lý lỗi
          console.error("Error fetching friends:", error);
          alert("Không thể lấy danh sách bạn bè.");
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

              $scope.getFriendsByUsername();
              $("#confirmDeleteModal").modal("hide"); // Ẩn modal
            },
            function (error) {
              console.error("Error deleting friend request:", error);
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

    //Hiển thị bài đang
    $scope.getPosts = function () {
      PostService.getPostsWithUserDetails($scope.username)

        .then(function (response) {
          if (response.data && response.data.length > 0) {
            $scope.posts = response.data; // Gán bài viết
            $scope.error = null; // Xóa lỗi

            $scope.posts.forEach(function (post) {
              $scope.checkLikeStatus(post.id, $scope.username);
            });
          } else {
            $scope.posts = [];
            $scope.error = "Không tìm thấy bài viết!";
          }
        })
        .catch(function (error) {
          console.error("Error fetching posts:", error);
          $scope.error = "Có lỗi xảy ra khi lấy bài viết!";
        });
    };

    $scope.getImageSrc = function (imageString) {
      var matches = imageString.match(/user\/image=([^,]+)/);

      if (matches) {
        var filename = matches[1];
        return "/user/images/" + filename.replace(/\)$/, "");
      }
      return "";
    };

    $scope.toggleLike = function (postId, username) {
      // Find the post from the list first
      const post = $scope.posts.find((p) => p.id === postId);
      if (!post) {
        console.error("Post not found!");
        return;
      }

      if (post.likedByUser) {
       
        PostService.removeLike(postId, username)
          .then(function (response) {
            console.log("Post unliked successfully", response.data);
           
            post.likedByUser = false; 
            post.countLike = (post.countLike || 0) - 1; 
          })
          .catch(function (error) {
            console.error("Error unliking post", error);
            alert(
              "Failed to unlike the post: " +
                (error.data
                  ? error.data.message
                  : error.statusText || "Unknown error")
            );
          });
      } else {
      
        PostService.likePost(postId, username)
          .then(function (response) {
            console.log("Post liked successfully", response.data);

            post.likedByUser = true; 
            post.countLike = (post.countLike || 0) + 1; 
          })
          .catch(function (error) {
            console.error("Error liking post", error);
            alert(
              "Failed to like the post: " +
                (error.data
                  ? error.data.message
                  : error.statusText || "Unknown error")
            );
          });
      }
    };


    $scope.isPostLiked = function (postId, username) {
      const post = $scope.posts.find((p) => p.id === postId);
      return post ? post.likedByUser : false;
    };

    //check like
    $scope.checkLikeStatus = function (postId, username) {
  
      PostService.checkIfUserLiked(postId, username)
        .then(function (response) {
          const post = $scope.posts.find((p) => p.id === postId);
          if (post) {
            post.likedByUser = response.data; // true or false
          }
        })
        .catch(function (error) {
          console.error("Error checking like status", error);
          alert("Failed to check like status");
        });
    };


    //lấy cmt
    $scope.loadPostsWithComments = function () {
      PostService.getPostsWithUserDetails()
          .then(function (response) {
              const posts = response.data;

              const commentPromises = posts.map(post =>
                  CommentService.getCommentsByPostId(post.id)
                      .then(function (commentResponse) {
                          post.comments = commentResponse.data;
                          return post;
                      })
                      .catch(function () {
                          post.comments = [];
                          return post;
                      })
              );

              Promise.all(commentPromises).then(function (result) {
                  $scope.posts = result;
                  $scope.$apply(); 
              });
          })
          .catch(function (error) {
              console.error("Error loading posts:", error);
          });
  };

    $scope.getGender = function () {
      return $scope.user && $scope.user.gender ? "Nam" : "Nữ"; // gender là true cho Nam và false cho Nữ
    };

    $scope.getFriendsByUsername();
    $scope.getUserByUsername();
    $scope.getPosts();
    $scope.loadPostsWithComments();
  }
);
