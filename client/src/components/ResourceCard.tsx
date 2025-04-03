import { Resource } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card className="border border-[hsl(var(--muted))] hover:border-[hsl(var(--primary))] transition-colors">
      <CardContent className="pt-6">
        <h3 className="font-bold text-[hsl(var(--primary))] mb-2">{resource.name}</h3>
        <p className="text-sm mb-2">{resource.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Badge variant="secondary" className="text-xs bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]">
          {resource.category}
        </Badge>
        <a 
          href={resource.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-[hsl(var(--primary))] hover:underline flex items-center gap-1"
        >
          Explore
          <ArrowUpRight className="h-3 w-3" />
        </a>
      </CardFooter>
    </Card>
  );
}
