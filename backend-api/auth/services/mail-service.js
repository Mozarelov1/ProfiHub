const nodemailer = require('nodemailer')


class MailService{

    constructor(){
        this.transporter = nodemailer.createTransport({
            service:'gmail',
            secure:false,
            auth:{
                user: process.env.SMTP_HOST,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }


    async sendActivationMail(to,link){
        await this.transporter.sendMail({
            from:process.env.SMTP_HOST,
            to,
            subject:'Account activation',
            text:'',
            html: `
                <div>
                    <h1>To activate follow the link</h1>
                    <a href="${link}">${link}</a>
                </div>
                `
        })
    }
};

module.exports = new MailService();