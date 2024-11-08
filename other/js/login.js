angular.module("authApp", []).controller("AuthController", [
  "$scope",
  "$http",
  "$document",
  function ($scope, $http, $document) {
    $scope.credentials = {
      username: "",
      password: "",
      rememberMe: false,
    };
    $scope.message = "";

    function setCookie(username, value, days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      var expires = "expires=" + date.toUTCString();
      document.cookie = username + "=" + value + ";" + expires + ";path=/";
    }

    $scope.login = function () {
      $http
        .post("http://localhost:8080/api/generateToken", {
          username: $scope.credentials.username,
          password: $scope.credentials.password,
        })
        .then(function (response) {
          var token = response.data["token"];
          var role = response.data["role"];

          // Store token and role in cookies with a 7-day expiration
          setCookie("username", $scope.credentials.username, 7);
          setCookie("authToken", token, 7);
          setCookie("roleName", role, 7);
          console.log("hello");
          console.log("Login successful! Token: " + token + "Role: " + role);
          if (role == "User") {
            window.location.href = "user/index.html";
            console("Login successful user! Token: " + token);
          } else if (role == "Admin") {
          
            window.location.href = "/admin/index.html";
            console("Login successful admin! Token: " + token);
          } else {
            $scope.message = "Unknown role!";
          }
        })
        .catch(function (error) {
          $scope.message = "Login failed! Invalid credentials.";
        });
    };
  },
]);
