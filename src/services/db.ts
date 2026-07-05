import { Listing, ChatMessage } from '../types';
import { initialProducts } from '../data/mockProducts';
import { supabase } from '../lib/supabase';

// ── localStorage fallback keys ──
const LS_LISTINGS = 'classifieds_listings_db';
const LS_CHATS = 'classifieds_chats_db';

const getStoredListings = (): Listing[] => {
  const data = localStorage.getItem(LS_LISTINGS);
  if (!data) {
    localStorage.setItem(LS_LISTINGS, JSON.stringify(initialProducts));
    return initialProducts;
  }
  try { return JSON.parse(data); } catch { return initialProducts; }
};

const getStoredChats = (): ChatMessage[] => {
  const data = localStorage.getItem(LS_CHATS);
  if (!data) {
    localStorage.setItem(LS_CHATS, JSON.stringify([]));
    return [];
  }
  try { return JSON.parse(data); } catch { return []; }
};

// ── camelCase ↔ snake_case mapping ──
const listingToRow = (l: Listing) => ({
  id: l.id,
  title: l.title,
  description: l.description,
  price: l.price,
  location: l.location,
  date: l.date,
  image_url: l.imageUrl,
  category: l.category,
  seller_id: l.sellerId,
  seller_name: l.sellerName,
  latitude: l.latitude ?? null,
  longitude: l.longitude ?? null,
});

const rowToListing = (r: any): Listing => ({
  id: r.id,
  title: r.title,
  description: r.description,
  price: r.price,
  location: r.location,
  date: r.date,
  imageUrl: r.image_url,
  category: r.category,
  sellerId: r.seller_id,
  sellerName: r.seller_name,
  latitude: r.latitude ?? undefined,
  longitude: r.longitude ?? undefined,
});

const chatToRow = (m: Omit<ChatMessage, 'id' | 'timestamp'> & { id?: string; timestamp?: string }) => ({
  id: m.id || `msg_${Date.now()}`,
  sender_id: m.senderId,
  sender_name: m.senderName,
  recipient_id: m.recipientId,
  product_id: m.productId,
  product_title: m.productTitle,
  text: m.text,
  timestamp: m.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
});

const rowToChat = (r: any): ChatMessage => ({
  id: r.id,
  senderId: r.sender_id,
  senderName: r.sender_name,
  recipientId: r.recipient_id,
  productId: r.product_id,
  productTitle: r.product_title,
  text: r.text,
  timestamp: r.timestamp,
});

// ── Health check: can we reach the Supabase tables? ──
let supabaseAvailable: boolean | null = null;

const checkSupabase = async (): Promise<boolean> => {
  if (supabaseAvailable !== null) return supabaseAvailable;
  try {
    const { error } = await supabase.from('listings').select('id', { head: true, count: 'exact' });
    supabaseAvailable = !error;
    if (error) console.warn('Supabase tables not ready, using localStorage:', error.message);
  } catch {
    supabaseAvailable = false;
    console.warn('Supabase unreachable, using localStorage');
  }
  return supabaseAvailable;
};

// ── Seed mock data into Supabase if table is empty ──
const seedIfEmpty = async () => {
  try {
    const { count } = await supabase.from('listings').select('*', { count: 'exact', head: true });
    if (count === 0) {
      console.log('Seeding 6 mock products into Supabase...');
      const rows = initialProducts.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        location: p.location,
        date: p.date,
        image_url: p.imageUrl,
        category: p.category,
        seller_id: p.sellerId,
        seller_name: p.sellerName,
        latitude: p.latitude ?? null,
        longitude: p.longitude ?? null,
      }));
      const { error } = await supabase.from('listings').insert(rows);
      if (error) console.error('Seed insert error:', error);
      else console.log(`Seeded ${rows.length} products`);
    }
  } catch (e) {
    console.error('Seed check failed:', e);
  }
};

// ── Public API ──
export const dbService = {
  fetchListings: async (): Promise<Listing[]> => {
    if (await checkSupabase()) {
      await seedIfEmpty();
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Supabase fetchListings error:', error);
        return getStoredListings();
      }
      return (data || []).map(rowToListing);
    }
    return getStoredListings();
  },

  createListing: async (listing: Omit<Listing, 'id' | 'date'>): Promise<Listing> => {
    const newListing: Listing = {
      ...listing,
      id: `listing_${Date.now()}`,
      date: 'Just now',
    };

    if (await checkSupabase()) {
      const { data, error } = await supabase
        .from('listings')
        .insert(listingToRow(newListing))
        .select()
        .single();
      if (error) {
        console.error('Supabase createListing error:', error);
        throw error;
      }
      return rowToListing(data);
    }

    // localStorage fallback
    const current = getStoredListings();
    const updated = [newListing, ...current];
    localStorage.setItem(LS_LISTINGS, JSON.stringify(updated));
    return newListing;
  },

  deleteListing: async (id: string): Promise<boolean> => {
    if (await checkSupabase()) {
      const { error } = await supabase.from('listings').delete().eq('id', id);
      if (error) throw error;
      return true;
    }
    const current = getStoredListings();
    localStorage.setItem(LS_LISTINGS, JSON.stringify(current.filter((i) => i.id !== id)));
    return true;
  },

  fetchChats: async (): Promise<ChatMessage[]> => {
    if (await checkSupabase()) {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('timestamp', { ascending: true });
      if (error) {
        console.error('Supabase fetchChats error:', error);
        return getStoredChats();
      }
      return (data || []).map(rowToChat);
    }
    return getStoredChats();
  },

  sendChatMessage: async (message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> => {
    const newMsg: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (await checkSupabase()) {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert(chatToRow(newMsg))
        .select()
        .single();
      if (error) {
        console.error('Supabase sendChatMessage error:', error);
        throw error;
      }
      return rowToChat(data);
    }

    // localStorage fallback
    const current = getStoredChats();
    const updated = [...current, newMsg];
    localStorage.setItem(LS_CHATS, JSON.stringify(updated));
    return newMsg;
  },
};