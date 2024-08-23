const Action = require('../models/actions.model');

// Lấy lịch sử hành động, có phân trang, tìm kiếm từ ngày này đến ngày khác
const getHistoryAction = async (req, res) => {
    // Page, limit
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // Start date, end date
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    const sensorName = req.query.sensorName;
    if ((startDate && isNaN(startDate.getTime())) || (endDate && isNaN(endDate.getTime()))) {
        return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
    }
    if(startDate)
    {
        startDate.setHours(0, 0, 0, 0); // Set startDate to the beginning of the day
    }
    if (endDate) {
        endDate.setHours(23, 59, 59, 999); // Set endDate to the end of the day
    }
    // Query object    
    const query = {};
    if (sensorName) query.sensorName = sensorName;
    if (startDate && endDate) query.date = { $gte: startDate, $lte: endDate };
    try {
        const actions = await Action.find(query)
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalActions = await Action.countDocuments(query);

        res.status(200).json({
            totalActions,
            totalPages: Math.ceil(totalActions / limit),
            currentPage: page,
            actions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = getHistoryAction;
