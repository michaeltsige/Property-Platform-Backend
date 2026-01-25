const User = require("../models/User");
const Property = require("../models/Property");
const { AppError } = require("../utils/errorHandler");

// @desc    Get system metrics
// @route   GET /api/admin/metrics
// @access  Private (admin only)
const getMetrics = async (req, res, next) => {
  try {
    // Get user counts by role
    const userCounts = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    // Get property counts by status
    const propertyCounts = await Property.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Get recent properties
    const recentProperties = await Property.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get total views () add this field later if time allows)
    const totalViews = 0;

    // Format data
    const userStats = {};
    userCounts.forEach((stat) => {
      userStats[stat._id] = stat.count;
    });

    const propertyStats = {};
    propertyCounts.forEach((stat) => {
      propertyStats[stat._id] = stat.count;
    });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: Object.values(userStats).reduce((a, b) => a + b, 0),
          byRole: userStats,
        },
        properties: {
          total: Object.values(propertyStats).reduce((a, b) => a + b, 0),
          byStatus: propertyStats,
        },
        recentProperties,
        totalViews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Disable/Enable property
// @route   PUT /api/admin/properties/:id/toggle
// @access  Private (admin only)
const toggleProperty = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    const { action } = req.body; // 'disable' or 'enable'

    const property = await Property.findById(propertyId);

    if (!property) {
      throw new AppError("Property not found", 404);
    }

    if (action === "disable") {
      property.status = "archived";
      await property.save();

      res.status(200).json({
        success: true,
        message: "Property disabled successfully",
      });
    } else if (action === "enable") {
      property.status = "published";
      await property.save();

      res.status(200).json({
        success: true,
        message: "Property enabled successfully",
      });
    } else {
      throw new AppError('Invalid action. Use "disable" or "enable"', 400);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin only)
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all properties (including drafts and archived)
// @route   GET /api/admin/properties
// @access  Private (admin only)
const getAllProperties = async (req, res, next) => {
  try {
    const properties = await Property.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMetrics,
  toggleProperty,
  getUsers,
  getAllProperties,
};
