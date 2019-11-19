const mailService = require('../../buisnessLogic/services/mail');
const userService = require('../../buisnessLogic/services/users');

module.exports = {
    sendMail: async function(req, res) {
        console.log("sendMail " + req.body.representative)
        let recipient = await userService.findRandomUserByRepresentative(req.body.representative);

        if(!recipient){
            return res.status(404).json({
                message: "Recipient can not be found!"
            });
        }

        const sendMail = await mailService.sendMail(req.body.sender, req.body.subject, req.body.text, recipient.email)

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