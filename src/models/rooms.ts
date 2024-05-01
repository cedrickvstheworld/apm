import {Model, DataTypes, Optional} from "sequelize"
import {sequelize} from "../utils/database"
import { IBaseAttribs, baseAttribs, } from "./common"

export interface IRoomCreate {
  roomCode: string
  buildingCode: string
  isOccupied: boolean
  hasKitchen: boolean
  maxTenantCapacity: number
  numberOfBedrooms: number
  numberOfFloors: number
  ratePerMonth: number
  hasBathroomComfortRoom: boolean
}

interface IRoomAttribs extends IBaseAttribs, IRoomCreate {}

export interface IRoomInput extends Optional<IRoomAttribs,
 'id' | 
 'createdAt' | 
 'updatedAt' | 
 'isOccupied'> {}
export interface IRoomOutput extends Required<IRoomAttribs> {}

class Room extends Model<IRoomAttribs, IRoomInput> implements IRoomAttribs {
  public id!: string
  public roomCode!: string
  public buildingCode!: string
  public isOccupied!: boolean
  public hasKitchen!: boolean
  public hasBathroomComfortRoom!: boolean
  public maxTenantCapacity!: number
  public numberOfBedrooms!: number
  public numberOfFloors!: number
  public ratePerMonth!: number
  public createdAt!: string
  public updatedAt!: string
}

Room.init({
  ...baseAttribs,
  roomCode: DataTypes.STRING,
  buildingCode: DataTypes.STRING,
  isOccupied: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasKitchen: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  hasBathroomComfortRoom: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  maxTenantCapacity: DataTypes.INTEGER,
  numberOfBedrooms: DataTypes.INTEGER,
  numberOfFloors: DataTypes.INTEGER,
  ratePerMonth: DataTypes.FLOAT,
}, {sequelize, timestamps: true})

export default Room