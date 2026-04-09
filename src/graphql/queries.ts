import { gql } from '@apollo/client'

export const DOCTORS_QUERY = gql`
  query Doctors {
    doctors {
      id
      name
      username
      email
      phone
      hospital
      professionalProfileUrl
    }
  }
`

export const REVIEWS_BY_DOCTOR_QUERY = gql`
  query ReviewsByDoctor($doctorId: ID!) {
    reviewsByDoctorId(doctorId: $doctorId) {
      postId
      id
      name
      email
      body
    }
  }
`
