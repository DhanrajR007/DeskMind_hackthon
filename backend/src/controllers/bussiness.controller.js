const clientModel = require("../models/clientBusiness.model");
const bcrypt = require("bcrypt");

const createBusinessController = async (req, res) => {
  try {
    const { businessName, businessEmail, businessPassword, planType } =
      req.body;

    // Assuming ownerId is extracted from the authenticated user by a middleware
    const ownerId = req.user._id;

    if (!businessName || !businessEmail || !businessPassword) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const existingBusiness = await clientModel.findOne({ businessEmail });
    if (existingBusiness) {
      return res.status(422).json({
        message:
          "Business account already created with this email, please choose another email",
      });
    }

    const hashedPassword = await bcrypt.hash(businessPassword, 10);

    const business = await clientModel.create({
      businessName,
      businessEmail,
      businessPassword: hashedPassword,
      ownerId,
      planType,
    });

    res.status(201).json({
      message: "Business created successfully",
      business: {
        _id: business._id,
        businessName: business.businessName,
        businessEmail: business.businessEmail,
        ownerId: business.ownerId,
        planType: business.planType,
        isActive: business.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const getBusinessController = async (req, res) => {
  try {
    const businessId = req.params.id;
    const business = await clientModel.findById(businessId);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Ensure only the owner can get the details
    if (business.ownerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this business" });
    }

    res.status(200).json({ business });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const getAllBusinessController = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const businesses = await clientModel.find({ ownerId });

    res.status(200).json({ businesses });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const updateBusinessController = async (req, res) => {
  try {
    const businessId = req.params.id;
    const updateData = req.body;

    // Prevent updating the password directly through this route
    if (updateData.businessPassword) {
      delete updateData.businessPassword;
    }

    const business = await clientModel.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    if (business.ownerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this business" });
    }

    const updatedBusiness = await clientModel.findByIdAndUpdate(
      businessId,
      updateData,
      { new: true, runValidators: true },
    );

    res.status(200).json({
      message: "Business updated successfully",
      business: updatedBusiness,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const deleteBusinessController = async (req, res) => {
  try {
    const businessId = req.params.id;

    const business = await clientModel.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    if (business.ownerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this business" });
    }

    await clientModel.findByIdAndDelete(businessId);

    res.status(200).json({ message: "Business deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  createBusinessController,
  getBusinessController,
  getAllBusinessController,
  updateBusinessController,
  deleteBusinessController,
};
