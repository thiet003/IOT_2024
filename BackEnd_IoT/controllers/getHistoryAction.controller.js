const Action = require('../models/actions.model');
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
// Lấy lịch sử hành động, có phân trang, tìm kiếm từ ngày này đến ngày khác
const getHistoryAction = async (req, res) => {
    // Page, limit
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    console.log("Page: ", page);
    console.log("Limit: ", limit);
    
    // Time ở dạng DD/MM/YYYY HH:mm:ss và múi giờ GMT+7
    let time = req.query.time;
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
    
    const sensorName = req.query.sensorName;
    // Query object    
    console.log("Start date: ", formattedUTCDateStart);
    console.log("End date: ", formattedUTCDateEnd);
    console.log(time);
    
    if ((!formattedUTCDateStart || !formattedUTCDateEnd) && time) {
        formattedUTCDateStart = "2021-09-02T08:17:10.000Z";
        formattedUTCDateEnd = "2021-09-02T08:17:11.000Z";
    }
    const query = {};
    if (sensorName) query.sensorName = sensorName;
    if (formattedUTCDateStart && formattedUTCDateEnd) {
        query.date = {
            $gte: formattedUTCDateStart,
            $lt: formattedUTCDateEnd
        };
    }
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
