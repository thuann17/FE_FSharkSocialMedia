app.controller("postDetailCtrl", function ($scope, $http, ApiService) {
  $scope.selectedAccount = null;
  $scope.toggleStatus = {};
  $scope.password = "";
  $scope.currentPassword = ""; // Mật khẩu của tài khoản đang hoạt động
  $scope.originalStatus = {};

  // Hàm xác nhận thay đổi trạng thái
  $scope.confirmToggle = function () {
    const newStatus = $scope.toggleStatus[$scope.selectedAccount];

    // Kiểm tra xem mật khẩu đã được nhập chưa
    if (!$scope.password) {
      toastr.warning("Vui lòng nhập mật khẩu để xác nhận!", "Cảnh báo", {
        positionClass: "toast-bottom-right",
        closeButton: true,
        progressBar: true,
      });
      return;
    }

    // Kiểm tra mật khẩu so với mật khẩu của tài khoản đang hoạt động
    if ($scope.password === $scope.currentPassword) {
      ApiService.updateAccountStatus($scope.selectedAccount, newStatus).then(
        function (response) {
          console.log("Cập nhật trạng thái thành công cho " + $scope.selectedAccount);
          toastr.success("Xác nhận thành công!", "Thành công", {
            positionClass: "toast-bottom-right",
            closeButton: true,
            progressBar: true,
          });
          delete $scope.originalStatus[$scope.selectedAccount];
          $scope.password = ""; // Reset password input
          $("#confirmModal").modal("hide"); // Đóng modal
        },
        function (error) {
          console.error("Lỗi khi cập nhật trạng thái:", error);
          toastr.error("Có lỗi khi thực hiện!", "Lỗi", {
            positionClass: "toast-bottom-right",
            closeButton: true,
            progressBar: true,
          });
        }
      );
    } else {
      toastr.warning("Sai mật khẩu!", "Thất bại", {
        positionClass: "toast-bottom-right",
        closeButton: true,
        progressBar: true,
      });
    }
  };

  // Hàm khởi tạo để lấy mật khẩu và trạng thái hiện tại
  // $scope.init = function (account) {
  //   $scope.selectedAccount = account.username; // Lưu tên tài khoản đã chọn
  //   $scope.currentPassword = account.password; // Giả định mật khẩu có sẵn
  //   $scope.toggleStatus[account.username] = account.active; // Trạng thái hiện tại
  //   $scope.originalStatus[account.username] = !account.active; // Lưu trạng thái ban đầu
  // };
});
