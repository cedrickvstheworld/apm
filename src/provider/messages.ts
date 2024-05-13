import sequelize from "sequelize"
import  Model, {IMessageCreate} from "../models/messages"

export default class {
  public async create(data: IMessageCreate) {
    try {
      const message = await Model.create(data)
      return message
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }

  public async findById(id: string) {
    try {
      const message = await Model.findOne({
        where: {id}
      })
      return message
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }

  public async list() {
    try {
      const messages = await Model.findAll()
      return messages
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }


  public async deleteMessage(messageId: string) {
    const query = {where: {id: messageId}}
    try {
      const message = await Model.findOne(query)
      if (!message) {
        throw new Error('message does not exist')
      }
      await Model.destroy(query)
      return message
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }

}