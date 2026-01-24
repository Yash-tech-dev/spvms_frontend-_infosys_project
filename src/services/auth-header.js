export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    // Spring Boot Security usually expects 'Bearer ' prefix
    return { Authorization: 'Bearer ' + user.token }; 
  } else {
    return {};
  }
}