const { validationResult } = require("express-validator");
const Zone = require("../models/zone");
const pointInPolygonNested = require("../utils/nested");

exports.getZones = async (req, res, next) => {
  try {
    const zones = await Zone.find().sort("-createdAt");
    res.status(200).json({
      message: "Fetched zones successfully.",
      zones: zones,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createZone = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.errors[0].msg);
      error.statusCode = 422;
      next(error);
      return;
    }

    const name = req.body.name;
    const zone = new Zone({
      name,
      coordinates: req.body.coordinates,
      user: req.userId,
    });
    await zone.save();
    res.status(201).json({
      message: "Zone created successfully!",
      zone: zone,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getZone = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.errors[0].msg);
      error.statusCode = 422;
      next(error);
      return;
    }
    const x = req.body.x;
    const y = req.body.y;

    const zones = await Zone.find({ user: req.userId });

    if (zones.length === 0) {
      const error = new Error("Please Create Zone First.");
      error.statusCode = 404;
      next(error);
      return;
    }

    for (let i = 0; i < zones.length; i++) {
      const result = pointInPolygonNested([x, y], zones[i].coordinates);
      if (result)
        return res
          .status(200)
          .json({ message: "Point fetched in .", zone: zones[i] });
    }

    res.status(200).json({ message: "Point Not fetched in your zones." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateZone = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.errors[0].msg);
      error.statusCode = 422;
      next(error);
      return;
    }

    const zoneId = req.params.zoneId;

    const zone = await Zone.findById(zoneId);
    if (!zone) {
      const error = new Error("Could not find Zone.");
      error.statusCode = 404;
      next(error);
      return;
    }
    if (zone.user.toString() !== req.userId) {
      const error = new Error("Not authorized!, You can edit Your Zone Only");
      error.statusCode = 403;
      next(error);
      return;
    }

    const name = req.body.name;
    const coordinates = req.body.coordinates;
    if (name) zone.name = name;
    if (coordinates) zone.coordinates = coordinates;
    const updatedZone = await zone.save();

    res.status(200).json({ message: "Zone updated!", zone: updatedZone });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteZone = async (req, res, next) => {
  try {
    const zoneId = req.params.zoneId;
    const zone = await Zone.findById(zoneId);
    if (!zone) {
      const error = new Error("Could not find Zone.");
      error.statusCode = 404;
      next(error);
      return;
    }
    if (zone.user.toString() !== req.userId) {
      const error = new Error("Not authorized!,You can delete Your Zone Only");
      error.statusCode = 403;
      next(error);
      return;
    }

    await Zone.findByIdAndRemove(zoneId);
    res.status(200).json({ message: "Deleted Zone." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
