declare module "#auth-utils" {
  interface User {
    // Add your own fields
    id: number;
    sub: string;
    name: string | null;
    isManager: boolean;
  }

  interface UserSession {
    // Add your own fields
  }

  interface SecureSessionData {
    // Add your own fields
  }
}

export {};
