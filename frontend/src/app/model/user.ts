export interface User {
  id: number
  username: string
  password: string
  email: string
  role: string,
  firstName: string,
  lastName: string,
  image: string,
  token: string,
  active: boolean
}
export class UserRole {
  static USER = "USER"
  static ADMIN = "ADMIN"
}
