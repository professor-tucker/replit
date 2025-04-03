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
    <div className="flex-grow flex flex-col w-full">
      {/* Chat Messages Container */}
      <div className="flex-grow overflow-y-auto mb-4 space-y-4 border border-[hsl(var(--muted))] rounded-md p-4 min-h-[300px] max-h-[400px]">
        {displayMessages.map((message) => (
          <div key={message.id} className="flex items-start space-x-3">
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
              <p className="text-[hsl(var(--primary))] font-medium mb-1 text-sm">
                {message.role === 'assistant' ? 'Superfishal Intelligence' : 'You'}
              </p>
              <div className="prose prose-sm text-[hsl(var(--foreground))]">
                <p>{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <Avatar className="bg-[hsl(var(--primary))]">
              <AvatarFallback className="text-black font-bold text-sm">SI</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <p className="text-[hsl(var(--primary))] font-medium mb-1 text-sm">Superfishal Intelligence</p>
              <div className="prose prose-sm text-[hsl(var(--foreground))]">
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
    </div>
  );
}
