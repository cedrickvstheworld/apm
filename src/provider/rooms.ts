import  Model, {IRoomCreate} from "../models/rooms"

export default class {
  public async create(data: IRoomCreate) {
    try {
      const room = await Model.create(data)
      return room
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }

  public async list() {
    try {
      const rooms = await Model.findAll()
      return rooms
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }
}