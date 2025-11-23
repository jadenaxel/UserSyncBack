import { Injectable, Logger } from '@nestjs/common';
import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';

@Injectable()
export class EntraService {
  private readonly logger = new Logger(EntraService.name);
  private graphClient: Client;

  constructor() {
    // In a real app, these should come from environment variables
    const tenantId = process.env.AZURE_TENANT_ID;
    const clientId = process.env.AZURE_CLIENT_ID;
    const clientSecret = process.env.AZURE_CLIENT_SECRET;

    if (tenantId && clientId && clientSecret) {
      const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
      const authProvider = new TokenCredentialAuthenticationProvider(credential, {
        scopes: ['https://graph.microsoft.com/.default'],
      });

      this.graphClient = Client.initWithMiddleware({
        authProvider: authProvider,
      });
    } else {
      this.logger.warn('EntraService initialized in Mock mode (missing env vars)');
    }
  }

  async createUser(userData: any): Promise<boolean> {
    this.logger.log(`Creating user in Entra ID: ${userData.email}`);

    if (!this.graphClient) {
      this.logger.log('Mock: User created in Entra ID');
      return true;
    }

    try {
      const user = {
        accountEnabled: true,
        displayName: `${userData.firstName} ${userData.lastName}`,
        mailNickname: userData.username,
        userPrincipalName: userData.email,
        passwordProfile: {
          forceChangePasswordNextSignIn: true,
          password: userData.password || 'ChangeMe123!',
        },
      };

      await this.graphClient.api('/users').post(user);
      this.logger.log('User created successfully in Entra ID');
      return true;
    } catch (error) {
      this.logger.error('Error creating user in Entra ID', error);
      throw error;
    }
  }
}
