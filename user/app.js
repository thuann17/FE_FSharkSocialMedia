var app = angular.module("myApp", ["ngRoute", "ngCookies"]);

// Sử dụng constant cho URL của API
app.constant("API", "http://localhost:8080/api/");
// Cấu hình các route
app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "/user/assets/index.html",
      controller: "indexCtrl",
    })
    .when("/friends", {
      templateUrl: "user/chat.html",
      controller: "ChatController",
    })
    .when("/", {
      templateUrl: "",
      controller: "",
    })
    .when("/", {
      templateUrl: "",
      controller: "",
    })
    .otherwise({
      redirectTo: "/",
    });
});
