import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileDrawer from '@/components/MobileDrawer';
import { useSidebar } from '@/lib/hooks/useSidebar';

export default function About() {
  const { isOpen, isMobile, toggle, close } = useSidebar();

  return (
    <div className="bg-black text-[hsl(var(--foreground))] font-mono min-h-screen flex flex-col">
      <Header toggleSidebar={toggle} />
      
      <main className="flex-grow flex flex-col max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">About <span className="text-[hsl(var(--primary))]">Superfishal Intelligence</span></h1>
        
        <div className="prose text-[hsl(var(--foreground))] prose-headings:text-[hsl(var(--primary))] prose-a:text-[hsl(var(--primary))]">
          <p>
            Welcome to Superfishal Intelligence, your comprehensive hub for discovering and utilizing free AI resources. Our mission is to aggregate quality, free tools from across the AI landscape to empower developers, researchers, students, and enthusiasts.
          </p>
          
          <h2>Our Mission</h2>
          <p>
            We believe that access to powerful AI tools should not be limited by financial constraints. By curating and organizing free resources, we aim to democratize access to artificial intelligence and foster innovation across all sectors.
          </p>
          
          <h2>What We Offer</h2>
          <ul>
            <li>Comprehensive directory of free AI models and tools</li>
            <li>Interactive guidance to help you find the right resources</li>
            <li>Code examples for implementation</li>
            <li>Information on free hosting options</li>
            <li>Community-driven resource recommendations</li>
          </ul>
          
          <h2>Categories We Cover</h2>
          <ul>
            <li>Large Language Models (LLMs)</li>
            <li>Data Analytics Tools</li>
            <li>Machine Learning Frameworks</li>
            <li>Computer Vision Resources</li>
            <li>Natural Language Processing Libraries</li>
            <li>Free Hosting Services</li>
            <li>API Integration Tools</li>
            <li>Educational Resources</li>
          </ul>
          
          <p>
            Superfishal Intelligence is constantly evolving. We regularly update our database with new resources and improve our recommendations based on user feedback and interactions.
          </p>
          
          <h2>Support This Project</h2>
          <p>
            Superfishal Intelligence is maintained as a free service. If you find our platform valuable, consider supporting us through donations. Your contributions help us maintain and improve the service.
          </p>
        </div>
      </main>
      
      <Footer />
      
      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isMobile && isOpen} onClose={close} />
    </div>
  );
}
