var app = angular.module('friendsApp', []);
app.controller('FriendsController', function ($scope) {
    $scope.friends = [];
    $scope.friend = {};
    $scope.isEditing = false;
    $scope.editIndex = -1;

    $scope.addOrUpdateFriend = function () {
        if ($scope.isEditing) {
            $scope.friends[$scope.editIndex] = angular.copy($scope.friend);
            $scope.isEditing = false;
        } else {
            $scope.friends.push(angular.copy($scope.friend));
        }
        $scope.resetForm();
    };

    $scope.editFriend = function (friend, index) {
        $scope.friend = angular.copy(friend);
        $scope.isEditing = true;
        $scope.editIndex = index;
    };

    $scope.deleteFriend = function (index) {
        $scope.friends.splice(index, 1);
    };

    $scope.resetForm = function () {
        $scope.friend = {};
        $scope.isEditing = false;
        $scope.editIndex = -1;
    };
});