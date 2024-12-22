import { GraphQLClient, gql } from 'graphql-request';
import { AuthService } from './auth/AuthService';

interface Group {
  id: string;
  name: string;
  urlname: string;
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

interface MembershipEdge {
  node: Group;
}

interface MembershipResponse {
  self: {
    memberships: {
      edges: MembershipEdge[];
      pageInfo: PageInfo;
    };
  };
}

export class MeetupApi {
  private authService: AuthService;

  private gqlClient: GraphQLClient;

  constructor () {
    this.authService = new AuthService();
    this.gqlClient = new GraphQLClient(
      'https://api.meetup.com/gql',
      { headers: {} }
    );

    this.fetchGroups = this.fetchGroups.bind(this);
  }

  async fetchGroups (searchText: string): Promise<Group[]> {
    try {
      const token = await this.authService.getValidToken();

      if (!token) {
        throw new Error('Not authenticated');
      }

      this.gqlClient.setHeader('Authorization', `Bearer ${token}`);

      const allGroups: Group[] = [];
      let hasNextPage = true;
      let afterCursor: string | null = null;

      while (hasNextPage) {
        const query: string = gql`
          query {
            self {
              memberships(input: { first: 100${afterCursor ? `, after: "${afterCursor}"` : ''} }) {
                edges {
                  node {
                    id
                    name
                    urlname
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

        // eslint-disable-next-line no-await-in-loop
        const response = await this.gqlClient.request<MembershipResponse>(query);
        const { edges, pageInfo } = response.self.memberships;

        allGroups.push(...edges.map(edge => edge.node));

        hasNextPage = pageInfo.hasNextPage;
        afterCursor = pageInfo.endCursor;
      }

      // Filter groups if search text is provided
      if (searchText) {
        return allGroups.filter(group => group.name.toLowerCase().includes(searchText.toLowerCase()));
      }

      return allGroups;
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
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
                  endTime
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
