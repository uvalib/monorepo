export class LibcalAuth {
    private clientId: string;
    private clientSecret: string;
    public baseUrl: string; // Made public for access in other classes
    private tokenUrl: string;
    private accessTokenKey: string = 'libcal_access_token';
    private tokenExpiryKey: string = 'libcal_token_expiry';
  
    constructor(clientId: string, clientSecret: string, baseUrl: string) {
      this.clientId = clientId;
      this.clientSecret = clientSecret;
      this.baseUrl = baseUrl;
      this.tokenUrl = `${baseUrl}/oauth/token`;
    }
  
    private async getToken(): Promise<string> {
      const tokenData = localStorage.getItem(this.accessTokenKey);
      const tokenExpiry = localStorage.getItem(this.tokenExpiryKey);
  
      if (tokenData && tokenExpiry && new Date().getTime() < parseInt(tokenExpiry)) {
        return tokenData;
      } else {
        return this.fetchNewToken();
      }
    }
  
    private async fetchNewToken(): Promise<string> {
      const params = new URLSearchParams();
      params.append('client_id', this.clientId);
      params.append('client_secret', this.clientSecret);
      params.append('grant_type', 'client_credentials');
  
      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to obtain access token: ${response.statusText}`);
      }
  
      const data = await response.json();
      const accessToken = data.access_token;
      const expiresIn = data.expires_in; // in seconds
  
      const expiryTime = new Date().getTime() + expiresIn * 1000;
  
      // Store the token and its expiry time in localStorage
      localStorage.setItem(this.accessTokenKey, accessToken);
      localStorage.setItem(this.tokenExpiryKey, expiryTime.toString());
  
      return accessToken;
    }
  
    public async authenticatedFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
      const token = await this.getToken();
  
      // Ensure headers are initialized
      init = init || {};
      init.headers = init.headers || {};
  
      // Set the Authorization header
      (init.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  
      return fetch(input, init);
    }
  }
  