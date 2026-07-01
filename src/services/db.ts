import { Listing, ChatMessage } from '../types';
import { initialProducts } from '../data/mockProducts';

const STORAGE_LISTINGS_KEY = 'classifieds_listings_db';
const STORAGE_CHATS_KEY = 'classifieds_chats_db';

const getStoredListings = (): Listing[] => {
  const data = localStorage.getItem(STORAGE_LISTINGS_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_LISTINGS_KEY, JSON.stringify(initialProducts));
    return initialProducts;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return initialProducts;
  }
};

const getStoredChats = (): ChatMessage[] => {
  const data = localStorage.getItem(STORAGE_CHATS_KEY);
  if (!data) {
    const defaultChats: ChatMessage[] = [];
    localStorage.setItem(STORAGE_CHATS_KEY, JSON.stringify(defaultChats));
    return defaultChats;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const dbService = {
  fetchListings: async (): Promise<Listing[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredListings());
      }, 250);
    });
  },

  createListing: async (listing: Omit<Listing, 'id' | 'date'>): Promise<Listing> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentListings = getStoredListings();
        const newListing: Listing = {
          ...listing,
          id: `listing_${Date.now()}`,
          date: 'Just now',
        };
        const updatedListings = [newListing, ...currentListings];
        localStorage.setItem(STORAGE_LISTINGS_KEY, JSON.stringify(updatedListings));
        resolve(newListing);
      }, 350);
    });
  },

  deleteListing: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentListings = getStoredListings();
        const filtered = currentListings.filter((item) => item.id !== id);
        localStorage.setItem(STORAGE_LISTINGS_KEY, JSON.stringify(filtered));
        resolve(true);
      }, 200);
    });
  },

  fetchChats: async (): Promise<ChatMessage[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getStoredChats());
      }, 150);
    });
  },

  sendChatMessage: async (message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentChats = getStoredChats();
        const newMessage: ChatMessage = {
          ...message,
          id: `msg_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        const updatedChats = [...currentChats, newMessage];
        localStorage.setItem(STORAGE_CHATS_KEY, JSON.stringify(updatedChats));
        resolve(newMessage);
      }, 200);
    });
  },
};
