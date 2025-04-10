// API types that match our server schema
export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Resource {
  id: number;
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  isFeatured: boolean;
  isPopular: boolean;
  logoUrl: string | null;
}

export interface ChatMessage {
  id: number;
  userId: number | null;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface ResourceCategory {
  id: number;
  name: string;
  description: string;
}

export interface GeneratedContent {
  id: number;
  title: string;
  summary: string;
  keyPoints: string[];
  youtubeScriptIdea: string;
  fullContent: string | null;
  category: string;
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
  youtubeUrl: string | null;
  relatedResourceIds: number[] | null;
}

// UI types
export interface ChatSession {
  messages: ChatMessage[];
  isLoading: boolean;
}

export interface SidebarState {
  isOpen: boolean;
  isMobile: boolean;
}

export interface ThemeConfig {
  background: string;
  foreground: string;
  accent: string;
}
