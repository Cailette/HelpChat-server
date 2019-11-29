const chatModel = require('../../database/models/chats');
const userService = require('../services/users');
var moment = require('moment');
var mongoose = require('mongoose');

module.exports = {
    getChatsStatistics: async function(selected, filterChatAgent, filterChatDate) {
        let result = [];
        const { match, dateFormat } = this.getChatMatch(filterChatAgent, filterChatDate);
        const timeInterval = this.getTimeInterval(filterChatDate);

        const statistics = await this.getStatistics(selected, match, dateFormat);

        if(statistics){
            for (let time of timeInterval) {
                let data = statistics.find(d => d._id === time);
                result.push({
                    time: time,
                    data: data ? data.data : null,
                });
            }
        }
        
        return result;
    },

    getAgentsStatistics: async function(representative, selected, filterChatAgent, filterChatDate) {
        let match = await this.getAgentMatch(filterChatAgent, filterChatDate, representative);
        let statistics = await this.getStatistics(selected, match);
        return statistics;
    },

    getStatistics: async function(selected, match, dateFormat){
        switch (selected) {
            case 'all':
                return this.allChats(match, dateFormat);
            case 'satisfaction':
                return this.satisfaction(match, dateFormat);
            case 'activity':
                return this.activity(match);
            case 'workHours':
                return this.workHours(match);
            default:
                return null;
          }
    },

    getTimeInterval: function(time){
        time = JSON.parse(time)
        let from = "", to = "";

        if(time["from"] !== undefined && time["to"] !== undefined){
            to = new Date(time["to"]);
            from = new Date(time["from"]);
        } 

        if(time["from"] === undefined && time["to"] === undefined){
            to = new Date();
            from = new Date(time);
        }

        var day = new Date();
        day.setDate(day.getDate() - 2);
        
        if(from > day) {
            var timeArray = [];
            for (var i = 0; i < 24; i++) {
                timeArray.push((i < 10 ? "0" + i : i) + ":00");
            }
            return timeArray;
        } else {
            var timeArray = [];
            var current = moment(from).add(1, 'days');
            to = moment(to);
            while (current <= to) {
                timeArray.push( moment(current).format('DD-MM-YYYY') )
                current = moment(current).add(1, 'days');
            }
            return timeArray;
        }
    },

    getChatMatch: function(filterChatAgent, filterChatDate){
        let match = {};
        let dateFormat = "%d-%m-%Y" 

        filterChatDate = JSON.parse(filterChatDate)

        if(filterChatDate["from"] !== undefined && filterChatDate["to"] !== undefined){
            var from = new Date(filterChatDate["from"]);
            var to = new Date(filterChatDate["to"]);

            match.date = { 
                $gte: from, 
                $lte: to
            } 

            var day = new Date();
            day.setDate(day.getDate() - 2);
            if(from > day) {
                dateFormat = "%H:00"
            }
        } 

        if(filterChatDate["from"] === undefined && filterChatDate["to"] === undefined){
            var date = new Date(filterChatDate);
            match.date = { 
                $gte: date,
            }
            var day = new Date();
            day.setDate(day.getDate() - 2);
            if(date > day) {
                dateFormat = "%H"
            }
        }

        if(filterChatAgent !== 'all'){
            match.agent = mongoose.Types.ObjectId(filterChatAgent)
        }

        return {match, dateFormat}
    },

    getAgentMatch: async function(filterChatAgent, filterChatDate, representative){
        let match = {};

        if(filterChatAgent !== 'all'){
            match.agents = [{_id: mongoose.Types.ObjectId(filterChatAgent)}];
        } else {
            var agents = await userService.findAllByRepresentative(representative)
            match.agents = [...agents];
        } 

        if(filterChatDate === 'all'){
            match.date = null;
            return match;
        }

        filterChatDate = JSON.parse(filterChatDate)

        if(filterChatDate["from"] !== undefined && filterChatDate["to"] !== undefined){
            var from = new Date(filterChatDate["from"]);
            var to = new Date(filterChatDate["to"]);

            match.date = { $gte: from, $lte: to };
        }

        if(filterChatDate["from"] === undefined && filterChatDate["to"] === undefined){
            var date = new Date(filterChatDate);
            match.date =  { $gte: date };
        }

        return match
    },

    allChats: async function(match, dateFormat){
        let allChats = await chatModel.aggregate([
            { $match: match },
            { $group: { _id: { $dateToString: { format: dateFormat, date: "$date" } }, 
                        data: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ])
        return allChats;
    },

    satisfaction: async function(match, dateFormat){
        let satisfaction = await chatModel.aggregate([
            { $match: match },
            { $group: { _id: { $dateToString: { format: dateFormat, date: "$date" } }, 
                        data: { $avg: "$rating" } } },
            { $sort: { _id: 1 } }
        ])
        return satisfaction;
    },

    activity: async function(match){
        let statistics = []
        let activityStatistics = []
        for (let agent of match.agents) {
            statistics.push( await userService.findActivityById(agent._id, match.date) )
        }

        if(statistics){
            statistics.map(s => {
                activityStatistics.push({
                    agent: {
                        _id : s._id,
                        firstname : s.firstname,
                        lastname : s.lastname,
                    },
                    data: s.activities
                });
            });
        }

        return activityStatistics;
    },

    workHours: async function(match){
        let statistics = []
        let workStatistics = []
        
        for (let agent of match.agents) {
            statistics.push( await userService.findWorkHoursById(agent._id, match.date) )
        }

        if(statistics){
            statistics.map(s => {                
                workStatistics.push({
                    agent: {
                        _id : s._id,
                        firstname : s.firstname,
                        lastname : s.lastname,
                    },
                    data: s.workHours
                });
            });
        }
        
        return workStatistics;
    },
}