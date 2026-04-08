import type { JsonPlaceholderUser, Doctor } from "../types"


export const mapUserToDoctor = (user: JsonPlaceholderUser): Doctor => {
    const website = user.website.trim()
    const professionalProfileUrl =
      website.startsWith('http://') || website.startsWith('https://')
        ? website
        : `https://${website}`
  
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      hospital: user.company.name,
      professionalProfileUrl,
    }
  }