const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

class ApiService {
  static getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  static async handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    return data;
  }

  // Auth endpoints
  static async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return this.handleResponse(response);
  }

  static async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return this.handleResponse(response);
  }

  // Container endpoints
  static async getContainers() {
    const response = await fetch(`${API_BASE_URL}/containers`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  static async createContainer(containerData) {
    const response = await fetch(`${API_BASE_URL}/containers`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(containerData)
    });
    return this.handleResponse(response);
  }

  static async deleteContainer(containerId) {
    const response = await fetch(`${API_BASE_URL}/containers/${containerId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  static async containerAction(containerId, action) {
    const response = await fetch(`${API_BASE_URL}/containers/${containerId}/action`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ action })
    });
    return this.handleResponse(response);
  }

  static async getContainerLogs(containerId) {
    const response = await fetch(`${API_BASE_URL}/containers/${containerId}/logs`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  static async transferContainer(containerId, targetEmail) {
    const response = await fetch(`${API_BASE_URL}/containers/${containerId}/transfer`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ targetEmail })
    });
    return this.handleResponse(response);
  }

  static async getContainerStats() {
    const response = await fetch(`${API_BASE_URL}/containers/stats`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // User endpoints
  static async getUserProfile() {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  static async updateProfile(profileData) {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(profileData)
    });
    return this.handleResponse(response);
  }

  static async changePassword(passwordData) {
    const response = await fetch(`${API_BASE_URL}/users/change-password`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(passwordData)
    });
    return this.handleResponse(response);
  }
}

export default ApiService; 