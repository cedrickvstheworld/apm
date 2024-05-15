import {Model, DataTypes, Optional} from "sequelize"
import {sequelize} from "../utils/database"
import { IBaseAttribs, baseAttribs, } from "./common"

export interface IBalanceCreate {
  tenantId: string
  tenantName: string
  roomId: string
  amountDue: number
  isPaid: boolean
  dueDate: string
  billType: string
}

interface IBalanceAttribs extends IBaseAttribs, IBalanceCreate {}

export interface IBalanceInput extends Optional<IBalanceAttribs,
 'id' | 
 'isPaid' |
 'createdAt' | 
 'updatedAt'> {}
export interface IBalanceOutput extends Required<IBalanceAttribs> {}

class Balance extends Model<IBalanceAttribs, IBalanceInput> implements IBalanceAttribs {
  public id!: string
  public tenantId!: string
  public tenantName!: string
  public roomId!: string
  public amountDue!: number
  public isPaid!: boolean
  public dueDate!: string
  public billType!: string
  public createdAt!: string
  public updatedAt!: string
}

Balance.init({
  ...baseAttribs,
  tenantId: DataTypes.STRING,
  tenantName: DataTypes.STRING,
  roomId: DataTypes.STRING,
  billType: DataTypes.STRING,
  amountDue: DataTypes.INTEGER,
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  dueDate: DataTypes.DATE,
}, {sequelize, timestamps: true})

export default Balance