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

    getMatch(filterChatAgent, filterChatDate){
        let match = {};
        let dateFormat = "%d-%m-%Y"

        filterChatDate = JSON.parse(filterChatDate)

        if(filterChatDate["from"] !== undefined && filterChatDate["to"] !== undefined){
            var from = new Date(filterChatDate["from"]);
            var to = new Date(filterChatDate["to"]);

            match.date = { 
                $gt: from, 
                $lt: to
            } 

            var day = new Date();
            day.setDate(day.getDate() - 2);
            if(from > day) {
                dateFormat = "%H"
            }
        } 

        if(filterChatDate["from"] === undefined && filterChatDate["to"] === undefined){
            var date = new Date(filterChatDate);
            match.date = { 
                $gt: date,
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
        console.log(allChats)
        return allChats;
    },

    satisfaction: async function(match, dateFormat){
        let satisfaction = await chatModel.aggregate([
            { $match: match },
            { $group: { _id: { $dateToString: { format: dateFormat, date: "$date" } }, data: { $avg: "$rating" } } },
            { $sort: { _id: 1 } }
        ])
        console.log(satisfaction)
        return satisfaction;
    },

    availability: async function(match, dateFormat){
        
    },

    chatTime: async function(match, dateFormat){
        
    },

    ativity: async function(match, dateFormat){
        
    },

    workHours: async function(match, dateFormat){
        
    },





}