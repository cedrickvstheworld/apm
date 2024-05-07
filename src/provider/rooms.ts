import  Model, {IRoomCreate} from "../models/rooms"
import Tenant from  "./tenants"

export default class {
  public async create(data: IRoomCreate) {
    try {
      const room = await Model.create(data)
      return room
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }

  public async update(roomId: string, data: IRoomCreate) {
    try {
      const room = await Model.findOne({where: {id: roomId}})
      if (!room) {
        throw new Error('room does not exist')
      }
      const updated = await room.update(data)
      return updated
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

  public async assign(roomId: string, tenantId: string) {
    try {
      const tenantProvider = new Tenant()
      const tenantExist = await tenantProvider.findById(tenantId)
      if (!tenantExist) {
        throw new Error('tenant does not exist')
      }
      const room = await Model.findOne({where: {id: roomId}})
      if (!room) {
        throw new Error('room does not exist')
      }
      const updated = await room.update({isOccupied: true, assignedTo: tenantId})
      return updated
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }

  public async unAssign(roomId: string) {
    try {
      const room = await Model.findOne({where: {id: roomId}})
      if (!room) {
        throw new Error('room does not exist')
      }
      const updated = await room.update({isOccupied: false, assignedTo: null})
      return updated
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }

  public async deleteRoom(roomId: string) {
    const query = {where: {id: roomId}}
    try {
      const room = await Model.findOne(query)
      if (!room) {
        throw new Error('room does not exist')
      }
      if (room.isOccupied) {
        throw new Error('room is occupied')
      }
      await Model.destroy(query)
      return room
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }
}