angular.module("app").service("AuthService", function () {
  this.getRole = function () {
    const token = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="))
      .split("=")[1];
    if (token) {
      const decodedToken = jwt_decode(token);
      return decodedToken.role;
    }
    return null;
  };
});
