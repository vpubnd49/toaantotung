
import { User } from '../types';
import { storageService } from './storageService';

export const authService = {
  login: async (username: string, password: string): Promise<User | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = storageService.getUsers();
    // In a real app, verify password hash. Here we use a simple check.
    // For demo: default admin password is 'admin123'
    // For registered users, we assume simple password matching logic or just check existence for this mockup
    const user = users.find(u => u.username === username);
    
    if (user) {
       // Hardcoded check for the default admin
       if (user.username === 'admin' && password !== 'admin123') return null;
       
       // For other users in this mockup, we accept any password since we don't store hashes in this simple version
       // In a real app, validate hash here.
       return user;
    }
    return null;
  },

  register: async (fullName: string, username: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = storageService.getUsers();
    if (users.find(u => u.username === username)) {
      throw new Error("Tên đăng nhập đã tồn tại.");
    }

    const newUser: User = {
      id: `u_${Date.now()}`,
      username,
      fullName,
      role: 'MEMBER', // Default role is MEMBER
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`
    };

    storageService.saveUser(newUser);
    return newUser;
  },

  logout: async (): Promise<void> => {
    return Promise.resolve();
  }
};
