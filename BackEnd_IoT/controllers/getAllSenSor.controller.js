const Sensor = require('../models/sensors.model');
const changeTimezone = (datStr) => {
  // Từ múi giờ GMT+7 chuyển về UTC
  // Datestring ở dạng DD/MM/YYYY HH:mm:ss
  // Regex để check xem có phải đúng định dạng không
  const dateRegex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/;
  if (!dateRegex.test(datStr)) {
      return null;
  }
  const date = datStr.split(" ")[0];
  const time = datStr.split(" ")[1];
  const dateParts = date.split("/");
  const timeParts = time.split(":");
  const dateObject = new Date(
      +dateParts[2],
      dateParts[1] - 1,
      +dateParts[0],
      +timeParts[0],
      +timeParts[1],
      +timeParts[2]
  );
  return dateObject;
  
};
const getAllSenSor = async (req, res) => {
  try {
    // Page, limit
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Time ở dạng DD/MM/YYYY HH:mm:ss và múi giờ GMT+7
    let time = req.query.keyword;
    // Trim time
    if (time) {
        time = time.trim();
    }
    let formattedUTCDateStart = null;
    let formattedUTCDateEnd = null;
    if(time)    
    {
        // Chuyển về dạng UTC ở dạng 2024-09-02T08:17:10.000Z
        formattedUTCDateStart = changeTimezone(time);
        if (formattedUTCDateStart) {
            formattedUTCDateEnd = new Date(formattedUTCDateStart);
            formattedUTCDateEnd.setSeconds(formattedUTCDateStart.getSeconds() + 1);
        }
    }
    // Query object
    const query = {};
    
    // Search by keyword in specific fields
    const keyword = req.query.keyword;
    const searchBy = req.query.searchBy;
    
    if (keyword) {
      if (searchBy === "all") {
        // Search across temperature, humidity, and light fields
        
        if (formattedUTCDateStart && formattedUTCDateEnd) {
          query.date = {
              $gte: formattedUTCDateStart,
              $lt: formattedUTCDateEnd
          };
        }
        else {
            query.$or = [
                { temperature: parseFloat(keyword) },
                { humidity: parseFloat(keyword) },
                { light: parseFloat(keyword) },
            ];
        }
      } else if (["temperature", "humidity", "light"].includes(searchBy)) {
        // Search in the specific field
        if(typeof parseFloat(keyword) === "number")
        {
          query[searchBy] = parseFloat(keyword);
        }
        else
        {
          formattedUTCDateStart = "2021-09-02T08:17:10.000Z";
          formattedUTCDateEnd = "2021-09-02T08:17:11.000Z";
          query.date = {
              $gte: formattedUTCDateStart,
              $lt: formattedUTCDateEnd
          };
        }
      }
      else if (searchBy === "date") {
        // Search in the specific field
        if (formattedUTCDateStart && formattedUTCDateEnd) {
          query.date = {
              $gte: formattedUTCDateStart,
              $lt: formattedUTCDateEnd
          };
      }
      else{
        formattedUTCDateStart = "2021-09-02T08:17:10.000Z";
        formattedUTCDateEnd = "2021-09-02T08:17:11.000Z";
        query.date = {
            $gte: formattedUTCDateStart,
            $lt: formattedUTCDateEnd
        };
      }
      }
      else {
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
