import User from "../model/User.js";

const isAdmin = async (req, res, next) => {
  //find the logged in user
  const user = await User.findById(req.userAuthId);
  //check if Admin
  if (user.isAdmin) {
    next();
  } else {
    next(new Error("Access denied, admin only"));
  }
};

export default isAdmin;
