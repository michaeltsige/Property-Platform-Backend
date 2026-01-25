const Favorite = require("../models/Favorite");
const Property = require("../models/Property");
const { AppError } = require("../utils/errorHandler");

// @desc    Add property to favorites
// @route   POST /api/favorites/:propertyId
// @access  Private (users only)
const addFavorite = async (req, res, next) => {
  try {
    const propertyId = req.params.propertyId;
    const userId = req.user.id;

    // Check if property exists and is published
    const property = await Property.findOne({
      _id: propertyId,
      status: "published",
    });

    if (!property) {
      throw new AppError("Property not found or not published", 404);
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: userId,
      property: propertyId,
    });

    if (existingFavorite) {
      throw new AppError("Property already in favorites", 400);
    }

    // Create favorite
    const favorite = await Favorite.create({
      user: userId,
      property: propertyId,
    });

    res.status(201).json({
      success: true,
      data: favorite,
      message: "Added to favorites",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove property from favorites
// @route   DELETE /api/favorites/:propertyId
// @access  Private (users only)
const removeFavorite = async (req, res, next) => {
  try {
    const propertyId = req.params.propertyId;
    const userId = req.user.id;

    const favorite = await Favorite.findOneAndDelete({
      user: userId,
      property: propertyId,
    });

    if (!favorite) {
      throw new AppError("Favorite not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Removed from favorites",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Private (users only)
const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.find({ user: userId })
      .populate({
        path: "property",
        match: { status: "published" }, // Only get published properties
        populate: {
          path: "owner",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    // Filter out null properties (if property was deleted or unpublished)
    const validFavorites = favorites.filter((fav) => fav.property);

    res.status(200).json({
      success: true,
      count: validFavorites.length,
      data: validFavorites.map((fav) => ({
        ...fav.property.toObject(),
        favoritedAt: fav.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if property is favorited
// @route   GET /api/favorites/check/:propertyId
// @access  Private (users only)
const checkFavorite = async (req, res, next) => {
  try {
    const propertyId = req.params.propertyId;
    const userId = req.user.id;

    const favorite = await Favorite.findOne({
      user: userId,
      property: propertyId,
    });

    res.status(200).json({
      success: true,
      data: {
        isFavorite: !!favorite,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite,
};
