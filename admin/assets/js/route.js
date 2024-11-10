var app = angular.module("myApp", ["ngRoute"]);
app.constant("API", "http://localhost:8080/api/");
app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when("/dashboard", {
      templateUrl: "assets/views/dashboard.html",
      controller: "dashboardCtrl",
    })
    .when("/account", {
      templateUrl: "assets/views/account.html",
      controller: "accountCtrl",
    })
    .when("/trip", {
      templateUrl: "assets/views/trip.html",
      controller: "tripController",
    })
    .when("/post", {
      templateUrl: "assets/views/post.html",
      controller: "postCtrl",
    })
    .when("/profileadmin", {
      templateUrl: "assets/views/proifileadmin.html",
      controller: "profileCtrl",
    })
    .when("/post/:postId", {
      templateUrl: "assets/views/postdetail.html",
      controller: "postDetailCtrl",
    })
    .when("/account/:username", {
      templateUrl: "assets/views/accountdetail.html",
      controller: "postDetailCtrl",
    })
    .otherwise({
      redirectTo: "/dashboard",
    });
  // Cấu hình html5Mode
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false,
  });
});
