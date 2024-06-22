import { query } from '@/app/lib/dbConnection';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

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
        const { username, password, role } = credentials;
        const sql = `SELECT * FROM ${role} WHERE username = ?`;
        const [rows] = await query({
          query: sql,
          values: [username.toLowerCase()]
        });
        // Kullanıcı bulunduysa şifre kontrolü yapın
        if (rows.length > 0) {
          const user = rows[0];
          if (user.password == password) {
            return { username: username, role: role };
          }
        }
        // Kullanıcı bulunamadı veya şifre eşleşmedi
        return null;
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
