import express, { Router } from 'express'
import {Request, Response} from 'express'
import Provider from "../provider/tenants"

export const create = async (request: Request, response: Response) => {
  const {
    firstName,
    lastName,
    middleName,
    gender,
    email,
    contact,
    password,
    addressBefore,
  } = request.body
  const provider = new Provider()
  try {
    const tenant = await provider.create({
      firstName,
      lastName,
      middleName,
      gender,
      email,
      contact,
      password,
      addressBefore,
    })
    return response.status(200).json({tenant})
  } catch(e) {
    return response.status(400).json({
      message: (<Error>e).message
    })
  }
}

export const list = async (request: Request, response: Response) => {
  const {isVerified = "true"} = request.query
  const provider = new Provider()
  try {
    const tenants = await provider.list(isVerified === "true" ? true : false)
    return response.status(200).json(tenants)
  } catch(e) {
    return response.status(400).json({
      message: (<Error>e).message
    })
  }
}

export const verify = async (request: Request, response: Response) => {
  const {id} = request.params
  const provider = new Provider()
  try {
    const tenant = await provider.verify(id)
    return response.status(200).json(tenant)
  } catch(e) {
    return response.status(400).json({
      message: (<Error>e).message
    })
  }
}

export const suspend = async (request: Request, response: Response) => {
  const {id} = request.params
  const {isSuspended} = request.body
  const provider = new Provider()
  try {
    const tenant = await provider.suspend(id, isSuspended)
    return response.status(200).json(tenant)
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
      list,
    )

    this.router.post(
      '/',
      create,
    )
    
    this.router.get(
      '/auth',
      authorize,
    )

    this.router.post(
      '/sign-in',
      signIn,
    )
    
    this.router.patch(
      '/verify/:id',
      verify,
    )
    
    this.router.patch(
      '/suspend/:id',
      suspend,
    )
  
    return this.router
  }
}

export default new Urls().expose()