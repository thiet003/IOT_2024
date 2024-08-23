const Sensor = require('../models/sensors.model');

const getAllSenSor = async (req, res) => {
  try {
    // Page, limit
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Start date, end date (adjust for UTC+7)
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    if ((startDate && isNaN(startDate.getTime())) || (endDate && isNaN(endDate.getTime()))) {
      return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
    }
    // Adjust for UTC+7
    const timeZoneOffset = -7 * 60; // UTC+7 in minutes
    if (startDate) {
      startDate.setMinutes(startDate.getMinutes() - startDate.getTimezoneOffset() - timeZoneOffset);
      startDate.setHours(0, 0, 0, 0); // Set to the beginning of the day
    }
    if (endDate) {
      endDate.setMinutes(endDate.getMinutes() - endDate.getTimezoneOffset() - timeZoneOffset);
      endDate.setHours(23, 59, 59, 999); // Set to the end of the day
    }
    // Query object
    const query = {};
    // Time range filtering by 'date' field
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }
    // Search by keyword in specific fields
    const keyword = req.query.keyword;
    const searchBy = req.query.searchBy;
    if (keyword) {
      if (searchBy === "all") {
        // Search across temperature, humidity, and light fields
        query.$or = [
          { temperature: parseFloat(keyword) },
          { humidity: parseFloat(keyword) },
          { light: parseFloat(keyword) },
        ];
      } else if (["temperature", "humidity", "light"].includes(searchBy)) {
        // Search in the specific field
        query[searchBy] = parseFloat(keyword);
      } else {
        return res.status(400).json({
          error: "Invalid searchBy parameter. Use 'temperature', 'humidity', 'light', or 'all'.",
        });
      }
    }
    // Sorting and pagination
    const sortBy = req.query.sortBy || "date"; // Default sort by 'date'
    const typeSort = req.query.typeSort === "asc" ? -1 : 1; // Default to descending order for most recent first

    // Query the database
    const sensors = await Sensor.find(query)
      .sort({ [sortBy]: typeSort }) // Sort by the specified field and order
      .skip(skip)
      .limit(limit);
    // Count total documents
    const total = await Sensor.countDocuments(query);

    // Return results with pagination info
    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      results: sensors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = getAllSenSor;
