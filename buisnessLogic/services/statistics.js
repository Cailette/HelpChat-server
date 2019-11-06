const workHours = require('./workHours');
const activity = require('./activity');
const chats = require('./chats');
const messages = require('./messages');
const users = require('./users');
const visitors = require('./visitors');

module.exports = {
    get: async function(selected, filterChatAgent, filterChatDate) {
        switch (selected) {
            case 'all':
                console.log('all');
                break;
            case 'satisfaction':
                console.log('satisfaction');
                break;
            case 'availability':
                console.log('availability');
                break;
            case 'chatTime':
                console.log('chatTime');
                break;
            case 'ativity':
                console.log('ativity');
                break;
            case 'workHours':
                console.log('workHours');
                break;
            default:
                console.log('default');
          }
          return "something";
    },
}