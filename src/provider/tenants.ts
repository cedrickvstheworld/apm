import Model from "../models/tenants"
import { hash, test } from "../utils/bcrypt"
import jwt from "../utils/jwt"

interface ITenantCreate {
  firstName: string
  lastName: string
  middleName: string
  gender: string
  email: string
  contact: string
  password: string
  addressBefore: string
}

export default class {
  public async create(data: ITenantCreate) {
    const {password, email} = data
    try {
      const existing = await this.findByEmail(email)
      if (existing && existing.isVerified) {
        throw new Error('Tenant with this email is already registered and verified')
      }
      const tenant = await Model.create({
        ...data,
        password: await hash(password),
      })
      return tenant
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }

  public async findByEmail(email: string) {
    try {
      const tenant = await Model.findOne({
        where: {email}
      })
      return tenant
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }

  public async list(isVerified: boolean) {
    try {
      const tenants = await Model.findAll({
        where: {isVerified}
      })
      return tenants
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }

  public async verify(id: string) {
    try {
      const tenant = await Model.findOne({
        where: {id}
      })
      if (!tenant) {
        throw new Error('record not found')
      }
      const updated = await tenant.update({isVerified: true})
      return updated
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }

  public async signIn(email: string, password: string) {
    try {
      const e = "incorrect username or password"
      const user = await this.findByEmail(email)
      if (!user) {
        throw new Error(e)
      }
      const testPassword = await test(password, user.password)
      if (!testPassword) {
        throw new Error(e)
      }
      if (!user.isVerified) {
        throw new Error('Reach out to appartment staff / tenant for account verification')
      }
      if (user.isSuspended) {
        throw new Error('Your account was suspended')
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

  public async suspend(id: string, isSuspended: boolean) {
    try {
      const tenant = await Model.findOne({
        where: {id}
      })
      if (!tenant) {
        throw new Error('record not found')
      }
      const updated = await tenant.update({isSuspended})
      return updated
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }
}