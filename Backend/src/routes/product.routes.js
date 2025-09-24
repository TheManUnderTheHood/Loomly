import { Router } from "express";
import {
  createProduct,
  getProductById,
  getProductsByCategory,
  getAllProducts,
  updateProduct, // +++ IMPORT +++
  deleteProduct, // +++ IMPORT +++
} from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// --- Public Routes ---
router.route("/").get(getAllProducts);
router.route("/id/:productId").get(getProductById);
router.route("/style/:styleSlug").get(getProductsByCategory);

// --- Admin Only Routes ---
router
  .route("/create")
  .post(verifyJWT, verifyAdmin, upload.single("productImage"), createProduct);

// +++ NEW: Update and Delete routes +++
router
  .route("/:productId")
  .patch(verifyJWT, verifyAdmin, updateProduct) // PATCH is for partial updates
  .delete(verifyJWT, verifyAdmin, deleteProduct);

export default router;