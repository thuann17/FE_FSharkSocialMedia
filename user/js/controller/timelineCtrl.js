app.controller("timelineCtrl", function ($scope, $routeParams, UserService, FriendService) {
    $scope.user = null;
    $scope.friends = [];
    $scope.username = $routeParams.username; // Lấy username từ URL
    $scope.usersWithoutFriends = [];
    $scope.posts = [];  // Mảng để lưu danh sách bài đăng
    $scope.isLoading = false;
    $scope.error = '';

    // Hàm để lấy thông tin người dùng
    $scope.fetchUser = function () {
        UserService.getUserByUsername($scope.username)
            .then(function (data) {
                $scope.user = data;
                console.log(data);
                $scope.fetchFriends(); 
            })
            .catch(function (error) {
                console.error("Error fetching user:", error);
                $scope.user = null;
            });
    };

    // Phương thức lấy danh sách bạn bè 
    $scope.fetchFriends = function () {
        FriendService.getFriendsByUsername($scope.username) // Use $scope.username
            .then(function (data) {
                $scope.friends = data; // Set friends data
                console.log("Friends data:", data);
            })
            .catch(function (error) {
                console.error("Error fetching friends:", error);
                $scope.friends = []; // Reset friends if there is an error
            });
    };

    //PHUONG THỨC XÓA
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
    
                     $scope.fetchFriends(); // Reload the list
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

    //Hiển thị bài đnagư
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
        FriendService.getPostsWithImages($scope.username).then(function(response) {
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
        // Match the image filename after "image="
        var matches = imageString.match(/image=([^,]+)/);
        
        if (matches) {
            // Get the filename and remove the last character if it's a closing parenthesis
            var filename = matches[1];
            return 'images/' + filename.replace(/\)$/, '');  // Remove the closing parenthesis if it exists
        }
        return '';  // Return empty string if no match is found
    };
    
    // Gọi fetchUser để lấy thông tin ngay khi controller được khởi tạo
    $scope.fetchUser();
    $scope.loadPosts();

    // Hàm để xác định giới tính
    $scope.getGender = function() {
        return $scope.user && $scope.user.gender ? 'Nam' : 'Nữ'; // gender là true cho Nam và false cho Nữ
    };

});
