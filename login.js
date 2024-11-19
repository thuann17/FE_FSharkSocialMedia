angular.module("authApp", []).controller("AuthController", [
  "$scope",
  "$http",
  "$document",
  function ($scope, $http) {
    $scope.credentials = {
      username: "",
      password: "",
      rememberMe: false,
    };
    $scope.message = "";

    function setCookie(name, value, days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      var expires = "expires=" + date.toUTCString();
      document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    $scope.login = function () {
      if (!$scope.credentials.password || !$scope.credentials.username) {
        Swal.fire({
          icon: "warning",
          title: "Cảnh báo",
          text: "Vui lòng nhập thông tin để xác nhận!",
          position: "center",
        });
        return;
      }

      $http
        .post("http://localhost:8080/api/login", {
          username: $scope.credentials.username,
          password: $scope.credentials.password,
        })
        .then(function (response) {
          var token = response.data["token"];
          var role = response.data["role"];

          // Only set cookies if login is successful
          setCookie("username", $scope.credentials.username, 7);
          setCookie("authToken", token, 7);
          setCookie("roleName", role, 7)
          if (role === "User") {
            window.location.href = "/index.html";
          } else if (role === "Admin") {
            window.location.href = "/dashboard.html";
          }
        })
        .catch(function (error) {
          Swal.fire({
            icon: "error",
            title: "Đăng nhập thất bại",
            text: "Sai thông tin tài khoản!",
            position: "center",
          });
          console.error("Login failed: ", error);
        });
    };
  },
]);
