const sendmail = require('sendmail')({silent: true});

module.exports = {
    sendMail: async function(sender, subject, text, recipient) {
        const mailOptions = {
            from: sender,
            to: recipient,
            subject:subject,
            text: text,
        };

        sendmail(mailOptions, function (err, reply) {
            if(err){
                return "";
            } else {
                return mailOptions;
            }
        })
    },

    mailValidate: function(mail) {
        var schema = {
            subject: Joi.types.String().required(),
            text: Joi.types.String().email().required(),
            sender: Joi.types.String().min(6).max(30).regex(/[a-zA-Z0-9]{6,30}/).required(),
        }
        return Joi.validate(mail, schema);
    }
}