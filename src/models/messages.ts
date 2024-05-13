import {Model, DataTypes, Optional} from "sequelize"
import {sequelize} from "../utils/database"
import { IBaseAttribs, baseAttribs, } from "./common"

export interface IMessageCreate {
  name: string
  email: string
  contact: string
  content: string
}

interface IMessageAttribs extends IBaseAttribs, IMessageCreate {}

export interface IMessageInput extends Optional<IMessageAttribs,
 'id' | 
 'createdAt' | 
 'updatedAt'> {}
export interface IMessageOutput extends Required<IMessageAttribs> {}

class Message extends Model<IMessageAttribs, IMessageInput> implements IMessageAttribs {
  public id!: string
  public name!: string
  public email!: string
  public contact!: string
  public content!: string
  public createdAt!: string
  public updatedAt!: string
}

Message.init({
  ...baseAttribs,
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  contact: DataTypes.STRING,
  content: DataTypes.STRING,
}, {sequelize, timestamps: true})

export default Message