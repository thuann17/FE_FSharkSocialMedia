var app = angular.module("myApp", ["ngRoute", "ngCookies"]);
app.constant("API", "http://localhost:8080/api/");
app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    // user
    .when("/index", {
      templateUrl: "user/views/index.html",
      controller: "indexCtrl",
    })
    .when("/about/:username", {
      templateUrl: "user/views/about.html",
      controller: "aboutCtrl",
    })
    .when("/friends/:username", {
      templateUrl: "user/views/timeline-friends.html",
      controller: "friendsCtrl",
    })
    .when("/schedule/:username", {
      templateUrl: "user/views/schedule.html",
      controller: "scheduleCtrl",
    })

    .when("/chat", {
      templateUrl: "user/views/chat.html",
      controller: "chatCtrl",
    })
    // user
    // Admin
    .when("/dashboard", {
      templateUrl: "admin/assets/views/dashboard.html",
      controller: "dashboardCtrl",
    })
    .when("/account", {
      templateUrl: "admin/assets/views/account.html",
      controller: "accountCtrl",
    })
    .when("/trip", {
      templateUrl: "admin/assets/views/trip.html",
      controller: "tripCtrl",
    })
    .when("/post", {
      templateUrl: "admin/assets/views/post.html",
      controller: "postCtrl",
    })
    .when("/profileadmin", {
      templateUrl: "admin/assets/views/proifileadmin.html",
      controller: "profileCtrl",
    })
    .when("/post/:postId", {
      templateUrl: "admin/assets/views/postdetail.html",
      controller: "postDetailCtrl",
    })
    .when("/account/:username", {
      templateUrl: "admin/assets/views/accountdetail.html",
      controller: "accountDetailCtrl",
    })
    // Admin
    .otherwise({
      redirectTo: "/index",
    });
  // Cấu hình html5Mode
  // $locationProvider.html5Mode({
  //   enabled: true,
  //   requireBase: false,
  // });
});
