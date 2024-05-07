import {Model, DataTypes, Optional} from "sequelize"
import {sequelize} from "../utils/database"
import { IBaseAttribs, IUser, baseAttribs, user } from "./common"

interface ITenantAttribs extends IBaseAttribs, IUser {
  addressBefore: string
  isVerified: boolean
  isSuspended: boolean
}
export interface ITenantInput extends Optional<ITenantAttribs,
 'id' | 
 'createdAt' | 
 'updatedAt' | 
 'isVerified' |
 'isSuspended'> {}
export interface ITenantOutput extends Required<ITenantAttribs> {}

class Tenant extends Model<ITenantAttribs, ITenantInput> implements ITenantAttribs {
  public id!: string
  public firstName!: string
  public lastName!: string
  public middleName!: string
  public gender!: string
  public email!: string
  public contact!: string
  public password!: string
  public createdAt!: string
  public updatedAt!: string
  public addressBefore!: string
  public isVerified!: boolean
  public isSuspended!: boolean
}

Tenant.init({
  ...baseAttribs,
  ...user,
  addressBefore: DataTypes.STRING,
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isSuspended: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {sequelize, timestamps: true})

export default Tenant