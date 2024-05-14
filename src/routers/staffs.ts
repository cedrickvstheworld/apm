import express, { Router } from 'express'
import {Request, Response} from 'express'
import Provider from "../provider/staffs"

export const create = async (request: Request, response: Response) => {
  const {
    firstName,
    lastName,
    middleName,
    gender,
    email,
    contact,
    password,
    apiKey,
  } = request.body
  if (apiKey !== process.env.API_BYPASS_KEY) {
    return response.status(403).json({
      message: "invalid apiKey"
    })
  }
  if (!email || !password) {
    return response.status(403).json({
      message: "incomplete fields"
    })
  }
  const provider = new Provider()
  try {
    const staff = await provider.create({
      firstName,
      lastName,
      middleName,
      gender,
      email,
      contact,
      password,
    })
    return response.status(200).json({staff})
  } catch(e) {
    return response.status(400).json({
      message: (<Error>e).message
    })
  }
}

export const update = async (request: Request, response: Response) => {
  const {staffId} = request.params
  const {
    firstName,
    lastName,
    middleName,
    gender,
    email,
    contact,
  } = request.body
  const provider = new Provider()
  try {
    const staff = await provider.update(staffId, {
      firstName,
      lastName,
      middleName,
      gender,
      email,
      contact,
    })
    return response.status(200).json({staff})
  } catch(e) {
    return response.status(400).json({
      message: (<Error>e).message
    })
  }
}

const signIn = async (request: Request, response: Response) => {
  const {
    email,
    password,
  } = request.body
  if (!email || !password) {
    return response.status(400).json({
      message: "email and password is required"
    })
  }
  const provider = new Provider()
  try {
    const user = await provider.signIn(email, password)
    return response.status(200).json({user})
  } catch(e) {
    return response.status(401).json({
      message: (<Error>e).message
    })
  }
}

const authorize = async (request: Request, response: Response) => {
  const {
    access_token,
  } = request.headers
  const provider = new Provider()
  try {
    const user = await provider.authorize(`${access_token}`)
    return response.status(200).json(user)
  } catch(e) {
    return response.status(401).json({
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
      authorize,
    )

    this.router.post(
      '/',
      create,
    )
    
    this.router.post(
      '/sign-in',
      signIn,
    )

    this.router.patch(
      '/:staffId',
      update,
    )
  
    return this.router
  }
}

export default new Urls().expose()