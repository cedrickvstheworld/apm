import express, { Router } from 'express'
import {Request, Response} from 'express'
import Provider from "../provider/rooms"

export const create = async (request: Request, response: Response) => {
  const {
    roomCode,
    buildingCode,
    isOccupied,
    hasKitchen,
    maxTenantCapacity,
    numberOfBedrooms,
    numberOfFloors,
    ratePerMonth,
    hasBathroomComfortRoom,
  } = request.body
  const provider = new Provider()
  try {
    const room = await provider.create({
      roomCode,
      buildingCode,
      isOccupied,
      hasKitchen,
      maxTenantCapacity,
      numberOfBedrooms,
      numberOfFloors,
      ratePerMonth,
      hasBathroomComfortRoom,
    })
    return response.status(200).json(room)
  } catch(e) {
    return response.status(400).json({
      message: (<Error>e).message
    })
  }
}


export const list = async (request: Request, response: Response) => {
  const provider = new Provider()
  try {
    const rooms = await provider.list()
    return response.status(200).json(rooms)
  } catch(e) {
    return response.status(400).json({
      message: (<Error>e).message
    })
  }
}

class Urls {
  private router: Router
  constructor() {
    this.router = express.Router({mergeParams: true})
  }
  
  public expose() {
    this.router.get(
      '/',
      list,
    )

    this.router.post(
      '/',
      create,
    )

    return this.router
  }
}

export default new Urls().expose()