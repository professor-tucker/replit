import { Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isSubmitting?: boolean;
}

export default function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  onKeyDown,
  isSubmitting = false 
}: ChatInputProps) {
  return (
    <div className="relative border border-[hsl(var(--muted))] rounded-lg">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="w-full bg-[hsl(var(--card))] text-[hsl(var(--primary))] p-4 rounded-lg glowing-border resize-none min-h-[100px]"
        placeholder="Ask about AI resources, request code examples, or explore free hosting options..."
        disabled={isSubmitting}
      />
      <div className="absolute bottom-3 right-3 flex space-x-2">
        <Button
          variant="secondary"
          size="icon"
          type="button"
          title="Upload file"
          disabled={isSubmitting}
        >
          <Paperclip className="h-5 w-5" />
          <span className="sr-only">Upload file</span>
        </Button>
        <Button
          onClick={onSend}
          className="px-4 py-2 bg-[hsl(var(--primary))] text-black rounded-md font-medium hover:bg-[hsl(var(--primary))] transition-colors"
          disabled={isSubmitting}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
