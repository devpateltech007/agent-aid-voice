export interface UserInfo {
  phoneNumber: string;
  address: string;
}

export interface SupplyRequest {
  id: string;
  timestamp: number;
  supplies: Array<{
    item: string;
    quantity: number;
    unit?: string;
  }>;
  status: 'pending' | 'processing' | 'fulfilled' | 'cancelled';
  userInfo: UserInfo;
  rawRequest: string;
}

const STORAGE_KEYS = {
  USER_INFO: 'disaster_relief_user_info',
  REQUESTS: 'disaster_relief_requests',
} as const;

export class StorageManager {
  static getUserInfo(): UserInfo | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_INFO);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading user info:', error);
      return null;
    }
  }

  static saveUserInfo(userInfo: UserInfo): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
    } catch (error) {
      console.error('Error saving user info:', error);
    }
  }

  static getRequests(): SupplyRequest[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading requests:', error);
      return [];
    }
  }

  static saveRequest(request: SupplyRequest): void {
    if (typeof window === 'undefined') return;
    
    try {
      const requests = this.getRequests();
      requests.unshift(request); // Add to beginning
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    } catch (error) {
      console.error('Error saving request:', error);
    }
  }

  static updateRequestStatus(requestId: string, status: SupplyRequest['status']): void {
    if (typeof window === 'undefined') return;
    
    try {
      const requests = this.getRequests();
      const index = requests.findIndex(r => r.id === requestId);
      if (index !== -1) {
        requests[index].status = status;
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
      }
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  }

  static clearAllData(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);
      localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}
