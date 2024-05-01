import jwt, { JwtPayload } from "jsonwebtoken";
import randomString from "randomstring";

export default class {
  secret_key_session: string
  
  constructor() {
    this.secret_key_session = `${process.env.JWT_SECRET_KEY_SESSION}`
  }

  private sign(
    payload: object,
    expiry: number | string,
    secret: string,
  ): string {
    const token = jwt.sign(
      {  user: payload },
      secret,
      { expiresIn: expiry },
    )
    return token
  }

  public getAccessToken(payload: object): string {
    const token = this.sign(
      payload,
      `${process.env.JWT_EXPIRATION_IN_HOURS}`,
      this.secret_key_session,
    )
    return token
  }

  public verify(token: string, secret: string): JwtPayload | string | false {
    const payload = jwt.verify(token, secret)
    if (payload) {
      return payload
    }
    return false
  }

  public generateRandom(
    expiresIn: string | number,
    secret: string,
    payload: object
    ): string {
    const token = this.sign(
      { 
        ...payload,
        code: randomString.generate(5)
      },
      expiresIn,
      secret,
    )
    return token
  }
}
