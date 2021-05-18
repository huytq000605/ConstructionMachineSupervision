import { IMG_DIR } from "@root/config";
import { FileUpload } from "graphql-upload"
import fs from "fs"
import path from "path";


const isImage = (file: FileUpload): boolean => {
    if (
        file.mimetype !== 'image/jpeg' &&
        file.mimetype !== 'image/png' &&
        file.mimetype !== 'image/jpg' &&
        file.mimetype !== 'image/svg+xml'
    )
        return false;
    return true;
}

const saveImage = (filePromise: Promise<FileUpload>): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const file = await filePromise;
        if (!isImage(file)) throw Error("Ảnh không hợp lệ");
        const fileName = `${Date.now()}_${file.filename}`;
        const destination = path.join(IMG_DIR, fileName);
        const readStream = file.createReadStream();
        const writeStream = fs.createWriteStream(destination);
        writeStream.on("finish", () => {
            resolve(fileName);
        });
        writeStream.on("error", () => {
            reject("Có lỗi trong quá trình lưu trữ file ảnh");
        });
        readStream.pipe(writeStream);
    });
};

const deleteImage = (fileName: string | null): Promise<boolean | string> => {
    if(fileName) {
        const toBeDeleted = path.join(IMG_DIR, fileName)
        return new Promise<boolean | string>((resolve, reject) => {
            fs.unlink(toBeDeleted, (err) => {
                if (err) {
                    if (/no such file or directory/.test(err.message)) {
                        reject('File không tồn tại');
                    }
                    else reject(err.message)
                }
                resolve(true);
            });
        });
    }
    else {
        return Promise.resolve(true);
    }
}

const getImage = (fileName: string | null): string | null => {
    if(fileName) {
        const link =
            process.env.NODE_ENV === "development"
                ? `http://localhost:${process.env.PORT}/static-resources/${fileName}`
                : `/static-resources/${fileName}`;
        return link
    }
    else return null;
}

export { saveImage, deleteImage, getImage }