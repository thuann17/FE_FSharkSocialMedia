
app.service("PostService", function ($http, API) {
    //lấy danh sach bài đăng 
    this.getPostsWithImages = function(username) {
        return $http.get('http://localhost:8080/api/posts', {  // API endpoint để lấy bài đăng theo username
            params: { username: username }  // Truyền params vào request
        });
    };


   
 });
 