export type Review = {
  id: string
  doctorId: string
  title: string
  email: string
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
  Reviews?: Review[]
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