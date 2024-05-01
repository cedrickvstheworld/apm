import {Model, Optional} from "sequelize"
import {sequelize} from "../utils/database"
import { IBaseAttribs, IUser, baseAttribs, user } from "./common"

interface IStaffAttribs extends IBaseAttribs, IUser {}
export interface IStaffInput extends Optional<IStaffAttribs, 'id' | 'createdAt' | 'updatedAt'> {}
export interface IStaffOutput extends Required<IStaffAttribs> {}

class Staff extends Model<IStaffAttribs, IStaffInput> implements IStaffAttribs {
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
}

Staff.init({
  ...baseAttribs,
  ...user,
}, {sequelize, timestamps: true})

export default Staff