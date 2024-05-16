import sequelize from "sequelize"
import  Model, {IBalanceCreate} from "../models/balance"
import Rooms from "./rooms"
import Tenants from "./tenants"
import { BILL_TYPE } from "../utils/constants"

export default class {
  public async create() {
    try {
      const RoomProvider = new Rooms()
      const rooms = await RoomProvider.list()
      for (const i in rooms) {
        const room = rooms[i]
        const { isOccupied } = room
        if (isOccupied) {
          // const d = new Date()
          // const fd = (new Date(d.getFullYear(), d.getMonth() + 1, 1)).toISOString()
          // const ld = (new Date(d.getFullYear(), d.getMonth() + 2, 0)).toISOString()
          const dateAssign = new Date(`${room.lastDateAssigned}`)
          const dueDate = new Date(dateAssign.getFullYear(), dateAssign.getMonth() + 1, dateAssign.getDate()).toISOString()
          const existingBill = await Model.findOne({
            where: {
              roomId: room.id,
              billType: BILL_TYPE.RENT,
              dueDate,
            }
          });
          console.log(existingBill)
          if (existingBill) {
            continue;
          }
          const TenantProvider = new Tenants()
          const tenant = await TenantProvider.findById(`${room.assignedTo}`)
          const billNextMonth = await Model.create({
            tenantId: `${room.assignedTo}`,
            tenantName: `${tenant?.lastName}, ${tenant?.firstName} ${tenant?.middleName}`,
            roomId: room.id,
            amountDue: room.ratePerMonth,
            dueDate,
            billType: BILL_TYPE.RENT,
          })
          continue;
        }
      }
      return 
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }

  public async createExplicit({roomId, amountDue, dueDate, billType}: {
    roomId: string,
    amountDue: number,
    dueDate: string,
    billType: string,
  }) {
    try {
      const RoomProvider = new Rooms()
      const room = await RoomProvider.findById(roomId)
      if (!room) {
        throw new Error('room not found')
      }
      const TenantProvider = new Tenants()
      const tenant = await TenantProvider.findById(`${room.assignedTo}`)
      const bill = await Model.create({
        roomId,
        tenantName: room.assignedTo ? `${tenant?.lastName}, ${tenant?.firstName} ${tenant?.middleName}` : "VACANT",
        amountDue,
        tenantId: room.assignedTo ? room.assignedTo : "VACANT",
        dueDate: (new Date(dueDate)).toISOString(),
        billType,
      })
      return bill
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }

  public async list(isPaid: boolean | null, tenantId: string | null) {
    try {
      const balances = await Model.findAll({
        where: Object.assign({},
          typeof isPaid === 'boolean' ? {isPaid} : {},
          tenantId ? {tenantId} : {} 
        )
      })
      return balances
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }

  public async pay(balanceId: string) {
    try {
      const balance = await Model.findOne({
        where: {id: balanceId}
      })
      if (!balance) {
        throw new Error('record not found')
      }
      const updated = await balance.update({isPaid: true})
      return updated
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }

  public async findById(id: string) {
    try {
      const balance = await Model.findOne({
        where: {id}
      })
      return balance
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }

  public async deleteBalance(balanceId: string) {
    const query = {where: {id: balanceId}}
    try {
      const balance = await Model.findOne(query)
      if (!balance) {
        throw new Error('record does not exist')
      }
      await Model.destroy(query)
      return balance
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }
}
