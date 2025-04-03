import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileDrawer from '@/components/MobileDrawer';
import { useSidebar } from '@/lib/hooks/useSidebar';
import { DollarSign, Coffee, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Donate() {
  const { isOpen, isMobile, toggle, close } = useSidebar();

  const openCashApp = () => {
    window.open('https://cash.app/$sleepingsilverback', '_blank');
  };

  return (
    <div className="bg-black text-[hsl(var(--foreground))] font-mono min-h-screen flex flex-col">
      <Header toggleSidebar={toggle} />
      
      <main className="flex-grow flex flex-col max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Support <span className="text-[hsl(var(--primary))]">Superfishal Intelligence</span></h1>
        
        <div className="prose text-[hsl(var(--foreground))] prose-headings:text-[hsl(var(--primary))] mb-8">
          <p>
            Superfishal Intelligence is a free resource created to democratize access to AI tools and resources. Your support helps us keep this service running and expanding.
          </p>
          
          <p>
            If you've found value in our platform, please consider supporting us with a donation. Every contribution helps us maintain our servers, improve our recommendations, and add new features.
          </p>
        </div>
        
        <div className="flex justify-center mb-12">
          <Card className="w-full max-w-md border-[hsl(var(--primary))] bg-[hsl(var(--card))]">
            <CardContent className="pt-6 text-center">
              <DollarSign className="h-16 w-16 mx-auto mb-4 text-[hsl(var(--primary))]" />
              <h2 className="text-2xl font-bold mb-4">Donate via CashApp</h2>
              <p className="mb-6">Support Superfishal Intelligence via CashApp to help us continue providing free AI resources.</p>
              
              <div className="text-xl mb-4 font-mono">$sleepingsilverback</div>
              
              <Button 
                onClick={openCashApp}
                className="w-full bg-[hsl(var(--primary))] text-black hover:bg-[hsl(var(--accent))] transition-colors"
              >
                <DollarSign className="mr-2 h-5 w-5" />
                Donate on CashApp
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-[hsl(var(--muted))] bg-[hsl(var(--card))]">
            <CardContent className="pt-6 text-center">
              <Coffee className="h-10 w-10 mx-auto mb-4 text-[hsl(var(--primary))]" />
              <h3 className="text-lg font-bold mb-2">Buy Us a Coffee</h3>
              <p className="text-sm">Your donation helps pay for hosting and development time.</p>
            </CardContent>
          </Card>
          
          <Card className="border-[hsl(var(--muted))] bg-[hsl(var(--card))]">
            <CardContent className="pt-6 text-center">
              <Star className="h-10 w-10 mx-auto mb-4 text-[hsl(var(--primary))]" />
              <h3 className="text-lg font-bold mb-2">Expand Our Resources</h3>
              <p className="text-sm">Help us add more free AI resources and improve our recommendations.</p>
            </CardContent>
          </Card>
          
          <Card className="border-[hsl(var(--muted))] bg-[hsl(var(--card))]">
            <CardContent className="pt-6 text-center">
              <Heart className="h-10 w-10 mx-auto mb-4 text-[hsl(var(--primary))]" />
              <h3 className="text-lg font-bold mb-2">Support the Community</h3>
              <p className="text-sm">Your donation helps keep AI resources accessible for everyone.</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="prose text-[hsl(var(--foreground))] prose-headings:text-[hsl(var(--primary))]">
          <h2>Where Your Donation Goes</h2>
          <ul>
            <li>Server and hosting costs</li>
            <li>Development of new features</li>
            <li>Research and curation of free AI resources</li>
            <li>Improving resource recommendations</li>
            <li>Building educational content about AI tools</li>
          </ul>
          
          <p>
            Thank you for your support! If you have any questions or would like to contribute in other ways, please reach out to us.
          </p>
        </div>
      </main>
      
      <Footer />
      
      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isMobile && isOpen} onClose={close} />
    </div>
  );
}
