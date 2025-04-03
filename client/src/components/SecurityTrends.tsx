import { useQuery } from '@tanstack/react-query';
import { MessageSquare, Youtube, ChevronRight, Zap } from 'lucide-react';
import { GeneratedContent } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function SecurityTrends() {
  const { data: securityContent = [], isLoading } = useQuery<GeneratedContent[]>({
    queryKey: ['/api/content/category/cybersecurity'],
  });

  // If no content yet, provide an option to generate some
  const handleGenerateTrend = async () => {
    try {
      await fetch('/api/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: 'latest cybersecurity trends and threats 2025' }),
      });
      
      // Invalidate the query to refetch
      // This would work if we had the queryClient, but we're keeping it simple for now
      window.location.reload();
    } catch (error) {
      console.error('Failed to generate security trend:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="my-8 py-4 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-6 bg-[hsl(var(--muted))] rounded w-3/4 max-w-md mb-4"></div>
          <div className="h-40 bg-[hsl(var(--muted))] rounded w-full max-w-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[hsl(var(--primary))]">
          AI-Generated Security Insights
        </h2>
        {securityContent.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="text-[hsl(var(--primary))] border-[hsl(var(--primary))]"
            onClick={handleGenerateTrend}
          >
            <Zap className="mr-2 h-4 w-4" />
            Generate New Insights
          </Button>
        )}
      </div>

      {securityContent.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-[hsl(var(--muted))] rounded-lg">
          <MessageSquare className="mx-auto h-12 w-12 text-[hsl(var(--muted-foreground))]" />
          <h3 className="mt-4 text-lg font-medium">No security insights yet</h3>
          <p className="mt-2 text-[hsl(var(--muted-foreground))]">
            Generate AI-powered security trends and YouTube script ideas
          </p>
          <Button
            variant="default"
            className="mt-4 bg-[hsl(var(--primary))] text-white"
            onClick={handleGenerateTrend}
          >
            <Zap className="mr-2 h-4 w-4" />
            Generate Security Trends
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {securityContent.map((content) => (
            <Card 
              key={content.id}
              className="border border-[hsl(var(--muted))] hover:border-[hsl(var(--primary))] transition-colors overflow-hidden"
            >
              <CardHeader className="bg-gradient-to-r from-[hsl(var(--primary)/0.1)] to-transparent pb-2">
                <CardTitle className="text-lg text-[hsl(var(--primary))]">{content.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm mb-4">{content.summary}</p>
                
                <div className="space-y-2 mb-4">
                  {content.keyPoints.slice(0, 3).map((point: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-[hsl(var(--primary))] mt-1 flex-shrink-0" />
                      <p className="text-xs">{point}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-1 mt-3">
                  {content.tags.map((tag: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className={cn(
                "flex justify-between items-center bg-gradient-to-r",
                "from-[hsl(var(--primary)/0.05)] to-transparent"
              )}>
                <Badge variant="outline" className="text-xs border-[hsl(var(--primary))] text-[hsl(var(--primary))]">
                  {content.category}
                </Badge>
                
                <div className="flex items-center gap-1 text-xs text-[hsl(var(--primary))]">
                  <Youtube className="h-3 w-3" />
                  <span>YouTube Ready</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}