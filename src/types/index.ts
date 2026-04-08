export type Review = {
  id: string
  title: string
  body: string
}


export type Doctor = {
  id: number
  name: string
  username: string
  email: string
  phone: string
  hospital: string
  professionalProfileUrl: string
}


export type JsonPlaceholderUser = {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}