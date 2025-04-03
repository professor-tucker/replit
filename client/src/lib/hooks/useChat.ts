import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { ChatMessage } from '@/lib/types';

export function useChat() {
  const [input, setInput] = useState('');
  const queryClient = useQueryClient();
  
  // Fetch chat history
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['/api/chat/history'],
  });
  
  // Send message mutation
  const mutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest('POST', '/api/chat', {
        userId: null, // We're not tracking users for now
        content,
        role: 'user'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/history'] });
      setInput('');
    }
  });
  
  const sendMessage = () => {
    if (input.trim()) {
      mutation.mutate(input);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  return {
    input,
    setInput,
    messages,
    isLoading: isLoading || mutation.isPending,
    sendMessage,
    handleKeyDown
  };
}
