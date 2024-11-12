app.service("AboutService", function ($http, API) {
     // Lấy tài khoản theo username
     this.fetchAccounts = function(username) {
        // API URL with the username
        let url = `${API}useraccount/${username}`;  // Use backticks for string interpolation

        return $http.get(url);  // Return the HTTP GET request promise
    };



    this.getPostsWithImages = function(username) {
      return $http.get('http://localhost:8080/api/posts', {  // API endpoint để lấy bài đăng theo username
          params: { username: username }  // Truyền params vào request
      });
  };


    // Cập nhật trạng thái tài khoản
    this.updateAccountStatus = function (username, status) {
      return $http.put(`${API}account/${username}`, { active: status });
    };
    this.fetchPosts = function (keyword, page, pageSize) {
      let url = `${API}post?page=${page - 1}&size=${pageSize}`;
      if (keyword) {
        url += "&search=" + encodeURIComponent(keyword);
      }
      return $http.get(url);
    };
    // Cập nhật trạng thái bài đăng
    this.fetchUpdateStatusPost = function (postId, status) {
      return $http.put(`${API}post/${postId}`, { active: status });
    };
    //  lấy năm
    this.fetchPostsByYear = function (year) {
      return $http.get(`${API}admin/countpostyear/${year}`);
    };
    //  lấy năm
    this.fetchTripsByYear = function (year) {
      return $http.get(`${API}admin/counttripyear/${year}`);
    };
    // Lấy username để hiện thông tin chi tiết user
    this.fetchUserByUsername = function (username) {
      return $http.get(`${API}profile/${username}`);
    };
    // Lấy ID để hiện thông tin chi tiết bài đăng
    this.fetchPostById = function (postId) {
      return $http.get(`${API}post/${postId}`);
    };
    // Lấy Post theo username
    this.fetchUserPosts = function (username) {
      let url = `${API}profile/${username}/posts`;
      return $http.get(url);
    };
  });
  