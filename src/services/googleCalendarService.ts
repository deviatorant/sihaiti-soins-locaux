
// Google Calendar integration for SIHATI platform
// Client ID: 662921627111-eo3n0iqmotnripcakef77l3aamobdpiu.apps.googleusercontent.com

// Constants
const GOOGLE_CLIENT_ID = '662921627111-eo3n0iqmotnripcakef77l3aamobdpiu.apps.googleusercontent.com';
const GOOGLE_API_SCOPE = 'https://www.googleapis.com/auth/calendar';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];

// Interface for calendar events
export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: {
    email: string;
    name?: string;
    responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }[];
  reminders?: {
    useDefault: boolean;
    overrides?: {
      method: 'email' | 'popup';
      minutes: number;
    }[];
  };
}

// Load the Google API client library
export const loadGoogleCalendarApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if gapi is already loaded
    if (window.gapi) {
      window.gapi.load('client:auth2', {
        callback: () => {
          window.gapi.client
            .init({
              apiKey: '',
              clientId: GOOGLE_CLIENT_ID,
              discoveryDocs: DISCOVERY_DOCS,
              scope: GOOGLE_API_SCOPE,
            })
            .then(() => {
              resolve();
            })
            .catch((error: any) => {
              console.error('Error initializing Google API client', error);
              reject(error);
            });
        },
        onerror: (error: any) => {
          console.error('Error loading Google API client', error);
          reject(error);
        },
      });
    } else {
      // If gapi is not loaded, load the script first
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2', {
          callback: () => {
            window.gapi.client
              .init({
                apiKey: '',
                clientId: GOOGLE_CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: GOOGLE_API_SCOPE,
              })
              .then(() => {
                resolve();
              })
              .catch((error: any) => {
                console.error('Error initializing Google API client', error);
                reject(error);
              });
          },
          onerror: (error: any) => {
            console.error('Error loading Google API client', error);
            reject(error);
          },
        });
      };
      script.onerror = (error) => {
        console.error('Error loading Google API script', error);
        reject(error);
      };
      document.body.appendChild(script);
    }
  });
};

// Sign in with Google
export const signInToGoogle = async (): Promise<boolean> => {
  try {
    await loadGoogleCalendarApi();
    
    const authInstance = window.gapi.auth2.getAuthInstance();
    
    // Check if the user is already signed in
    if (authInstance.isSignedIn.get()) {
      return true;
    }
    
    // Sign in
    await authInstance.signIn();
    return authInstance.isSignedIn.get();
  } catch (error) {
    console.error('Error signing in to Google', error);
    return false;
  }
};

// Sign out from Google
export const signOutFromGoogle = async (): Promise<void> => {
  try {
    const authInstance = window.gapi.auth2.getAuthInstance();
    await authInstance.signOut();
  } catch (error) {
    console.error('Error signing out from Google', error);
  }
};

// Check if user is signed in to Google
export const isSignedInToGoogle = async (): Promise<boolean> => {
  try {
    await loadGoogleCalendarApi();
    const authInstance = window.gapi.auth2.getAuthInstance();
    return authInstance.isSignedIn.get();
  } catch (error) {
    console.error('Error checking Google sign-in status', error);
    return false;
  }
};

// Create a calendar event
export const createCalendarEvent = async (event: CalendarEvent): Promise<string | null> => {
  try {
    if (!(await isSignedInToGoogle())) {
      await signInToGoogle();
    }
    
    const response = await window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    
    return response.result.id;
  } catch (error) {
    console.error('Error creating calendar event', error);
    return null;
  }
};

// Get user's calendar events
export const getCalendarEvents = async (maxResults = 10): Promise<CalendarEvent[]> => {
  try {
    if (!(await isSignedInToGoogle())) {
      await signInToGoogle();
    }
    
    const response = await window.gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: maxResults,
      orderBy: 'startTime',
    });
    
    return response.result.items;
  } catch (error) {
    console.error('Error getting calendar events', error);
    return [];
  }
};

// Update a calendar event
export const updateCalendarEvent = async (eventId: string, event: Partial<CalendarEvent>): Promise<boolean> => {
  try {
    if (!(await isSignedInToGoogle())) {
      await signInToGoogle();
    }
    
    await window.gapi.client.calendar.events.patch({
      calendarId: 'primary',
      eventId: eventId,
      resource: event,
    });
    
    return true;
  } catch (error) {
    console.error('Error updating calendar event', error);
    return false;
  }
};

// Delete a calendar event
export const deleteCalendarEvent = async (eventId: string): Promise<boolean> => {
  try {
    if (!(await isSignedInToGoogle())) {
      await signInToGoogle();
    }
    
    await window.gapi.client.calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting calendar event', error);
    return false;
  }
};

// Add an appointment to Google Calendar
export const addAppointmentToCalendar = async (
  doctorName: string,
  specialty: string,
  appointmentDate: Date,
  duration: number = 30, // duration in minutes
  location: string = ''
): Promise<string | null> => {
  const endTime = new Date(appointmentDate.getTime() + duration * 60000);
  
  const event: CalendarEvent = {
    summary: `SIHATI Medical Appointment: ${doctorName}`,
    description: `Medical appointment with ${doctorName} (${specialty})`,
    location: location,
    start: {
      dateTime: appointmentDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 1 day before
        { method: 'popup', minutes: 60 }, // 1 hour before
      ],
    },
  };
  
  return createCalendarEvent(event);
};
