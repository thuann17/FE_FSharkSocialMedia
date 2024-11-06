var app = angular.module('scheduleApp', []);
app.controller('ScheduleController', function ($scope) {
    $scope.schedules = [];
    $scope.schedule = {};
    $scope.isEditing = false;
    $scope.editIndex = -1;

    $scope.addOrUpdateSchedule = function () {
        if ($scope.isEditing) {
            $scope.schedules[$scope.editIndex] = angular.copy($scope.schedule);
            $scope.isEditing = false;
        } else {
            $scope.schedules.push(angular.copy($scope.schedule));
        }
        $scope.resetForm();
    };

    $scope.editSchedule = function (schedule, index) {
        $scope.schedule = angular.copy(schedule);
        $scope.isEditing = true;
        $scope.editIndex = index;
    };

    $scope.deleteSchedule = function (index) {
        $scope.schedules.splice(index, 1);
    };

    $scope.resetForm = function () {
        $scope.schedule = {};
        $scope.isEditing = false;
        $scope.editIndex = -1;
    };
});