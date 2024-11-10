app.controller("dashboardCtrl", function ($scope, ApiService) {
  $scope.postCount = 0;
  $scope.tripCount = 0;
  $scope.selectedPostYear = null;
  $scope.selectedTripYear = null;
  $scope.years = [];

  for (let year = 2023; year <= 2100; year++) {
    $scope.years.push(year);
  }

  $scope.fetchPostsByYear = function (year) {
    if (year) {
      ApiService.fetchPostsByYear(year).then(function (response) {
        $scope.postCount = response.data.totalPosts;
        console.log("Total posts for the year: " + $scope.postCount);
      }, function (error) {
        console.error("Error fetching posts count:", error);
      });
    }
  };

  $scope.fetchTripsByYear = function (year) {
    if (year) {
      ApiService.fetchTripsByYear(year).then(function (response) {
        $scope.tripCount = response.data.completedTrips;
        console.log("Total trips for the year: " + $scope.tripCount);
      }, function (error) {
        console.error("Error fetching trips count:", error);
      });
    }
  };
});
