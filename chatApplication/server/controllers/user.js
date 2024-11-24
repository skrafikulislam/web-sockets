import UserModel from "../models/UserModel.js";

const fetchAllUsers = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const allUsers = await UserModel.find({
      _id: { $ne: loggedInUser },
    }).select("-password");
    return res
      .status(200)
      .json({
        message: "AllUsers Fetch Successfully",
        success: true,
        users: allUsers,
      });
  } catch (error) {
    console.error("Error in fetchAllUsers: " + error);
    res.status(500).json({ message: "Failed to fetch all users" });
  }
};

export { fetchAllUsers };
