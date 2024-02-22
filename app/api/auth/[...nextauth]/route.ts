import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions: AuthOptions = ({
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        authorization: `https://accounts.google.com/o/oauth2/auth/authorize?response_type=code&prompt=login&scope=openid%20email%20profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.upload`,
      }),
    ],
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    jwt: {
      secret: process.env.NEXTAUTH_SECRET,
      maxAge: 5 * 60 * 1000,
    },
    callbacks: {
      async jwt({ token, account, profile }:any) {
        if (account) {
          token.accessToken = account.access_token
          token.id = profile.id
        }
        return token
      },
      async session({ session, token, user }:any) {
        session.accessToken = token.accessToken
        session.user.id = token.id
        
        return session
      }
    },
  });

  const handler = NextAuth(authOptions);
  export { handler as GET, handler as POST }
