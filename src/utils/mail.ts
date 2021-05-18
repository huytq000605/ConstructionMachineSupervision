import { createTransport } from "nodemailer";
import { MAIL_OPTIONS } from "../config/index";
import { logger } from "./logger";


const transporter = createTransport(MAIL_OPTIONS);

const sendMail = async (options: {
    from?: string,
    to: string,
    subject?: string,
    text: string, 
}) => {
    try {
        const info = await transporter.sendMail(options);
        logger.info('Email sent: ' + info);
    }
    catch(error) {
        logger.error(error);
    }
}

export default sendMail;