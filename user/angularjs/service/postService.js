app.service("PostService", function ($http, API) {
  //lấy bài đăng của 1 người dùng
  this.getPostsWithUserDetails = function (username) {
    return $http.get("http://localhost:8080/api/user/post/" + username);
  };

  this.likePost = function (postId, username) {
    const url = `${API}user/post/likes/${postId}?username=${username}`;
    return $http.post(url);
  };

  this.checkIfUserLiked = function (postId, username) {
    const url = `${API}user/post/has-liked/${postId}?username=${username}`;
    return $http.get(url);
  };

  this.removeLike = function (postId, username) {
    return $http
      .delete(`${API}user/post/likes/${postId}/${username}`)
      .then(function (response) {
        return response.data; // The backend now sends a JSON object
      })
      .catch(function (error) {
        console.error("Error unliking post:", error);
        throw error;
      });
  };

  this.getCommentsByPostId = function (postId) {
    const url = `${API}user/post/cmt/${postId}`;
    return $http.get(url);
  };

  this.getLikeCountByCommentId = function (commentId) {
    return $http.get(`${API}user/post/likecomment/${commentId}`);
  };

  this.checkLike = async function (commentId, username) {
    try {
      // Sử dụng commentId thay vì postId nếu mục đích là kiểm tra like cho comment
      const response = await $http.get(
        `${API}user/post/checkLike/${commentId}/${username}`
      );

      // Trả về dữ liệu phản hồi hoặc xử lý theo nhu cầu
      return response.data;
    } catch (error) {
      console.error("Error checking like status:", error);
      throw error; // Ném lỗi để có thể xử lý ở nơi gọi
    }
  };
});
