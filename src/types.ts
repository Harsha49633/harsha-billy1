export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  title: string;
  content: string;
  createdAt: Date;
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
}

export interface Report {
  id: string;
  userId: string;
  name: string;
  age: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  bullyingType: string;
  evidenceLinks: string[];
  timestamp: Date;
  status: 'pending' | 'reported' | 'resolved';
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  type?: 'input' | 'options';
  options?: string[];
}