
// Type definitions for Google API Client
interface GoogleApiAuth2Instance {
  isSignedIn: {
    get: () => boolean;
    listen: (callback: (isSignedIn: boolean) => void) => void;
  };
  signIn: () => Promise<any>;
  signOut: () => Promise<any>;
  currentUser: {
    get: () => {
      getBasicProfile: () => {
        getName: () => string;
        getEmail: () => string;
        getImageUrl: () => string;
      };
      getAuthResponse: () => {
        id_token: string;
        access_token: string;
        expires_at: number;
      };
    };
  };
}

interface GoogleApiClient {
  init: (params: {
    apiKey?: string;
    clientId: string;
    discoveryDocs: string[];
    scope: string;
  }) => Promise<void>;
  calendar: {
    events: {
      list: (params: any) => Promise<{
        result: {
          items: any[];
        };
      }>;
      insert: (params: any) => Promise<{
        result: {
          id: string;
        };
      }>;
      patch: (params: any) => Promise<any>;
      delete: (params: any) => Promise<any>;
    };
  };
}

interface GoogleApi {
  load: (
    libraries: string,
    options: {
      callback: () => void;
      onerror: (error: any) => void;
    }
  ) => void;
  client: GoogleApiClient;
  auth2: {
    getAuthInstance: () => GoogleApiAuth2Instance;
    init: (params: any) => Promise<any>;
  };
}

declare global {
  interface Window {
    gapi: GoogleApi;
  }
}

export {};
