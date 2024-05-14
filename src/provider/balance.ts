import sequelize from "sequelize"
import  Model, {IBalanceCreate} from "../models/balance"
import Rooms from "./rooms"
import Tenants from "./tenants"

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
              dueDate,
            }
          });
          console.log(existingBill)
          if (existingBill) {
            return
          }
          const TenantProvider = new Tenants()
          const tenant = await TenantProvider.findById(`${room.assignedTo}`)
          const billNextMonth = await Model.create({
            tenantId: `${room.assignedTo}`,
            tenantName: `${tenant?.lastName}, ${tenant?.firstName} ${tenant?.middleName}`,
            roomId: room.id,
            amountDue: room.ratePerMonth,
            dueDate,
          })
          return billNextMonth;
        }
      }
      return 
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