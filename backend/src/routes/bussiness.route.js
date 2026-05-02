const express = require("express");
const businessController = require("../controllers/bussiness.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  businessController.createBusinessController,
);
router.get("/:id", authMiddleware, businessController.getBusinessController);
router.get("/", authMiddleware, businessController.getAllBusinessController);
router.patch(
  "/:id",
  authMiddleware,
  businessController.updateBusinessController,
);
router.delete(
  "/:id",
  authMiddleware,
  businessController.deleteBusinessController,
);

module.exports = router;
