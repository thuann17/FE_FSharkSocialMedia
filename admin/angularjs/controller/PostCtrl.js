app.controller("postCtrl", function ($scope, ApiService) {
  $scope.posts = [];
  $scope.toggleStatus = {};
  $scope.currentPage = 1;
  $scope.pageSize = 7;
  $scope.totalItems = 0;
  $scope.pages = [];
  $scope.selectedPostId = null;
  $scope.statusText = "";
  $scope.password = "";

  // Fetch posts with optional keyword and page
  $scope.fetchPosts = function (keyword, page) {
    if (isNaN(page) || page < 1) {
      page = 1;
    }
    ApiService.fetchPosts(keyword, page, $scope.pageSize)
      .then(function (response) {
        $scope.posts = response.data.content;
        $scope.totalItems = response.data.totalElements;
        $scope.currentPage = page;
        $scope.generatePages();
        $scope.posts.forEach((post) => {
          $scope.toggleStatus[post.id] = post.status;
        });
      })
      .catch(function (error) {
        console.error("Error fetching post data:", error);
      });
  };

  // Pagination
  $scope.changePage = function (newPage) {
    if (newPage > 0 && newPage <= $scope.getPageCount()) {
      $scope.fetchPosts($scope.searchKeyword, newPage);
    }
  };

  $scope.getPageCount = function () {
    return Math.ceil($scope.totalItems / $scope.pageSize);
  };

  $scope.generatePages = function () {
    const pageCount = $scope.getPageCount();
    const currentPage = $scope.currentPage;
    const visiblePages = 2;
    $scope.pages = [];
    $scope.pages.push(1);
    const start = Math.max(currentPage - visiblePages, 2);
    const end = Math.min(currentPage + visiblePages, pageCount - 1);
    if (start > 2) {
      $scope.pages.push("...");
    }
    for (let i = start; i <= end; i++) {
      $scope.pages.push(i);
    }
    if (end < pageCount - 1) {
      $scope.pages.push("...");
    }
    if (pageCount > 1) {
      $scope.pages.push(pageCount);
    }
  };

  $scope.searchPost = function () {
    $scope.fetchPosts($scope.searchKeyword, 1);
  };

  // Handle toggle change
  $scope.toggleChanged = function (postId) {
    $scope.selectedPostId = postId;
    const newStatus = $scope.toggleStatus[postId];
    $scope.statusText = newStatus ? "mở khoá" : "Khoá";
    $scope.originalStatus = !newStatus;
    $("#confirmModal").modal("show");
  };

  $scope.cancelToggle = function () {
    $scope.toggleStatus[$scope.selectedPostId] = $scope.originalStatus;
    $("#confirmModal").modal("hide");
  };

  $scope.confirmToggle = function () {
    if (!$scope.password) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Vui lòng nhập mật khẩu để xác nhận!",
        confirmButtonText: "OK",
      });
      return;
    }
    ApiService.fetchUpdateStatusPost(
      $scope.selectedPostId,
      $scope.toggleStatus[$scope.selectedPostId]
    )
      .then(function (response) {
        if ($scope.password === "123") {
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Xác nhận thành công!",
            confirmButtonText: "OK",
          });
          $scope.password = "";
          $("#confirmModal").modal("hide");
        } else {
          Swal.fire({
            icon: "warning",
            title: "Thất bại",
            text: "Sai mật khẩu!",
            confirmButtonText: "OK",
          });
        }
      })
      .catch(function (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra!",
          confirmButtonText: "OK",
        });
      });
  };

  $scope.fetchPosts(null, 1);
});
