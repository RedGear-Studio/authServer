import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { TypeORMLegacyAdapter } from "@next-auth/typeorm-legacy-adapter"
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { create, exist, login } from "../../../lib/sqlLogin"
import Register from "../../../lib/creatAccountProvider"

export const authOptions: NextAuthOptions = {
  // adapter: TypeORMLegacyAdapter({
  //   type: "mysql",
  //   host: "localhost",
  //   port: 3306,
  //   username: "nextauth",
  //   password: "1234567890#",
  //   namingStrategy: new SnakeNamingStrategy(),
  //   synchronize: true,
  // }),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      id: "1",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (credentials) {
          return await login(credentials)
        }
        return null
      }
    }),
    CredentialsProvider({
      name: 'Create account',
      id: "2",
      credentials: {
        username: { label: "Username", type: "text" },
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        //console.log("hey")

        const isExist = await exist(credentials as { username: string, email: string });
        //console.log(isExist)
        if (!isExist) {
          const user = await create(credentials as { username: string, password: string, email: string })
          // If no error and we have user data, return it
          console.log(user);
          if (user) {
            return user
          }
        }
        // Return null if user data could not be retrieved
        return null
      }
    })
  ],
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    async jwt({ token }) {
      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      //if(session.user) session.user.email = user.email;
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
}

export default NextAuth(authOptions)
//export default null