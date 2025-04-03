// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { supabaseServer } from '@/lib/supabaseClient';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "your_username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        // Query the users table in Supabase
        const { data: user, error } = await supabaseServer
          .from('users')
          .select('id, username, hashed_password')
          .eq('username', credentials.username)
          .single();

        if (error || !user) return null;

        // Compare the provided password with the stored hash
        const isValid = await bcrypt.compare(credentials.password, user.hashed_password);
        if (!isValid) return null;

        // Return user object on successful authentication
        return { id: user.id.toString(), name: user.username };
      }
    })
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/signin'
  }
});

export { handler as GET, handler as POST };
