
export function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log("user****"+user);
  if (user && user.token) {
    console.log("user.token****"+user.token);
    console.log("user.username****"+user.username);
    return { Authorization: 'Bearer ' + user.token,username:user.username };
  } else {

    return {};
  }
}

