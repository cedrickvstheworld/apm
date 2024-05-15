import Model from "../models/staffs"
import { hash, test } from "../utils/bcrypt"
import jwt from "../utils/jwt"

interface IStaffCreate {
  firstName: string
  lastName: string
  middleName: string
  gender: string
  email: string
  contact: string
  password: string
}

export default class {
  public async create(data: IStaffCreate) {
    const {password} = data
    try {
      const existing = await Model.findOne({where: {email: data.email}})
      if (existing ) {
        throw new Error('Staff with this email is already registered')
      }
      const staff = await Model.create({
        ...data,
        password: await hash(password),
      })
      return staff
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }

  public async update(staffId: string, data: Omit<IStaffCreate, 'password'>) {
    try {
      const emailVerify = await Model.findOne({where: {email: data.email}})
      if (emailVerify && emailVerify.id !== staffId) {
        throw new Error('email is already in used by another user')
      }
      const staff = await Model.findOne({where: {id: staffId}})
      if (!staff) {
        throw new Error('staff does not exist')
      }
      const updated = await staff.update(data)
      return updated
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }

  public async signIn(email: string, password: string) {
    try {
      const e = "incorrect username or password"
      const user = await Model.findOne({
        where: {email}
      })
      if (!user) {
        throw new Error(e)
      }
      const testPassword = await test(password, user.password)
      if (!testPassword) {
        throw new Error(e)
      }
      const r = {
        id: user.id,
        email: user.email,
      }
      return {
        ...r,
        accessToken: new jwt().getAccessToken(r)
      }
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }

  public async authorize(accessToken: string) {
    try {
      const r = new jwt().verify(accessToken, `${process.env.JWT_SECRET_KEY_SESSION}`)
      if (!r) {
        throw new Error("invalid access token")
      }
      return r
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }
  
  public async updatePassword(id: string, currentPassword: string, newPassword: string) {
    try {
      const user = await Model.findOne({
        where: {id}
      })
      if (!user) {
        throw new Error('record not found')
      }
      const testPassword = await test(currentPassword, user.password)
      if (!testPassword) {
        throw new Error('incorrect current password')
      }
      const updated = await user.update({password:  await hash(newPassword)})
      return {email: updated.email, id: updated.id}
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }
}