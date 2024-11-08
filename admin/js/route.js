var app = angular.module("myApp", ["ngRoute"]);
// Service để quản lý xác thực
app.service("AuthService", function ($window) {
  this.getToken = function () {
    return $window.localStorage.getItem("token"); // Lấy token từ localStorage
  };
  this.isLoggedIn = function () {
    return !!this.getToken(); // Kiểm tra có token hay không
  };
  this.logout = function () {
    $window.localStorage.removeItem("token"); // Xóa token khỏi localStorage
  };
});

// Interceptor để thêm token vào request và xử lý lỗi xác thực
app.factory("AuthInterceptor", function ($q, $location, AuthService) {
  return {
    request: function (config) {
      const token = AuthService.getToken(); // Lấy token nếu có
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Đính kèm token vào header
      }
      return config;
    },
    responseError: function (response) {
      if (response.status === 401) {
        // Nếu lỗi 401
        AuthService.logout(); // Xóa thông tin đăng nhập
        $location.path("/login"); // Chuyển hướng đến trang đăng nhập
      }
      return $q.reject(response);
    },
  };
});

app.constant("API", "http://localhost:8080/api/");
// Cấu hình route và các route cụ thể
app.config(function ($routeProvider, $locationProvider) {
  // Định nghĩa các route trong một mảng
  const routes = [
    {
      path: "/dashboard",
      template: "admin/assets/dashboard.html",
      controller: "dashboardController",
    },
    {
      path: "/account",
      template: "admin/assets/account.html",
      controller: "accountCtrl",
    },
    {
      path: "/post",
      template: "/admin/assets/content.html",
      controller: "postCtrl",
    },
    {
      path: "/account/:username",
      templateUrl: "/admin/assets/profile.html",
      controller: "profileCtrl",
    },
    {
      path: "/post/:postId",
      templateUrl: "/admin/assets/contentdetail.html",
      controller: "postDetailCtrl",
    },
  ];

  // Lặp qua mảng để cấu hình các route
  routes.forEach((route) => {
    $routeProvider.when(route.path, {
      templateUrl: `${route.template}`,
      controller: route.controller,
    });
  });

  // Đường dẫn mặc định
  $routeProvider.otherwise({
    redirectTo: "/dashboard",
  });

  // Cấu hình html5Mode
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false,
  });
});
