declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: "tenant" | "landlord" | "admin"
    }
  }

  interface User {
    role: "tenant" | "landlord" | "admin"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "tenant" | "landlord" | "admin"
  }
}
