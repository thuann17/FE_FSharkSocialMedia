var app = angular.module("myApp", ["ngRoute"]);
app.constant("API", "http://localhost:8080/api/");
app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "/admin/assets/dashboard.html",
      controller: "dashboardCtrl",
    })
    .when("/account", {
      templateUrl: "/admin/assets/account.html",
      controller: "accountCtrl",
    })
    .when("/post", {
      templateUrl: "/admin/assets/content.html",
      controller: "postCtrl",
    })
    .when("/account/:username", {
      templateUrl: "/admin/assets/profile.html",
      controller: "profileCtrl",
    })
    .when("/post/:postId", {
      templateUrl: "/admin/assets/contentdetail.html",
      controller: "postDetailCtrl",
    })
    .otherwise({
      redirectTo: "/",
    });
});