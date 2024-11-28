app.controller("scheduleCtrl", function ($scope, $routeParams, AboutService, FriendService) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    $scope.currentDate = new Date();
    $scope.today = $scope.currentDate.getDate();
    $scope.dayHeaders = dayHeaders;
    $scope.notes = {}; // Object để lưu ghi chú
    $scope.selectedDay = null; // Ngày được chọn
    $scope.currentNote = ""; // Ghi chú hiện tại

    // Cập nhật lịch
    $scope.updateCalendar = function () {
        const month = $scope.currentDate.getMonth();
        const year = $scope.currentDate.getFullYear();

        $scope.monthYear = `${monthNames[month]} ${year}`;
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Tạo danh sách ngày trong tháng
        $scope.calendarDays = new Array(firstDayOfMonth).fill(null); // Ô trống
        for (let day = 1; day <= daysInMonth; day++) {
            $scope.calendarDays.push(day);
        }
    };

    // Thay đổi tháng
    $scope.changeMonth = function (offset) {
        $scope.currentDate.setMonth($scope.currentDate.getMonth() + offset);
        $scope.updateCalendar();
    };

    // Chọn ngày và mở modal
    $scope.selectDay = function(day) {
        if (day) {
            $scope.selectedDay = day;
            const noteKey = `${$scope.monthYear}-${day}`;
            $scope.currentNote = $scope.notes[noteKey] || ""; // Lấy ghi chú nếu có
        }
    };
    
    $scope.saveNote = function() {
        const noteKey = `${$scope.monthYear}-${$scope.selectedDay}`;
        $scope.notes[noteKey] = $scope.currentNote;
        $scope.closeModal();
    };
    // Đóng modal
    $scope.closeModal = function () {
        $scope.selectedDay = null;
        $scope.currentNote = "";
    };

    $scope.getDayClasses = function(day) {
        return {
            'empty-day': !day,
            'day': day,
            'today': day === $scope.today,
            'highlighted-note': $scope.notes[$scope.monthYear + '-' + day] // Highlight note
        };
    };
    // Khởi tạo lịch
    $scope.updateCalendar();
});