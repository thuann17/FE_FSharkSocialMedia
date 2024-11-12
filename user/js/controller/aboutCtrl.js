app.controller("aboutCtrl", function ($scope, $routeParams, UserService, FriendService) {
    $scope.user = null;
    $scope.friends = [];
    $scope.username = $routeParams.username; // Lấy username từ URL
    $scope.usersWithoutFriends = [];
  
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
    
    // Gọi fetchUser để lấy thông tin ngay khi controller được khởi tạo
    $scope.fetchUser();

    // Hàm để xác định giới tính
    $scope.getGender = function() {
        return $scope.user && $scope.user.gender ? 'Nam' : 'Nữ'; // gender là true cho Nam và false cho Nữ
    };

});
