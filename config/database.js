const mongoose = require('mongoose');
const uri = 'mongodb+srv://helpchat-user:helpchat-password@helpchatcluster-4sef9.mongodb.net/helpchat?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true }).catch((error) => { console.log(error); });

module.exports = mongoose;