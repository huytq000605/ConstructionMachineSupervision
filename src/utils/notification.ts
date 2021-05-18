import * as admin from 'firebase-admin';
import {private_key, client_email, project_id} from '@root/config/mandevices-web-77dde74d5ebf.json'

admin.initializeApp({
    credential: admin.credential.cert({
        privateKey: private_key,
        clientEmail: client_email,
        projectId: project_id
    }),
    
})

/**
 * 
 * @param tokens một hoặc một mảng các token
 * @param data dữ liệu muốn gửi đi
 * @returns kết quả
 */
export const sendNotification = async (tokens: Array<string> | string, data: Record<string, any>) => {
    let message: {
        tokens: string[];
        data: Record<string, any>;
    };
    if(Array.isArray(tokens)) {
        if(tokens.length === 0) return;
        message = {
            tokens,
            data
        }

    }
    else {
        message = {
            tokens: [tokens],
            data,
        };
    }
    const result = await admin.messaging().sendMulticast(message)
    return result
}

const subcribeTopic = async () => {};

const unsubcribeTopic = async () => {};