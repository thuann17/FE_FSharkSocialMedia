var app = angular.module('tripApp', []);
app.controller('TripController', function ($scope) {
    $scope.trips = [];
    $scope.trip = {};
    $scope.isEditing = false;
    $scope.editIndex = -1;

    $scope.addOrUpdateTrip = function () {
        if ($scope.isEditing) {
            $scope.trips[$scope.editIndex] = angular.copy($scope.trip);
            $scope.isEditing = false;
        } else {
            $scope.trips.push(angular.copy($scope.trip));
        }
        $scope.resetForm();
    };

    $scope.editTrip = function (trip, index) {
        $scope.trip = angular.copy(trip);
        $scope.isEditing = true;
        $scope.editIndex = index;
    };

    $scope.deleteTrip = function (index) {
        $scope.trips.splice(index, 1);
    };

    $scope.resetForm = function () {
        $scope.trip = {};
        $scope.isEditing = false;
        $scope.editIndex = -1;
    };
});