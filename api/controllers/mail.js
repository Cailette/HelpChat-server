const mailService = require('../../buisnessLogic/services/mail');
const userService = require('../../buisnessLogic/services/users');

module.exports = {
    sendMail: async function(req, res) {
        let {sender, subject, text} = req.body;
        const validation = mailService.mailValidate({sender, subject, text})

        if(validation.error !== null){
            return res.status(400).json({
                message: "Invalid data!"
            });
        }

        let recipient = await userService.findRandomUserByRepresentative(req.body.representative);

        if(!recipient){
            return res.status(404).json({
                message: "Recipient can not be found!"
            });
        }

        const sendMail = await mailService.sendMail(sender, subject, text, recipient.email)

        if(!sendMail){
            return res.status(400).json({
                message: "Mail can not be send!"
            });
        }

        return res.status(200).json({
            message: "Mail send successfully!", 
            sendMail: sendMail
        });
    },
}