import { AuthService } from './auth/AuthService';

export class MeetupApi {
  private authService: AuthService;

  constructor () {
    this.authService = new AuthService();
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
}
