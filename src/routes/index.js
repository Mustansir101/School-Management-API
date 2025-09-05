import express from "express";
import { pool } from "../database/index.js";
import calculateDistance from "../utils.js";

const router = express.Router();

// Add School API
router.post("/addSchool", async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Validation
    if (!name || !address || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, address, latitude, longitude",
      });
    }

    // Validate data types
    if (typeof name !== "string" || typeof address !== "string") {
      return res.status(400).json({
        success: false,
        message: "Name and address must be strings",
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude must be valid numbers",
      });
    }

    // Validate coordinate ranges
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid coordinates. Latitude: -90 to 90, Longitude: -180 to 180",
      });
    }

    // Insert into database
    const [result] = await pool.query(
      `INSERT INTO schools (name, address, latitude, longitude) 
      VALUES ('${name.trim()}', '${address.trim()}', ${lat}, ${lng})`
    );

    res.status(201).json({
      success: true,
      message: "School added successfully",
      data: {
        id: result.insertId,
        name: name.trim(),
        address: address.trim(),
        latitude: lat,
        longitude: lng,
      },
    });
  } catch (error) {
    console.error("Error adding school:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// List Schools API
router.get("/listSchools", async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    // Validation
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "User latitude and longitude are required as query parameters",
      });
    }

    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);

    if (isNaN(userLat) || isNaN(userLng)) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude must be valid numbers",
      });
    }

    // Validate coordinate ranges
    if (userLat < -90 || userLat > 90 || userLng < -180 || userLng > 180) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid coordinates. Latitude: -90 to 90, Longitude: -180 to 180",
      });
    }

    // Fetch all schools
    const query = "SELECT id, name, address, latitude, longitude FROM schools";
    const [schools] = await pool.execute(query);

    if (schools.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No schools found",
        data: [],
      });
    }

    // Calculate distance for each school and store in new array
    const schoolsWithDistance = schools.map((school) => {
      const distance = calculateDistance(
        userLat,
        userLng,
        school.latitude,
        school.longitude
      );
      return {
        ...school,
        distance: Math.round(distance * 100) / 100,
      };
    });

    // Sort by distance (closest first)
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      message: "Schools retrieved and sorted by proximity",
      data: schoolsWithDistance,
    });
  } catch (error) {
    console.error("Error listing schools:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
