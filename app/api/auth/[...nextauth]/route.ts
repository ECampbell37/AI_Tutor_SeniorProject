/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/api/auth/[...nextauth]/route.ts
 ************************************************************/


import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { supabaseServer } from '@/lib/supabaseClient';

// Configure NextAuth handler with credentials provider
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "your_username" },
        password: { label: "Password", type: "password" },
      },
      // Authorize function to validate login
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        // Query Supabase for matching user
        const { data: user, error } = await supabaseServer
          .from('users')
          .select('id, username, hashed_password')
          .eq('username', credentials.username)
          .single();

        // Return null if user not found or query fails
        if (error || !user) return null;

        // Compare entered password with stored hashed password
        const isValid = await bcrypt.compare(credentials.password, user.hashed_password);
        if (!isValid) return null;

        // Return user object if login is successful
        return { id: user.id.toString(), name: user.username };
      }
    })
  ],

  // Use JSON Web tokens (JWT) for session management
  session: { strategy: "jwt" },

  // Secret key for signing tokens
  secret: process.env.NEXTAUTH_SECRET,

  // Customize token and session handling
  callbacks: {
    // Add user ID to the JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // Add user ID to the session object
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },

  // Use a custom sign-in page
  pages: {
    signIn: '/signin'
  }
});

// Export the handler for both GET and POST requests
export { handler as GET, handler as POST };
