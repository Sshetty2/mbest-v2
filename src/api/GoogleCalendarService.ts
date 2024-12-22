interface CalendarEvent {
  summary: string;
  location: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}

export class GoogleCalendarService {
  private readonly API_BASE = 'https://www.googleapis.com/calendar/v3';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createEvent (token: string, event: CalendarEvent): Promise<any> {
    const response = await fetch(`${this.API_BASE}/calendars/primary/events`, {
      method : 'POST',
      headers: {
        Authorization : `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    });

    if (!response.ok) {
      throw new Error(`Failed to create event: ${response.statusText}`);
    }

    return response.json();
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-explicit-any
  formatMeetupEvent (meetupEvent: any): CalendarEvent {
    const startDate = new Date(meetupEvent.dateTime);
    const endDate = new Date(meetupEvent.endTime);

    return {
      summary    : meetupEvent.title,
      location   : `${meetupEvent.venue.name}, ${meetupEvent.venue.address}`,
      description: `Event URL: ${meetupEvent.eventUrl}`,
      start      : {
        dateTime: startDate.toISOString(),
        // eslint-disable-next-line new-cap
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: endDate.toISOString(),
        // eslint-disable-next-line new-cap
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };
  }
}
