app.controller("indexCtrl", function ($scope, $routeParams, AboutService, FriendService) {

    $scope.accounts = [];
    $scope.toggleStatus = {};
    $scope.currentPage = 1;
    $scope.pageSize = 7;
    $scope.totalItems = 0;
    $scope.pages = [];
    $scope.selectedAccount = null;
    $scope.statusText = "";
    $scope.username = "";
    $scope.user = null;
    $scope.friends = [];
    $scope.username = $routeParams.username; // Lấy username từ URL
    $scope.usersWithoutFriends = [];
    $scope.posts = [];  // Mảng để lưu danh sách bài đăng
    $scope.isLoading = false;
    $scope.error = '';

    
    $scope.getUserByUsername = function() {
        // Get username from route parameters
        var username = $routeParams.username;  // Get the username from route params

        // Call the fetchAccounts method from AboutService with the username
        AboutService.fetchAccounts(username)  // Calling API with username
            .then(function(response) {
                // On success, assign the response data to $scope.user
                $scope.user = response.data;
            })
            .catch(function(error) {
                // On error, log and show an alert
                console.error('Error fetching account:', error);
                alert('Không thể lấy thông tin tài khoản');
            });
    };

    //lấy danh sách bạn bè
    $scope.getFriendsByUsername = function() {
        const username = $routeParams.username; // Lấy username từ URL
        
        FriendService.getFriends(username)  // Gọi hàm trong service
            .then(function(response) {
                // Xử lý thành công, gán dữ liệu trả về cho $scope.friends
                $scope.friends = response.data;
            })
            .catch(function(error) {
                // Xử lý lỗi
                console.error("Error fetching friends:", error);
                alert("Không thể lấy danh sách bạn bè.");
            });
    };

    //xóa bạn bè
    $scope.deleteFriend = function(id) {
        // Show  modal xác nhận
        $('#confirmDeleteModal').modal('show');
    
        $('#confirmDeleteBtn').off('click').on('click', function() {
            FriendService.deleteFriend(id).then(
                function(response) {
                    // xóa thành công
                    $.toast({
                        heading: 'Thông báo',
                        text: 'Xóa thành công!',
                        showHideTransition: 'fade',
                        icon: 'success',
                        hideAfter: 3000,
                        loaderBg: '#fa6342',
                        position: 'bottom-right'
                    });
    
                    $scope.getFriendsByUsername(); // Reload the list
                    $('#confirmDeleteModal').modal('hide'); // Ẩn modal
                },
                function(error) {
                    console.error('Error deleting friend request:', error);
                    // Display error toast notification
                    $.toast({
                        heading: 'Error',
                        text: 'Error deleting friend request: ' + (error.data.message || 'An unexpected error occurred.'),
                        showHideTransition: 'fade',
                        icon: 'error',
                        hideAfter: 3000,
                        loaderBg: '#fa6342',
                        position: 'bottom-right'
                    });
                }
            );
        });
    };
    

    $scope.changePage = function (newPage) {
      if (newPage > 0 && newPage <= $scope.getPageCount()) {
        $scope.fetchAccounts($scope.searchKeyword, newPage);
      }
    };
  
    $scope.getPageCount = function () {
      return Math.ceil($scope.totalItems / $scope.pageSize);
    };
  
    $scope.generatePages = function () {
      var pageCount = $scope.getPageCount();
      var currentPage = $scope.currentPage;
      var visiblePages = 2;
      $scope.pages = [];
      $scope.pages.push(1);
      var start = Math.max(currentPage - visiblePages, 2);
      var end = Math.min(currentPage + visiblePages, pageCount - 1);
      if (start > 2) {
        $scope.pages.push("...");
      }
      for (var i = start; i <= end; i++) {
        $scope.pages.push(i);
      }
      if (end < pageCount - 1) {
        $scope.pages.push("...");
      }
      if (pageCount > 1) {
        $scope.pages.push(pageCount);
      }
    };
  
    $scope.searchAccounts = function () {
      $scope.fetchAccounts($scope.searchKeyword, 1);
    };
  
   // $scope.fetchAccounts(null, 1);
  
    // stompClient.connect({}, function (frame) {
    //   stompClient.subscribe("/topic/account-status", function (message) {
    //     var updatedUser = JSON.parse(message.body);
    //     var index = $scope.accounts.findIndex(
    //       (account) => account.username === updatedUser.username
    //     );
    //     if (index !== -1) {
    //       $scope.accounts[index].active = updatedUser.active;
    //       $scope.toggleStatus[updatedUser.username] = updatedUser.active;
    //       $scope.$apply();
    //     }
    //   });
    // });
    $scope.originalStatus = {};
  
    $scope.toggleChanged = function (username) {
      $scope.selectedAccount = username;
      const newStatus = $scope.toggleStatus[username];
      $scope.statusText = newStatus ? "kích hoạt" : "vô hiệu hóa";
      $scope.username = username;
  
      $scope.originalStatus[username] = !newStatus;
      $("#confirmModal").modal("show");
    };
  
    $scope.cancelToggle = function () {
      $scope.toggleStatus[$scope.selectedAccount] =
        $scope.originalStatus[$scope.selectedAccount];
      $("#confirmModal").modal("hide");
    };
  
    $scope.confirmToggle = function () {
      const newStatus = $scope.toggleStatus[$scope.selectedAccount];
      // Kiểm tra xem mật khẩu đã được nhập chưa
      if (!$scope.password) {
        Swal.fire({
          icon: "warning",
          title: "Cảnh báo",
          text: "Vui lòng nhập mật khẩu để xác nhận!",
          position: "center",
        });
        return;
      }
      // Kiểm tra mật khẩu
      ApiService.updateAccountStatus($scope.selectedAccount, newStatus).then(
        function (response) {
          if ($scope.password === "123") {
            console.log(
              "Cập nhật trạng thái thành công cho " + $scope.selectedAccount
            );
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Xác nhận thành công!",
              position: "center",
            });
            delete $scope.originalStatus[$scope.selectedAccount];
            $scope.password = ""; // Reset password input
            $("#confirmModal").modal("hide"); // Đóng modal
          } else {
            Swal.fire({
              icon: "error",
              title: "Thất bại",
              text: "Sai mật khẩu!",
              position: "center",
            });
          }
        },
        function (error) {
          console.error("Lỗi khi cập nhật trạng thái:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Có lỗi khi thực hiện!",
            position: "center",
          });
        }
      );
    };

     //Hiển thị bài đang
     $scope.loadPosts = function() {
        // Trạng thái đang tải
        $scope.isLoading = true;
        $scope.error = '';  // Reset lỗi mỗi lần gọi API

        // Kiểm tra nếu username không có giá trị
        if (!$scope.username) {
            $scope.error = 'Vui lòng nhập tên người dùng.';
            $scope.isLoading = false;
            return;
        }

        // Gọi service để lấy bài đăng theo username
        AboutService.getPostsWithImages($scope.username).then(function(response) {
            $scope.posts = response.data;  // Gán dữ liệu trả về cho biến posts
            console.log($scope.posts);  // Kiểm tra dữ liệu trả về
            $scope.isLoading = false;  // Đổi trạng thái khi đã tải xong
        }, function(error) {
            // Xử lý lỗi khi gọi API thất bại
            $scope.error = 'Không thể tải bài đăng. Vui lòng thử lại.';  // Thông báo lỗi khi có sự cố
            $scope.isLoading = false;  // Đổi trạng thái khi có lỗi
        });
    };


    $scope.getImageSrc = function(imageString) {
        // Match the image filename after "user/image="
        var matches = imageString.match(/user\/image=([^,]+)/);
    
        if (matches) {
            // Extract the filename and remove the closing parenthesis if it's at the end
            var filename = matches[1];
            return '/user/images/' + filename.replace(/\)$/, '');  // Remove the closing parenthesis if it exists
        }
        return '';  // Return empty string if no match is found
    };
    
    

    $scope.getGender = function() {
        return $scope.user && $scope.user.gender ? 'Nam' : 'Nữ'; // gender là true cho Nam và false cho Nữ
    }; 

    $scope.getFriendsByUsername();
    $scope.getUserByUsername();
    $scope.loadPosts();

  });
  