app.controller("accountDetailCtrl", function ($scope, ApiService) {
  $scope.username = "";
  $scope.userData = {};
  $scope.getUserInfo = function () {
    if ($scope.username) {
      UserService.getUserByUsername($scope.username)
        .then(function (response) {
          $scope.userData = response.data;
          console.log("Thông tin user:", $scope.userData);
        })
        .catch(function (error) {
          console.error("Không lấy được thông tin user:", error);
        });
    } else {
      console.warn("Username chưa được nhập!");
    }
  };
});
