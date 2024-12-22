import { GraphQLClient, gql } from 'graphql-request';
import { AuthService } from './auth/AuthService';

export class MeetupApi {
  private authService: AuthService;

  private gqlClient: GraphQLClient;

  constructor () {
    this.authService = new AuthService();
    this.gqlClient = new GraphQLClient('https://api.meetup.com/gql',
      { headers: {} });

    this.fetchGroups = this.fetchGroups.bind(this);
  }

  async fetchGroups (searchText: string) {
    const token = await this.authService.getValidToken();

    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${import.meta.env.VITE_LAMBDA_API_URL}/get-user-groups?search=${searchText}`,
      { headers: { Authorization: `Bearer ${token}` } });

    return response.json();
  }

  async fetchGroupEvents (urlname: string) {
    try {
      const token = await this.authService.getValidToken();

      if (!token) {
        throw new Error('Not authenticated');
      }

      this.gqlClient.setHeader('Authorization', `Bearer ${token}`);

      const query = gql`
        query GroupEvents($urlname: String!) {
          groupByUrlname(urlname: $urlname) {
            eventSearch(
              input: { first: 100 }
              filter: {
                query: ""
              }
            ) {
              edges {
                node {
                  id
                  title
                  eventUrl
                  dateTime
                  duration
                  venue {
                    name
                    address
                    city
                    state
                    postalCode
                  }
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }
      `;

      const variables = { urlname };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await this.gqlClient.request(query, variables) as any;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.groupByUrlname.eventSearch.edges.map((edge: any) => edge.node);
    } catch (error) {
      console.error('Error fetching group events:', error);
      throw error;
    }
  }

  // Helper method to filter events by date range
  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-explicit-any
  filterEventsByDateRange (events: any[], startDate: Date, endDate: Date) {
    return events.filter(event => {
      const eventDate = new Date(event.dateTime);

      return eventDate >= startDate && eventDate <= endDate;
    });
  }
}
