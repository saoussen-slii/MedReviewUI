import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

const JSON_PLACEHOLDER = 'https://jsonplaceholder.typicode.com'

type JsonPlaceholderUser = {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  company: { name: string; catchPhrase: string; bs: string }
}

type JsonPlaceholderComment = {
  postId: number
  id: number
  name: string
  email: string
  body: string
}

const mapUserToDoctor = (user: JsonPlaceholderUser) => {
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

const typeDefs = `#graphql
  type Doctor {
    id: Int!
    name: String!
    username: String!
    email: String!
    phone: String!
    hospital: String!
    professionalProfileUrl: String!
  }

  type Comment {
    postId: Int!
    id: Int!
    name: String!
    email: String!
    body: String!
  }

  type Query {
    doctors: [Doctor!]!
    reviewsByDoctorId(doctorId: ID!): [Comment!]!
  }
`

const resolvers = {
  Query: {
    doctors: async () => {
      const res = await fetch(`${JSON_PLACEHOLDER}/users`)
      if (!res.ok) {
        throw new Error(`JSONPlaceholder users failed (${res.status})`)
      }
      const users = (await res.json()) as JsonPlaceholderUser[]
      return users.map(mapUserToDoctor)
    },
    reviewsByDoctorId: async (
      _: unknown,
      args: { doctorId: string },
    ): Promise<JsonPlaceholderComment[]> => {
      const res = await fetch(
        `${JSON_PLACEHOLDER}/comments?postId=${encodeURIComponent(args.doctorId)}`,
      )
      if (!res.ok) {
        throw new Error(`JSONPlaceholder comments failed (${res.status})`)
      }
      return (await res.json()) as JsonPlaceholderComment[]
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

try {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  })
  console.log(`GraphQL API ready at ${url}`)
} catch (err) {
  console.error('Failed to start GraphQL server:', err)
  if (
    err instanceof Error &&
    'code' in err &&
    (err as NodeJS.ErrnoException).code === 'EADDRINUSE'
  ) {
    console.error(
      'Port 4000 is already in use. Stop the other process or pick another port.',
    )
  }
  process.exit(1)
}
