const adminauth = (user, pass) => {
  if (user === "sai" && pass === "123") {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  adminauth,
};
