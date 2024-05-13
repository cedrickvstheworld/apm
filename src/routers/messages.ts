import express, { Router } from 'express'
import {Request, Response} from 'express'
import Provider from "../provider/messages"

export const create = async (request: Request, response: Response) => {
  const {
    name,
    email,
    contact,
    content,
  } = request.body
  const provider = new Provider()
  try {
    const message = await provider.create({
      name,
      email,
      contact,
      content,
    })
    return response.status(200).json(message)
  } catch(e) {
    return response.status(400).json({
      message: (<Error>e).message
    })
  }
}


export const list = async (request: Request, response: Response) => {
  const provider = new Provider()
  try {
    const messages = await provider.list()
    return response.status(200).json(messages)
  } catch(e) {
    return response.status(400).json({
      message: (<Error>e).message
    })
  }
}

export const getById = async (request: Request, response: Response) => {
  const {messageId} = request.params
  const provider = new Provider()
  try {
    const message = await provider.findById(messageId)
    return response.status(200).json(message)
  } catch(e) {
    return response.status(400).json({
      message: (<Error>e).message
    })
  }
}



export const deleteMessage = async (request: Request, response: Response) => {
  const {messageId} = request.params
  const provider = new Provider()
  try {
    const deleted = await provider.deleteMessage(messageId)
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
    this.router.get(
      '/',
      list,
    )

    this.router.get(
      '/:messageId',
      getById,
    )

    this.router.post(
      '/',
      create,
    )

    this.router.delete(
      '/:messageId',
      deleteMessage,
    )

    return this.router
  }
}

export default new Urls().expose()