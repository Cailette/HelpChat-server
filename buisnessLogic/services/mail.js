const sendmail = require('sendmail')({silent: true});
var Joi = require('joi');

module.exports = {
    sendMail: async function(sender, subject, text, recipient) {
        const mailOptions = {
            from: sender,
            to: recipient,
            subject: subject,
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
            subject: Joi.string().required(),
            text: Joi.string().required(),
            sender: Joi.string().email().required(),
        }
        return Joi.validate(mail, schema);
    }
}