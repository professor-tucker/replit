import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Resource, ChatMessage } from '@/lib/types';
import ChatInput from './ChatInput';
import ResourceCard from './ResourceCard';
import { useChat } from '@/lib/hooks/useChat';

interface ChatInterfaceProps {
  showResourceCards?: boolean;
}

export default function ChatInterface({ showResourceCards = false }: ChatInterfaceProps) {
  const { 
    input, 
    setInput, 
    messages, 
    isLoading, 
    sendMessage, 
    handleKeyDown 
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch featured resources
  const { data: featuredResources = [] } = useQuery<Resource[]>({
    queryKey: ['/api/resources/featured'],
  });

  // Scroll to bottom of messages on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome message if no messages exist
  const defaultMessage: ChatMessage = {
    id: 0,
    userId: null,
    content: "Hello! I'm your AI resource guide at Superfishal Intelligence. I can help you discover free AI tools, provide code examples, and recommend hosting options. What would you like to explore today?",
    role: 'assistant',
    timestamp: new Date().toISOString()
  };

  // Display the welcome message if there are no other messages
  const displayMessages = messages.length > 0 ? messages : [defaultMessage];

  return (
    <div className="flex-grow flex flex-col max-w-4xl mx-auto w-full px-4 py-6 md:py-8">
      {/* Welcome Message */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to <span className="text-[hsl(var(--primary))]">Superfishal Intelligence</span></h1>
        <p className="text-[hsl(var(--muted-foreground))] mb-2">Discover and use free AI resources for your projects</p>
        <p className="text-[hsl(var(--muted-foreground))]">Ask questions about AI tools, get code examples, or explore free hosting options</p>
      </div>
      
      {/* Chat Messages Container */}
      <div className="flex-grow overflow-y-auto mb-6 space-y-6">
        {displayMessages.map((message) => (
          <div key={message.id} className="flex items-start space-x-4">
            <Avatar className={message.role === 'assistant' ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))]'}>
              {message.role === 'assistant' ? (
                <AvatarFallback className="text-black font-bold text-sm">SI</AvatarFallback>
              ) : (
                <AvatarFallback>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-grow">
              <p className="text-[hsl(var(--primary))] font-medium mb-1">
                {message.role === 'assistant' ? 'Assistant' : 'You'}
              </p>
              <div className="prose text-[hsl(var(--foreground))]">
                <p>{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start space-x-4">
            <Avatar className="bg-[hsl(var(--primary))]">
              <AvatarFallback className="text-black font-bold text-sm">SI</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <p className="text-[hsl(var(--primary))] font-medium mb-1">Assistant</p>
              <div className="prose text-[hsl(var(--foreground))]">
                <p>Typing<span className="typing-dot">.</span><span className="typing-dot">.</span><span className="typing-dot">.</span></p>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={sendMessage}
        onKeyDown={handleKeyDown}
        isSubmitting={isLoading}
      />
      
      {/* Resource Cards */}
      {showResourceCards && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-bold text-[hsl(var(--primary))]">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
