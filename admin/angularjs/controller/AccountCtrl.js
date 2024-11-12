app.controller("accountCtrl", function ($scope, $http, ApiService) {
  // var socket = new SockJS("http://localhost:8080/ws");
  // var stompClient = Stomp.over(socket);
  $scope.accounts = [];
  $scope.toggleStatus = {};
  $scope.currentPage = 1;
  $scope.pageSize = 7;
  $scope.totalItems = 0;
  $scope.pages = [];
  $scope.selectedAccount = null;
  $scope.statusText = "";
  $scope.username = "";
  $scope.fetchAccounts = function (keyword, page) {
    if (isNaN(page) || page < 1) {
      page = 1;
    }
    ApiService.fetchAccounts(keyword, page, $scope.pageSize).then(
      function successCallback(response) {
        $scope.accounts = response.data.content;
        $scope.totalItems = response.data.totalElements;
        $scope.currentPage = page;
        $scope.generatePages();
        $scope.accounts.forEach((account) => {
          $scope.toggleStatus[account.username] = account.active;
        });
      },
      function errorCallback(error) {
        console.error("Error fetching accounts:", error);
      }
    );
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

  $scope.fetchAccounts(null, 1);

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
});
