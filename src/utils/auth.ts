import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/config/database";
import User from "@/models/User";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    //Invoked on successful signing
    async signIn({ profile }) {
      // 1. Connect to the database
      await connectDB();
      // 2.Check if the user exists
      const userExists = await User.findOne({ email: profile?.email })
        .lean()
        .exec();
      // 3. If not, add the user to the database
      if (!userExists) {
        const username = profile?.name?.slice(0, 20);

        await User.create({
          email: profile?.email,
          username,
          image: profile?.image,
        });
      }
      // 4. If the user exits, return true to allow sign in
      return true;
    },
    // Modifies the session object
    async session({ session }) {
      // Get user from the database
      const user = await User.findOne({ email: session?.user?.email });
        // Assign user id to the session
        if (session?.user !== undefined) {
            session.user.id = user._id.toString();
        }
      // return session
      return session;
    },
  },
};
