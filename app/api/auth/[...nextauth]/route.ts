/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: AI Tutor
 * Class:   CMPS-450 Senior Project
 * Date:    May 2025
 * File:    /app/api/auth/[...nextauth]/route.ts
 ************************************************************/



/**
 * NextAuth Configuration for AI Tutor – Handles sign-in using custom credentials.
 *
 * Uses Supabase as a user database, with bcrypt password verification.
 * JWT-based sessions ensure secure and scalable auth handling across routes.
 */


import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { supabaseServer } from '@/lib/supabaseClient';


// Initialize NextAuth handler
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "your_username" },
        password: { label: "Password", type: "password" },
      },
      
      
      /**
       * Authorize user by verifying credentials with Supabase.
       * @returns Authenticated user object or null on failure
       */
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        // Look up the user in Supabase
        const { data: user, error } = await supabaseServer
          .from('users')
          .select('id, username, hashed_password')
          .eq('username', credentials.username)
          .single();

        // Fail if user not found or error in query
        if (error || !user) return null;

        // Compare hashed password
        const isValid = await bcrypt.compare(credentials.password, user.hashed_password);
        if (!isValid) return null;

        // Return a user object on success
        return { id: user.id.toString(), name: user.username };
      }
    })
  ],

  // Use JSON Web Tokens to manage sessions
  session: { strategy: "jwt" },

  // Environment secret for signing tokens
  secret: process.env.NEXTAUTH_SECRET,

  // Customize token and session handling
  callbacks: {
    
    /**
     * Customize JWT token structure.
     * Adds user ID to the token payload.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    
    /**
     * Customize session object returned to the client.
     * Embeds user ID in the session.user object.
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },

  // Custom sign-in page route
  pages: {
    signIn: '/signin'
  }
});

// Export NextAuth handler for both GET and POST requests
export { handler as GET, handler as POST };
