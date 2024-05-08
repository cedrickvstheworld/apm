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

export const update = async (request: Request, response: Response) => {
  const {roomId} = request.params
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
    const room = await provider.update(roomId, {
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

export const getById = async (request: Request, response: Response) => {
  const {roomId} = request.params
  const provider = new Provider()
  try {
    const room = await provider.findById(roomId)
    return response.status(200).json(room)
  } catch(e) {
    return response.status(400).json({
      message: (<Error>e).message
    })
  }
}

export const assign = async (request: Request, response: Response) => {
  const {roomId, tenantId} = request.body
  const provider = new Provider()
  try {
    const room = await provider.assign(roomId, tenantId)
    return response.status(200).json(room)
  } catch(e) {
    return response.status(400).json({
      message: (<Error>e).message
    })
  }
}

export const unAssign = async (request: Request, response: Response) => {
  const {roomId} = request.body
  const provider = new Provider()
  try {
    const room = await provider.unAssign(roomId)
    return response.status(200).json(room)
  } catch(e) {
    return response.status(400).json({
      message: (<Error>e).message
    })
  }
}

export const deleteRoom = async (request: Request, response: Response) => {
  const {roomId} = request.params
  const provider = new Provider()
  try {
    const deleted = await provider.deleteRoom(roomId)
    return response.status(200).json(deleted)
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
    this.router.patch(
      '/assign',
      assign,
    )

    this.router.patch(
      '/unassign',
      unAssign,
    )

    this.router.get(
      '/',
      list,
    )

    this.router.get(
      '/:roomId',
      getById,
    )

    this.router.post(
      '/',
      create,
    )

    this.router.patch(
      '/:roomId',
      update,
    )

    this.router.delete(
      '/:roomId',
      deleteRoom,
    )

    return this.router
  }
}

export default new Urls().expose()