const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("E-Mail address already exists!");
        }
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Password must be longer than 3 character."),
    body("name").trim().not().isEmpty().withMessage("Name can not be empty."),
  ],
  authController.signup
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email."),
    body("password")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Password must be longer than 3 character."),
  ],
  authController.login
);

module.exports = router;
