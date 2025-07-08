import CryptoJS from "crypto-js";
export const generateEncryption = ({ plainText = "", signature = process.env.ENCRYPTION_SIGNATURE } = {}) => {
    const encryption = CryptoJS.AES.encrypt(plainText, signature).toString()
    return encryption
}

export const generateDecryption = ({ cypherText = "", signature = process.env.ENCRYPTION_SIGNATURE } = {}) => {
    const decryption = CryptoJS.AES.decrypt(cypherText, signature)
    return decryption
}