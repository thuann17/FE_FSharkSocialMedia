app.controller("profileCtrl", function ($scope, ApiService, $routeParams) {
  $scope.user = {};
  $scope.error = null;

  const username = $routeParams.username;
  if (username) {
    ApiService.fetchUserByUsername(username).then(
      function (response) {
        $scope.user = response.data;
        console.log("user:" + $scope.user);
      },
      function (error) {
        $scope.error = "Error fetching user profile.";
        console.log(error);
      }
    );

    ApiService.fetchUserPosts(username).then(
      function (response) {
        $scope.posts = response.data;
        console.log("Posts:", $scope.posts);
      },
      function (error) {
        $scope.error = "Error fetching user posts.";
        console.error(error);
      }
    );
  }
});
