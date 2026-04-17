import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      id: "credentials-user",
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
          {
            method: "POST",
            body: JSON.stringify({
              email: credentials.username,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );

        if (res.ok) {
          const data = await res.json();
          // Backend returns: { "data": { id, fullname, email, role, ... }, "token": "..." }
          return {
            id: String(data?.data?.id ?? ""),
            name: data?.data?.fullname ?? "",
            email: data?.data?.email ?? "",
            image: data?.data?.photo ?? null,
            token: data?.token ?? "",
            role: data?.data?.role ?? "",
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.token = (user as any).token as string;
        token.role = (user as any).role as string;
        token.name = user.name as string;
        token.email = user.email as string;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.token = token.token;
      session.user.name = token.name ?? "";
      session.user.email = token.email ?? "";
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
});
