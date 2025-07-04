import TodoBoard from "../model/todoBoard.model.js";


const createBoard = async (req, res) => {
    try {
        const { boardName } = req.body;

        const board = new TodoBoard({
            boardName
        })

        await board.save();
        return res.status(201).json({success: true, message: "Board created successfully", board});
    } catch (error) {
        console.error("Error creating board:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}

const fetchActivityLogs = async (req, res) => {
    try {
        const { boardName } = req.body;

        const board = await TodoBoard.findOne({ boardName }).select('activityLogs')
            .populate('activityLogs.user', 'username')
            .sort({ 'activityLogs.timestamp': -1 })
            .limit(20);

        return res.status(200).json({ success: true, activityLogs: board });
    } catch (error) {
        console.error("Error fetching activity logs:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export { createBoard, fetchActivityLogs };