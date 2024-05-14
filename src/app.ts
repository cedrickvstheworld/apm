require("dotenv").config({ path: `${__dirname}/../.env` })

import express, { Response, Request, Application,  NextFunction} from "express"
import morgan from 'morgan'
import cron from "node-cron";

import fileUpload from "express-fileupload"
import path from "path"
import jwt from "./utils/jwt"
import { sequelize } from "./utils/database"
import { modelsInit } from "./models/init"
import TenantsRouter from './routers/tenants'
import StaffsRouter from './routers/staffs'
import RoomsRouter from './routers/rooms'
import MessagesRouter from './routers/messages'
import BalanceRouter from './routers/balance'

import Balance from "./provider/balance"

class Main {
  private app: Application
  private port: string | number | any

  constructor() {
    this.app = express()
    this.port = process.env.PORT
    this.appConfig()
  }

  public listen() {
    this.app.listen(this.port, (): void => {
      console.log(`*** Server is listening on port ${this.port}`)
    })
  }

  private connectToDatabase() {
    sequelize.authenticate().then(() => {
      modelsInit()
      console.log('*** Server is connected to database.');
   }).catch((error) => {
      console.error('Unable to connect to the database: ', error);
   });
  }

  private loadRouters() {
    this.app.use('/tenants', TenantsRouter)
    this.app.use('/staffs', StaffsRouter)
    this.app.use('/rooms', RoomsRouter)
    this.app.use('/messages', MessagesRouter)
    this.app.use('/balance', BalanceRouter)
    this.app.use((request: Request, response: Response, next: NextFunction) => {
      const {access_token} = request.headers
      try {
        const r = new jwt().verify(`${access_token}`, `${process.env.JWT_SECRET_KEY_SESSION}`)
        if (!r) {
          response.status(401).json({message: "invalid access token"})
        }
        return next()
      } catch (e) {
        response.status(401).json({message: "invalid access token"})
      }
    })
    // this.app.use('/products', ProductsRouter)
  }

  private appConfig() {
    this.app.use(morgan("dev"))
    this.app.use(fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
    }))
    // restrict headers contents and methods
    // allowed all for development
    this.app.use((request: Request, response: Response, next: NextFunction) => {
      response.header("Access-Control-Allow-Origin", "*")
      response.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Authorization, Content-Type, Accept, access_token"
      )
      response.setHeader("Access-Control-Allow-Credentials", "true")
      if (request.method === "OPTIONS") {
        response.header(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, PATCH, DELETE"
        )
        return response.sendStatus(200)
      }
      next()
    })
    
    this.app.use(express.static(path.join(__dirname, '../public')));
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(express.json())

    this.connectToDatabase()
    this.loadRouters()
    cron.schedule("* * * * *", () => {
      const BalanceProvider = new Balance()
      BalanceProvider.create()
    })
  }
}

const main = new Main()
main.listen()
