export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  listingsPostedCount: number;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  date: string;
  imageUrl: string;
  category: string;
  sellerId: string;
  sellerName: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  productId: string;
  productTitle: string;
  text: string;
  timestamp: string;
}
