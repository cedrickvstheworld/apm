import express, { Router } from 'express'
import {Request, Response} from 'express'
import Provider from "../provider/balance"
import { BILL_TYPE } from '../utils/constants'

export const create = async (request: Request, response: Response) => {
  const {
    roomId,
    amountDue,
    dueDate,
    billType,
  } = request.body
  if (!Object.keys(BILL_TYPE).includes(billType)) {
    return response.status(400).json({
      message: 'billType must be (RENT, ELECTRICITY or WATER)'
    })
  }
  const provider = new Provider()
  try {
    const bill = await provider.createExplicit({
      roomId,
      amountDue: parseInt(amountDue),
      dueDate,
      billType,
    })
    return response.status(200).json(bill)
  } catch(e) {
    return response.status(400).json({
      message: (<Error>e).message
    })
  }
}

export const list = async (request: Request, response: Response) => {
  let {isPaid, tenantId} = request.query
  let paid: boolean | null = null
  if (isPaid === 'true') paid = true
  if (isPaid === 'false') paid = false

  const provider = new Provider()
  try {
    const balances = await provider.list(paid, typeof tenantId === 'string' ? tenantId : null)
    return response.status(200).json(balances)
  } catch(e) {
    return response.status(400).json({
      message: (<Error>e).message
    })
  }
}

export const getById = async (request: Request, response: Response) => {
  const {balanceId} = request.params
  const provider = new Provider()
  try {
    const balance = await provider.findById(balanceId)
    return response.status(200).json(balance)
  } catch(e) {
    return response.status(400).json({
      message: (<Error>e).message
    })
  }
}

export const pay = async (request: Request, response: Response) => {
  const {balanceId} = request.params
  const provider = new Provider()
  try {
    const balance = await provider.pay(balanceId)
    return response.status(200).json(balance)
  } catch(e) {
    return response.status(400).json({
      message: (<Error>e).message
    })
  }
}


export const deleteBalance = async (request: Request, response: Response) => {
  const {balanceId} = request.params
  const provider = new Provider()
  try {
    const deleted = await provider.deleteBalance(balanceId)
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

    this.router.patch(
      '/pay/:balanceId',
      pay,
    )


    this.router.post(
      '/',
      create,
    )

    this.router.get(
      '/:balanceId',
      getById,
    )

    this.router.delete(
      '/:balanceId',
      deleteBalance,
    )

    return this.router
  }
}

export default new Urls().expose()