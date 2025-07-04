import TodoBoard from "../model/todoBoard.model.js";

const addNewActivityLog = async (activity) => {
    try {
        const { boardName, userId, action } = activity;

        if (!boardName || !userId || !action) {
            throw new Error("Board name, user ID, and action are required to add an activity log.");
        }

        const board = await TodoBoard.findOne({ boardName });
        if (!board) {
            throw new Error(`Board with name ${boardName} does not exist.`);
        }
        
        const newLog = {
            user: userId,
            action,
            timestamp: new Date(),
        };
        board.activityLogs.push(newLog);

        await board.save();
        console.log("Activity log added successfully:", newLog);
    } catch (error) {
        console.error("Error adding activity log:", error);
    }
};

export { addNewActivityLog };