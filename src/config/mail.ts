const {
    MAIL_USER = "",
    MAIL_PASSWORD = ""
} = process.env

export const MAIL_OPTIONS = {
    host : 'smtp.gmail.com',
    port : 587,
    secure: false,
    auth: {
        user: MAIL_USER,
        password: MAIL_PASSWORD
    }
}