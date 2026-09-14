declare module "#auth-utils" {
  interface User {
    // Add your own fields
    sub: string;
    name: string;
  }

  interface UserSession {
    // Add your own fields
  }

  interface SecureSessionData {
    // Add your own fields
  }
}

export {};
