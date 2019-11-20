const StatisticsService = require('../../buisnessLogic/services/statistics')

module.exports = {
    getChatsStatistics: async function(req, res) {
        const statistics = await StatisticsService.getChatsStatistics(req.params.selected, req.params.filterChatAgent, req.params.filterChatDate)
        
        return res.status(200).json({
            message: "Statistics made successfully!", 
            statistics: statistics
        });
    },

    getAgentsStatistics: async function(req, res) {
        const statistics = await StatisticsService.getAgentsStatistics(req.body.id, req.params.selected, req.params.filterChatAgent, req.params.filterChatDate)
        
        return res.status(200).json({
            message: "Statistics made successfully!", 
            statistics: statistics
        });
    },
}