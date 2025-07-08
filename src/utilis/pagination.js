import * as dbService from '../DB/db.service.js'

export const pagination = async({ page, size, populate = [], select = '', filter = {}, model } = {}) => {
    const skip = (page - 1) * size;
    page = parseInt(page < 1 ? process.env.PAGE : page)
    size = parseInt(size < 1 ? process.env.SIZE : size)
    const count = await model.find(filter).countDocuments()

    const data = await dbService.find({
        model: model,
        filter,
        populate,
        skip,
        limit: size
    })
    return { data, size, page, count }
}