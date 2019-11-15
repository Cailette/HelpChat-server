const activityModel = require('../../database/models/activities');
const userModel = require('../../database/models/users');
const workHoursModel = require('../../database/models/workHours');
const visitorModel = require('../../database/models/visitors');
const chatModel = require('../../database/models/chats');
var moment = require('moment');
var mongoose = require('mongoose');

module.exports = {
    get: async function(selected, filterChatAgent, filterChatDate) {
        let {match, dateFormat} = this.getMatch(filterChatAgent, filterChatDate);
        let timeInterval = this.getTimeInterval(filterChatDate);
        let statistics = await this.getStatistics(selected, match, dateFormat);
        let result = [];
        for (let time of timeInterval) {
            var data = statistics.find(d => d._id === time);
            result.push({
                time: time,
                data: data ? data.data : null,
            });
        }
        console.log(result)
        return result;
    },

    getStatistics: async function(selected, match, dateFormat){
        switch (selected) {
            case 'all':
                return this.allChats(match, dateFormat);
            case 'satisfaction':
                return this.satisfaction(match, dateFormat);
            case 'availability':
                return this.availability(match, dateFormat);
            case 'chatTime':
                return this.chatTime(match, dateFormat);
            case 'ativity':
                return this.ativity(match, dateFormat);
            case 'workHours':
                return this.workHours(match, dateFormat);
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

    getMatch: function(filterChatAgent, filterChatDate){
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

    allChats: async function(match, dateFormat){
        let allChats = await chatModel.aggregate([
            { $match: match },
            { $group: { _id: { $dateToString: { format: dateFormat, date: "$date" } }, data: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ])
        return allChats;
    },

    satisfaction: async function(match, dateFormat){
        let satisfaction = await chatModel.aggregate([
            { $match: match },
            { $group: { _id: { $dateToString: { format: dateFormat, date: "$date" } }, data: { $avg: "$rating" } } },
            { $sort: { _id: 1 } }
        ])
        return satisfaction;
    },

    availability: async function(match, dateFormat){
        return "";
    },

    chatTime: async function(match, dateFormat){
        return "";
        
    },

    ativity: async function(match, dateFormat){
        return "";
        
    },

    workHours: async function(match, dateFormat){
        return "";
        
    },





}