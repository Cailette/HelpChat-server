const StatisticsService = require('../../buisnessLogic/services/statistics')

module.exports = {
    getStatistics: async function(req, res) {
        console.log("req.params.selected, req.params.filterChatAgent, req.params.filterChatDate "+ req.params.selected + " " + req.params.filterChatAgent + " " + req.params.filterChatDate)
        const statistics = await StatisticsService.get(req.params.selected, req.params.filterChatAgent, req.params.filterChatDate)

        if(!statistics) {
            return res.status(400).json({
                message: "Something went wrong!"
            });
        }

        return res.status(200).json({
            status: 200, 
            message: "Chat updated successfully!", 
            statistics: statistics
        });
    },
}