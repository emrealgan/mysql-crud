import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const users = {
  admin: { username: 'admin', password: '1234', role: 'admin' },
  patient: { username: 'patient', password: 'pati', role: 'patient' },
  doctor: { username: 'doctor', password: 'abcd', role: 'doctor' },
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Şifre', type: 'password' },
        role: { label: 'Role', type: 'text' }, // Add role to credentials
      },
      authorize: async (credentials) => {
        const { username, password } = credentials;
        const user = users[username];
      
        if (user && user.password === password) {
          return { username: username, role: user.role }; // Include role in the returned object
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.role = user.role; 
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token; 
      }
      return session;
    },
  },
  pages:{
    signIn: '/', // for logout push
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
