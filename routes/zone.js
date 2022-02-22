const express = require("express");
const { body } = require("express-validator");

const zoneController = require("../controllers/zone");
const isAuth = require("../middlware/is-auth");

const router = express.Router();

router.get("/", isAuth, zoneController.getZones);

router.post(
  "/create",
  isAuth,
  [
    body("name")
      .not()
      .isEmpty()
      .withMessage(`name can not be empty`)
      .isString()
      .withMessage(`name must be String`),
    body("coordinates")
      .isArray({ min: 3 })
      .withMessage(
        `coordinates must be  min: 3  Point of  [x,y]. like [[x1, y1],[x2, y2],[x3, y3],[x4, y4],[x5, y5]]`
      ),
  ],
  zoneController.createZone
);

router.get(
  "/point",
  isAuth,
  [
    body("x")
      .not()
      .isEmpty()
      .withMessage(`x can not be empty`)
      .isNumeric()
      .withMessage(`x must be Numeric`),
    body("y")
      .not()
      .isEmpty()
      .withMessage(`y can not be empty`)
      .isNumeric()
      .withMessage(`y must be Numeric`),
  ],
  zoneController.getZone
);

router.put(
  "/:zoneId",
  isAuth,
  [
    body("name").optional().isString().withMessage(`name must be String`),
    body("coordinates")
      .optional()
      .isArray({ min: 3 })
      .withMessage(
        `coordinates must be  min: 3  Point of  [x,y]. like [[x1, y1],[x2, y2],[x3, y3],[x4, y4],[x5, y5]]`
      ),
  ],
  zoneController.updateZone
);

router.delete("/:zoneId", isAuth, zoneController.deleteZone);

module.exports = router;
