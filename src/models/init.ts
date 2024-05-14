import Tenant from "./tenants"
import Staff from "./staffs"
import Room from "./rooms"
import Message from "./messages"
import Balance from "./balance"
const isDev = process.env.MODE === 'development'

export const modelsInit = () => {
  const mode = {alter: isDev}
  Tenant.sync(mode)
  Staff.sync(mode)
  Room.sync(mode)
  Message.sync(mode)
  Balance.sync(mode)
}
