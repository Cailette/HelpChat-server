const mongoose = require('mongoose');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.mongodb.net/helpchat?retryWrites=true&w=majority`;


mongoose.connect(uri, { useNewUrlParser: true }).catch((error) => { console.log(error); });

module.exports = mongoose;