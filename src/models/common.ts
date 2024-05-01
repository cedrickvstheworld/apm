import {DataTypes} from "sequelize"
import {v4 as uuidv4} from "uuid"

export interface IBaseAttribs {
  id: string
  createdAt: string
  updatedAt: string
}

export interface IUser {
  firstName: string
  lastName: string
  middleName: string
  gender: string
  email: string
  contact: string
  password: string
}

export const baseAttribs = {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: uuidv4,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}

export const user = {
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  middleName: DataTypes.STRING,
  gender: DataTypes.STRING,
  email: DataTypes.STRING,
  contact: DataTypes.STRING,
  password: DataTypes.STRING,
}
