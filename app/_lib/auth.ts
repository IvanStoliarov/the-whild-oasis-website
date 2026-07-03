import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { createGuest, getGuest } from './data-service';

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [Google],
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user;
    },
    async signIn({ user, account, profile }) {
      try {
        if (!user.email) return false;
        const existingGuest = await getGuest(user.email);

        if (!existingGuest)
          await createGuest({ email: user.email, fullName: user.name ?? '' });

        return true;
      } catch {
        return false;
      }
    },
    async session({ session, user }) {
      if (!session.user.email) throw new Error('Authenticated user has no email');
      const guest = await getGuest(session.user.email);
      if (!guest) throw new Error('Authenticated guest was not found');
      session.user.guestId = guest.id;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});
