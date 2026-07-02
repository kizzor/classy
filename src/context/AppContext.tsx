import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../services/db';
import { Listing, ChatMessage, User } from '../types';
import { requestNotificationPermission, showNewMessageNotification } from '../services/notifications';

interface AppContextProps {
  listings: Listing[];
  chats: ChatMessage[];
  currentUser: User | null;
  loading: boolean;
  isPostAdOpen: boolean;
  searchQuery: string;
  selectedCategory: string;
  setIsPostAdOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  addListing: (listingData: Omit<Listing, 'id' | 'date' | 'sellerId' | 'sellerName'>) => Promise<Listing>;
  sendChatMessage: (recipientId: string, productId: string, productTitle: string, text: string) => Promise<ChatMessage>;
  toggleUserLogin: () => void;
  deleteListing: (id: string) => Promise<void>;
  simulatePaymentSuccess: () => void;
  hasPaidTemporaryToken: boolean;
  setHasPaidTemporaryToken: (paid: boolean) => void;
  notificationsEnabled: boolean;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPostAdOpen, setIsPostAdOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Track if user paid 100 INR to temporarily unlock another posting
  const [hasPaidTemporaryToken, setHasPaidTemporaryToken] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Default active user Sarah Connor - simulated auth
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'user_sarah_connor',
    name: 'Sarah Connor',
    email: 'sarah.c@classifiedshub.in',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    listingsPostedCount: 0,
  });

  // Request notification permission on first user interaction
  useEffect(() => {
    const handleFirstInteraction = async () => {
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
      document.removeEventListener('click', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    return () => document.removeEventListener('click', handleFirstInteraction);
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const dbListings = await dbService.fetchListings();
        const dbChats = await dbService.fetchChats();
        setListings(dbListings);
        setChats(dbChats);
      } catch (error) {
        console.error('Error loading classified listings from storage:', error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const addListing = async (listingData: Omit<Listing, 'id' | 'date' | 'sellerId' | 'sellerName'>) => {
    if (!currentUser) {
      throw new Error('User must be logged in to create listing');
    }
    const created = await dbService.createListing({
      ...listingData,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
    });
    setListings((prev) => [created, ...prev]);
    // Reset temporary token once posted
    setHasPaidTemporaryToken(false);
    return created;
  };

  const deleteListing = async (id: string) => {
    await dbService.deleteListing(id);
    setListings((prev) => prev.filter((item) => item.id !== id));
  };

  const sendChatMessage = async (recipientId: string, productId: string, productTitle: string, text: string) => {
    let sender = currentUser;
    if (!sender) {
      sender = {
        id: 'user_sarah_connor',
        name: 'Sarah Connor',
        email: 'sarah.c@classifiedshub.in',
        avatar: '',
        listingsPostedCount: 0,
      };
      setCurrentUser(sender);
    }
    const created = await dbService.sendChatMessage({
      senderId: sender.id,
      senderName: sender.name,
      recipientId,
      productId,
      productTitle,
      text,
    });
    setChats((prev) => [...prev, created]);
    
    // Show notification for new message
    showNewMessageNotification(created);
    
    return created;
  };

  const toggleUserLogin = () => {
    if (currentUser) {
      setCurrentUser(null);
    } else {
      setCurrentUser({
        id: 'user_sarah_connor',
        name: 'Sarah Connor',
        email: 'sarah.c@classifiedshub.in',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        listingsPostedCount: 0,
      });
    }
  };

  const simulatePaymentSuccess = () => {
    setHasPaidTemporaryToken(true);
  };

  return (
    <AppContext.Provider
      value={{
        listings,
        chats,
        currentUser,
        loading,
        isPostAdOpen,
        searchQuery,
        selectedCategory,
        setIsPostAdOpen,
        setSearchQuery,
        setSelectedCategory,
        addListing,
        sendChatMessage,
        toggleUserLogin,
        deleteListing,
        simulatePaymentSuccess,
        hasPaidTemporaryToken,
        setHasPaidTemporaryToken,
        notificationsEnabled,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};