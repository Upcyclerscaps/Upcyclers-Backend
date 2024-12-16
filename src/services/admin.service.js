/* eslint-disable linebreak-style */
class AdminService {
  constructor() {
    this.baseUrl = '/api/v1/admin';
  }

  async getDashboardStats() {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard-stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      throw error;
    }
  }

  async getUsers() {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getUsers:', error);
      throw error;
    }
  }

  async updateUserRole(userId, role) {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role })
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in updateUserRole:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      return true;
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  }

  // Category Management
  async getCategories() {
    try {
      const response = await fetch(`${this.baseUrl}/categories`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getCategories:', error);
      throw error;
    }
  }

  async createCategory(categoryData) {
    try {
      const response = await fetch(`${this.baseUrl}/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in createCategory:', error);
      throw error;
    }
  }

  async updateCategory(categoryId, categoryData) {
    try {
      const response = await fetch(`${this.baseUrl}/categories/${categoryId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in updateCategory:', error);
      throw error;
    }
  }

  async deleteCategory(categoryId) {
    try {
      const response = await fetch(`${this.baseUrl}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      return true;
    } catch (error) {
      console.error('Error in deleteCategory:', error);
      throw error;
    }
  }

  async getUnits() {
    try {
      const response = await fetch(`${this.baseUrl}/units`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch units');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in getUnits:', error);
      throw error;
    }
  }

  async createUnit(unitData) {
    try {
      const response = await fetch(`${this.baseUrl}/units`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(unitData)
      });

      if (!response.ok) {
        throw new Error('Failed to create unit');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in createUnit:', error);
      throw error;
    }
  }

  async updateUnit(unitId, unitData) {
    try {
      const response = await fetch(`${this.baseUrl}/units/${unitId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(unitData)
      });

      if (!response.ok) {
        throw new Error('Failed to update unit');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in updateUnit:', error);
      throw error;
    }
  }

  async deleteUnit(unitId) {
    try {
      const response = await fetch(`${this.baseUrl}/units/${unitId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete unit');
      }

      return true;
    } catch (error) {
      console.error('Error in deleteUnit:', error);
      throw error;
    }
  }
}

export default new AdminService();