const sendmail = require('sendmail')({silent: true});

module.exports = {
    sendMail: async function(sender, subject, text, recipient) {
        const mailOptions = {
            from: `${sender}`,
            to: `${recipient}`,
            subject: `${subject}`,
            text: `${text}`,
        };

        sendmail(mailOptions, function (err, reply) {
            if(err){
                console.log(err)
                return "";
            } else {
                console.log(mailOptions)
                return mailOptions;
            }
        })
    },
}