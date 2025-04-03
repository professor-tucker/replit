import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';
import Footer from '@/components/Footer';
import MobileDrawer from '@/components/MobileDrawer';
import { useSidebar } from '@/lib/hooks/useSidebar';

export default function Home() {
  const { isOpen, isMobile, toggle, close } = useSidebar();
  const [showResourceCards, setShowResourceCards] = useState(false);

  return (
    <div className="bg-black text-[hsl(var(--foreground))] font-mono min-h-screen flex flex-col">
      <Header toggleSidebar={toggle} />
      
      <main className="flex-grow flex flex-col md:flex-row">
        <Sidebar isOpen={isOpen} isMobile={false} />
        <ChatInterface showResourceCards={showResourceCards} />
      </main>
      
      <Footer />
      
      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isMobile && isOpen} onClose={close} />
    </div>
  );
}
