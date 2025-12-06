'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Send, X, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// AquaBuddy - The animated water drop mascot
const AquaBuddyCharacter = ({ 
  isOpen, 
  isTalking, 
  onClick,
  mood = 'happy'
}: { 
  isOpen: boolean; 
  isTalking: boolean;
  onClick: () => void;
  mood?: 'happy' | 'excited' | 'thinking';
}) => {
  const bodyControls = useAnimation();
  const leftArmControls = useAnimation();
  const rightArmControls = useAnimation();
  const leftLegControls = useAnimation();
  const rightLegControls = useAnimation();

  // Dancing animation
  useEffect(() => {
    const dancingSequence = async () => {
      while (true) {
        // Bounce
        await bodyControls.start({
          y: [0, -15, 0, -10, 0],
          rotate: [0, -5, 5, -3, 0],
          scale: [1, 1.05, 0.95, 1.02, 1],
          transition: { duration: 2, ease: 'easeInOut' }
        });
        
        // Wave arms
        leftArmControls.start({
          rotate: [0, -30, 0, -20, 0],
          transition: { duration: 1.5, ease: 'easeInOut' }
        });
        rightArmControls.start({
          rotate: [0, 30, 0, 20, 0],
          transition: { duration: 1.5, ease: 'easeInOut', delay: 0.2 }
        });
        
        // Kick legs
        leftLegControls.start({
          rotate: [0, -15, 0, -10, 0],
          transition: { duration: 1.2, ease: 'easeInOut' }
        });
        rightLegControls.start({
          rotate: [0, 15, 0, 10, 0],
          transition: { duration: 1.2, ease: 'easeInOut', delay: 0.15 }
        });

        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    };

    dancingSequence();
  }, [bodyControls, leftArmControls, rightArmControls, leftLegControls, rightLegControls]);

  // Talking animation
  useEffect(() => {
    if (isTalking) {
      bodyControls.start({
        scale: [1, 1.08, 1, 1.05, 1],
        transition: { duration: 0.4, repeat: Infinity }
      });
    }
  }, [isTalking, bodyControls]);

  return (
    <motion.div
      className="cursor-pointer select-none"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{ width: 160, height: 200 }}
    >
      <svg viewBox="0 0 160 200" width="160" height="200">
        {/* Glow effect */}
        <defs>
          <radialGradient id="dropGlow" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#E8F4FC" stopOpacity="1" />
            <stop offset="40%" stopColor="#A8D4F0" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#4A9ED0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1A6EA0" stopOpacity="0.7" />
          </radialGradient>
          <radialGradient id="shine" cx="30%" cy="20%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#1A6EA0" floodOpacity="0.4"/>
          </filter>
        </defs>

        {/* Left Leg */}
        <motion.g 
          animate={leftLegControls}
          style={{ originX: '55px', originY: '140px' }}
        >
          <ellipse cx="55" cy="175" rx="12" ry="20" fill="#4A9ED0" filter="url(#shadow)" />
          <ellipse cx="55" cy="190" rx="15" ry="8" fill="#3A8EC0" />
        </motion.g>

        {/* Right Leg */}
        <motion.g 
          animate={rightLegControls}
          style={{ originX: '105px', originY: '140px' }}
        >
          <ellipse cx="105" cy="175" rx="12" ry="20" fill="#4A9ED0" filter="url(#shadow)" />
          <ellipse cx="105" cy="190" rx="15" ry="8" fill="#3A8EC0" />
        </motion.g>

        {/* Main Body */}
        <motion.g animate={bodyControls} filter="url(#shadow)">
          {/* Water drop body */}
          <path
            d="M80 10 
               C80 10 130 60 130 95 
               C130 130 110 145 80 145 
               C50 145 30 130 30 95 
               C30 60 80 10 80 10"
            fill="url(#dropGlow)"
            filter="url(#glow)"
          />
          
          {/* Shine highlight */}
          <ellipse cx="55" cy="60" rx="20" ry="25" fill="url(#shine)" />
          
          {/* Face */}
          {/* Left Eye */}
          <motion.g
            animate={mood === 'excited' ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5, repeat: mood === 'excited' ? Infinity : 0 }}
          >
            <ellipse cx="60" cy="80" rx="10" ry="12" fill="white" />
            <motion.ellipse 
              cx="62" 
              cy="82" 
              rx="5" 
              ry="6" 
              fill="#1A3A5F"
              animate={{ cy: [82, 80, 82] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <circle cx="64" cy="78" r="2" fill="white" />
          </motion.g>

          {/* Right Eye */}
          <motion.g
            animate={mood === 'excited' ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5, repeat: mood === 'excited' ? Infinity : 0, delay: 0.1 }}
          >
            <ellipse cx="100" cy="80" rx="10" ry="12" fill="white" />
            <motion.ellipse 
              cx="102" 
              cy="82" 
              rx="5" 
              ry="6" 
              fill="#1A3A5F"
              animate={{ cy: [82, 80, 82] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
            />
            <circle cx="104" cy="78" r="2" fill="white" />
          </motion.g>

          {/* Blush */}
          <ellipse cx="48" cy="95" rx="8" ry="5" fill="#FF9999" opacity="0.4" />
          <ellipse cx="112" cy="95" rx="8" ry="5" fill="#FF9999" opacity="0.4" />

          {/* Mouth */}
          <motion.path
            d={isTalking 
              ? "M65 105 Q80 120 95 105" 
              : "M65 105 Q80 115 95 105"}
            stroke="#1A3A5F"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            animate={isTalking ? {
              d: ["M65 105 Q80 120 95 105", "M65 105 Q80 108 95 105", "M65 105 Q80 120 95 105"]
            } : {}}
            transition={{ duration: 0.3, repeat: isTalking ? Infinity : 0 }}
          />

          {/* Eyebrows for expression */}
          {mood === 'thinking' && (
            <>
              <path d="M52 68 L68 72" stroke="#1A3A5F" strokeWidth="2" strokeLinecap="round" />
              <path d="M92 72 L108 68" stroke="#1A3A5F" strokeWidth="2" strokeLinecap="round" />
            </>
          )}
        </motion.g>

        {/* Left Arm */}
        <motion.g 
          animate={leftArmControls}
          style={{ originX: '35px', originY: '95px' }}
        >
          <ellipse cx="20" cy="95" rx="18" ry="12" fill="#4A9ED0" filter="url(#shadow)" />
          <ellipse cx="8" cy="95" rx="10" ry="8" fill="#5AAEE0" />
        </motion.g>

        {/* Right Arm */}
        <motion.g 
          animate={rightArmControls}
          style={{ originX: '125px', originY: '95px' }}
        >
          <ellipse cx="140" cy="95" rx="18" ry="12" fill="#4A9ED0" filter="url(#shadow)" />
          <ellipse cx="152" cy="95" rx="10" ry="8" fill="#5AAEE0" />
        </motion.g>

        {/* Sparkles around the character */}
        <motion.g
          animate={{ 
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <path d="M25 30 L28 35 L33 35 L29 38 L31 43 L25 40 L19 43 L21 38 L17 35 L22 35 Z" fill="#A8D4F0" />
        </motion.g>
        <motion.g
          animate={{ 
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <path d="M135 45 L137 48 L140 48 L138 50 L139 53 L135 51 L131 53 L132 50 L130 48 L133 48 Z" fill="#A8D4F0" />
        </motion.g>
        <motion.g
          animate={{ 
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        >
          <path d="M140 120 L142 123 L145 123 L143 125 L144 128 L140 126 L136 128 L137 125 L135 123 L138 123 Z" fill="#A8D4F0" />
        </motion.g>
      </svg>
      
      {/* Name tag */}
      {!isOpen && (
        <motion.div 
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-gradient-to-r from-[#7B2D3D] to-[#9B3D4D] text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Chat with AquaBuddy!</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Chat bubble component
const ChatBubble = ({ message, isUser }: { message: Message; isUser: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
  >
    <div
      className={`max-w-[85%] p-4 ${
        isUser
          ? 'text-[#4A9ED0]'
          : 'text-white'
      }`}
    >
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
    </div>
  </motion.div>
);

// Typing indicator
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex justify-start mb-4"
  >
    <div className="px-4 py-3">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-[#4A9ED0] rounded-full"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  </motion.div>
);

// Main AquaBuddy component
export default function AquaBuddy() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Listen for custom events to open chat with specific messages
  useEffect(() => {
    const handleOpenChat = (event: CustomEvent<{ message?: string; autoSend?: boolean }>) => {
      setIsOpen(true);
      
      // If there's a specific message to send/show
      if (event.detail?.message) {
        // Wait for chat to open, then send the message
        setTimeout(async () => {
          if (event.detail.autoSend) {
            // Auto-send a message to get AquaBuddy to respond about a topic
            const userMessage: Message = { role: 'user', content: event.detail.message! };
            setMessages(prev => {
              // If empty, add greeting first
              if (prev.length === 0) {
                return [userMessage];
              }
              return [...prev, userMessage];
            });
            
            // Send to API
            try {
              const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [userMessage] }),
              });
              const data = await response.json();
              if (data.message) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
              }
            } catch (error) {
              console.error('Failed to send message:', error);
            }
          }
        }, 100);
      }
    };

    window.addEventListener('openAquaBuddy', handleOpenChat as EventListener);
    return () => {
      window.removeEventListener('openAquaBuddy', handleOpenChat as EventListener);
    };
  }, []);

  // Send initial greeting when chat opens for the first time
  useEffect(() => {
    if (isOpen && !hasGreeted && messages.length === 0) {
      setHasGreeted(true);
      setMessages([{
        role: 'assistant',
        content: "Hey there! 💧 I'm AquaBuddy, your friendly water expert! I'm here to help you discover the amazing benefits of pure, filtered water for your workplace. Whether you're curious about our Wellsys water coolers, ice machines, or want to know why reverse osmosis water is the best choice for your team - just ask! And guess what? We offer FREE trial demo installations so you can taste the difference yourself! What would you like to know?"
      }]);
    }
  }, [isOpen, hasGreeted, messages.length]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      
      if (data.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Oops! Looks like I hit a little splash there! 💦 Could you try again? Or feel free to call us at (318) 727-PURE - we'd love to help!" 
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "Tell me about the water coolers",
    "What are the benefits of RO water?",
    "How does the free trial work?",
    "Why go bottleless?",
  ];

  return (
    <>
      {/* Floating AquaBuddy Character */}
      <motion.div
        className="fixed z-50 right-4 bottom-4 md:right-5 md:bottom-5"
        initial={{ x: 100, opacity: 0 }}
        animate={{
          x: 0,
          opacity: 1,
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        style={{
          display: isOpen ? 'none' : 'block' // Hide character when chat is open on mobile
        }}
      >
        <AquaBuddyCharacter
          isOpen={isOpen}
          isTalking={isLoading}
          onClick={() => setIsOpen(!isOpen)}
          mood={isLoading ? 'thinking' : 'happy'}
        />
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 md:inset-auto md:right-4 md:bottom-4 z-[100] md:w-[400px] md:h-[600px] flex flex-col bg-gradient-to-br from-[#0E2240]/98 to-[#0A1628]/98 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none rounded-none md:rounded-3xl"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {/* Chat container with transparent effect */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A9ED0] to-[#1A6EA0] flex items-center justify-center">
                    <span className="text-lg">💧</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold">AquaBuddy</h3>
                    <p className="text-xs text-[#4A9ED0]">Your Water Expert</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="min-w-[44px] min-h-[44px] rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((message, index) => (
                  <ChatBubble key={index} message={message} isUser={message.role === 'user'} />
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2">
                  <p className="text-xs text-gray-400 mb-2">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question, index) => (
                      <motion.button
                        key={index}
                        className="text-xs md:text-xs text-white px-4 py-2.5 md:py-2 rounded-full transition-colors hover:text-[#4A9ED0] bg-white/5 hover:bg-white/10"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setInput(question);
                          setTimeout(() => sendMessage(), 100);
                        }}
                      >
                        {question}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 pb-6 md:pb-4">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about pure water..."
                    className="flex-1 rounded-full px-4 py-3 md:py-3 min-h-[44px] text-white text-sm md:text-sm placeholder:text-gray-400 focus:outline-none transition-colors bg-transparent"
                  />
                  <motion.button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="min-w-[48px] min-h-[48px] rounded-full bg-gradient-to-r from-[#4A9ED0] to-[#1A6EA0] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
