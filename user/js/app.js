var app = angular.module("myApp", ["ngRoute"]);
// var API = "http://localhost:8080/api/";
app.constant("API", "http://localhost:8080/api/");


app.config(function ($routeProvider) {
  $routeProvider
  .when("/:username", {  // Đường dẫn có chứa username
    templateUrl: "about.html",
    controller: "aboutCtrl",
  })
    .when("/:username/friends", {
      templateUrl: "timeline-friends.html",
      controller: "friendCtrl",
    })
    .when("/:username/timeline", {
      templateUrl: "timeline.html",
      controller: "timelineCtrl",
    })
    .when("/account/:username", {
      templateUrl: "assets/profile.html",
      controller: "profileCtrl",
    })
    .when("/content/:postId", {
      templateUrl: "assets/contentdetail.html",
      controller: "postDetailCtrl",
    })
    
});