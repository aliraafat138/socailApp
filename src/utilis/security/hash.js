import * as bcrypt from 'bcrypt'
export const generateHash = ({ plainText = "", Salt = process.env.SALT } = {}) => {
    const hash = bcrypt.hashSync(plainText, parseInt(Salt))
    return hash
}

export const compareHash = ({ plainText = "", hashValue = "" } = {}) => {
    const match = bcrypt.compareSync(plainText, hashValue)
    return match
}