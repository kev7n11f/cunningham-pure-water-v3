'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Droplets, Snowflake, Shield, Leaf, Phone, Mail, MapPin, ChevronDown, Check, Award, Zap } from 'lucide-react';

// Generate varied splash droplets - different sizes, speeds, and trajectories
const generateSplashDroplets = (count: number) => {
  const droplets = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (((i * 7) % 10) / 10) * 0.3;
    const randomFactor = ((i * 1.618) % 1);
    const randomFactor2 = ((i * 2.718) % 1);
    
    droplets.push({
      angle,
      // Vary distance significantly for depth effect
      distance: 150 + randomFactor * 700 + randomFactor2 * 300,
      // Mix of small fast droplets and larger slower ones
      size: randomFactor < 0.3 ? 6 + randomFactor * 15 : 15 + randomFactor * 40,
      speed: randomFactor < 0.3 ? 1.2 + randomFactor * 0.5 : 0.6 + randomFactor * 0.6,
      // Elongation for motion blur effect
      elongation: 1.2 + randomFactor * 1.5,
      // Rotation for natural look
      rotation: randomFactor * 360,
      // Delay for staggered splash
      delay: randomFactor2 * 0.15,
      // Gravity effect - how much it curves down
      gravity: 0.3 + randomFactor * 0.7,
      // Z-depth for parallax
      zDepth: randomFactor,
    });
  }
  return droplets;
};

// Generate water streams - longer streaks of water
const generateWaterStreams = (count: number) => {
  const streams = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const randomFactor = ((i * 1.414) % 1);
    streams.push({
      angle,
      length: 100 + randomFactor * 200,
      width: 3 + randomFactor * 8,
      speed: 0.8 + randomFactor * 0.4,
      opacity: 0.4 + randomFactor * 0.4,
    });
  }
  return streams;
};

// Generate screen splatter points
const generateSplatters = (count: number) => {
  const splatters = [];
  for (let i = 0; i < count; i++) {
    const randomX = ((i * 3.14159) % 1);
    const randomY = ((i * 2.71828) % 1);
    splatters.push({
      x: (randomX - 0.5) * 100, // percentage from center
      y: (randomY - 0.5) * 100,
      size: 20 + ((i * 1.618) % 1) * 80,
      delay: ((i * 1.414) % 1) * 0.3,
      dripLength: 30 + ((i * 2.236) % 1) * 100,
    });
  }
  return splatters;
};

const SPLASH_DROPLETS = generateSplashDroplets(80);
const WATER_STREAMS = generateWaterStreams(24);
const SCREEN_SPLATTERS = generateSplatters(15);

// Realistic water droplet component
const WaterDroplet = ({ 
  data,
  scrollProgress 
}: { 
  data: typeof SPLASH_DROPLETS[0];
  scrollProgress: number;
}) => {
  const adjustedProgress = Math.max(0, scrollProgress - data.delay);
  const easedProgress = Math.pow(adjustedProgress, 0.6);
  const progress = Math.min(1, easedProgress * data.speed * 2);
  
  // Calculate position with gravity curve
  const baseX = Math.cos(data.angle) * data.distance * progress;
  const baseY = Math.sin(data.angle) * data.distance * progress;
  const gravityOffset = progress * progress * data.gravity * 200;
  
  const x = baseX;
  const y = baseY + gravityOffset;
  
  // Opacity with quick fade in and gradual fade out
  const opacity = adjustedProgress < 0.03 ? adjustedProgress * 33 : 
                  progress > 0.6 ? (1 - progress) * 2.5 : 1;
  
  // Scale increases slightly as droplet "approaches" viewer
  const scale = (0.3 + progress * 0.8) * (1 + data.zDepth * 0.5);
  
  // Elongate in direction of motion for speed effect
  const motionAngle = Math.atan2(y - baseY + 0.1, x) * (180 / Math.PI);
  
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: data.size,
        height: data.size * data.elongation,
        left: '50%',
        top: '50%',
        transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${data.rotation + motionAngle}deg)`,
        opacity: opacity * 0.95,
        background: `
          radial-gradient(ellipse at 30% 20%, 
            rgba(255, 255, 255, 0.95) 0%,
            rgba(200, 230, 250, 0.9) 20%,
            rgba(120, 190, 230, 0.8) 40%,
            rgba(60, 150, 200, 0.6) 70%,
            rgba(30, 100, 160, 0.3) 100%
          )
        `,
        boxShadow: `
          0 0 ${10 + data.size * 0.3}px rgba(100, 180, 230, 0.5),
          inset -${data.size * 0.1}px -${data.size * 0.1}px ${data.size * 0.3}px rgba(255,255,255,0.6),
          inset ${data.size * 0.05}px ${data.size * 0.05}px ${data.size * 0.2}px rgba(30, 100, 160, 0.3)
        `,
        borderRadius: '45% 45% 50% 50% / 40% 40% 60% 60%',
        filter: `blur(${data.zDepth * 1}px)`,
      }}
    />
  );
};

// Water stream component - elongated water trails
const WaterStream = ({
  data,
  scrollProgress
}: {
  data: typeof WATER_STREAMS[0];
  scrollProgress: number;
}) => {
  const progress = Math.min(1, scrollProgress * data.speed * 2.5);
  
  const startX = Math.cos(data.angle) * 50 * progress;
  const startY = Math.sin(data.angle) * 50 * progress;
  const endX = Math.cos(data.angle) * (50 + data.length) * progress;
  const endY = Math.sin(data.angle) * (50 + data.length) * progress;
  
  const opacity = scrollProgress < 0.05 ? scrollProgress * 20 :
                  progress > 0.5 ? (1 - progress) * 2 * data.opacity : data.opacity;
  
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: '50%',
        top: '50%',
        width: data.length * progress,
        height: data.width,
        transform: `translate(${startX}px, ${startY}px) rotate(${data.angle * (180 / Math.PI)}deg)`,
        transformOrigin: 'left center',
        opacity,
        background: `linear-gradient(90deg, 
          rgba(150, 210, 250, 0.8) 0%,
          rgba(100, 180, 230, 0.6) 50%,
          rgba(60, 150, 200, 0.2) 100%
        )`,
        borderRadius: '50px',
        filter: 'blur(1px)',
      }}
    />
  );
};

// Screen splatter - water hitting the "screen"
const ScreenSplatter = ({
  data,
  scrollProgress
}: {
  data: typeof SCREEN_SPLATTERS[0];
  scrollProgress: number;
}) => {
  const adjustedProgress = Math.max(0, scrollProgress - 0.3 - data.delay);
  const appearProgress = Math.min(1, adjustedProgress * 4);
  
  if (appearProgress <= 0) return null;
  
  const dripProgress = Math.max(0, adjustedProgress - 0.2) * 2;
  
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `calc(50% + ${data.x}%)`,
        top: `calc(50% + ${data.y}%)`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Main splatter blob */}
      <div
        style={{
          width: data.size * appearProgress,
          height: data.size * appearProgress * 0.8,
          background: `
            radial-gradient(ellipse at 40% 30%,
              rgba(255, 255, 255, 0.4) 0%,
              rgba(180, 220, 250, 0.3) 30%,
              rgba(100, 180, 230, 0.2) 60%,
              rgba(60, 150, 200, 0.1) 100%
            )
          `,
          borderRadius: '60% 40% 50% 50% / 50% 50% 40% 60%',
          boxShadow: `
            inset 0 0 ${data.size * 0.2}px rgba(255,255,255,0.3),
            0 0 ${data.size * 0.1}px rgba(100, 180, 230, 0.3)
          `,
          opacity: Math.max(0, 1 - adjustedProgress * 0.8),
        }}
      />
      {/* Drip running down */}
      <div
        style={{
          position: 'absolute',
          top: data.size * 0.6,
          left: '40%',
          width: 4 + data.size * 0.05,
          height: data.dripLength * dripProgress,
          background: `linear-gradient(180deg,
            rgba(150, 210, 250, 0.3) 0%,
            rgba(100, 180, 230, 0.4) 50%,
            rgba(60, 150, 200, 0.2) 100%
          )`,
          borderRadius: '50% 50% 50% 50% / 10% 10% 90% 90%',
          opacity: Math.max(0, 1 - adjustedProgress * 0.5),
        }}
      />
    </div>
  );
};

// Main Water Splash Effect Component - Bucket of water effect
const WaterSplash = ({ scrollProgress }: { scrollProgress: number }) => {
  // Global fade out - everything disappears as splash completes
  const globalFadeOut = scrollProgress > 0.7 ? Math.max(0, 1 - (scrollProgress - 0.7) * 3.33) : 1;
  
  // Don't render anything if fully faded out
  if (globalFadeOut <= 0) return null;
  
  // Main water mass that bursts toward viewer
  const centralScale = scrollProgress < 0.2 
    ? 1 + scrollProgress * 8 
    : Math.max(0, 2.6 - (scrollProgress - 0.2) * 4);
  
  const centralOpacity = (scrollProgress < 0.3 
    ? Math.min(1, scrollProgress * 5) 
    : Math.max(0, 1 - (scrollProgress - 0.3) * 2)) * globalFadeOut;

  // Water sheet that spreads across screen
  const sheetProgress = Math.max(0, scrollProgress - 0.15);
  const sheetScale = sheetProgress * 15;
  const sheetOpacity = (sheetProgress < 0.3 
    ? sheetProgress * 2 
    : Math.max(0, 0.6 - (sheetProgress - 0.3) * 1.5)) * globalFadeOut;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: globalFadeOut }}>
      {/* Background water mist/atmosphere */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, 
            rgba(100, 180, 230, ${0.15 * scrollProgress}) 0%,
            rgba(60, 150, 200, ${0.1 * scrollProgress}) 40%,
            transparent 70%
          )`,
          opacity: scrollProgress > 0.1 ? 1 : scrollProgress * 10,
        }}
      />
      
      {/* Central water mass - the "bucket" of water */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: 200,
          height: 250,
          transform: `translate(-50%, -50%) scale(${centralScale})`,
          opacity: centralOpacity,
          background: `
            radial-gradient(ellipse at 40% 30%, 
              rgba(255, 255, 255, 0.9) 0%,
              rgba(200, 235, 255, 0.85) 15%,
              rgba(140, 200, 240, 0.8) 30%,
              rgba(80, 170, 220, 0.7) 50%,
              rgba(40, 130, 190, 0.5) 70%,
              rgba(20, 90, 150, 0.3) 100%
            )
          `,
          boxShadow: `
            0 0 80px rgba(100, 180, 230, 0.6),
            0 0 160px rgba(60, 150, 200, 0.4),
            inset -20px -20px 60px rgba(255,255,255,0.5),
            inset 10px 10px 40px rgba(30, 100, 160, 0.3)
          `,
          borderRadius: '50% 50% 45% 45% / 55% 55% 45% 45%',
          filter: 'blur(2px)',
        }}
      >
        {/* Inner shine/highlight */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '20%',
            width: '40%',
            height: '30%',
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.8) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(8px)',
          }}
        />
      </div>
      
      {/* Expanding water sheet - spreads across screen */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: 100,
          height: 100,
          transform: `translate(-50%, -50%) scale(${sheetScale})`,
          background: `
            radial-gradient(ellipse at center,
              rgba(150, 210, 250, ${sheetOpacity * 0.4}) 0%,
              rgba(100, 180, 230, ${sheetOpacity * 0.3}) 30%,
              rgba(60, 150, 200, ${sheetOpacity * 0.15}) 60%,
              transparent 80%
            )
          `,
          borderRadius: '50%',
          filter: 'blur(20px)',
        }}
      />
      
      {/* Impact ripples */}
      {[1, 2, 3, 4, 5].map((ring) => {
        const ringDelay = ring * 0.04;
        const ringProgress = Math.max(0, scrollProgress - ringDelay);
        const ringScale = ringProgress * (ring + 4);
        const ringOpacity = Math.max(0, 0.5 - ringProgress * 0.8);
        
        return (
          <div
            key={ring}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: 80,
              height: 80,
              transform: `translate(-50%, -50%) scale(${ringScale})`,
              border: `${3 - ring * 0.4}px solid rgba(150, 210, 250, ${ringOpacity})`,
              boxShadow: `0 0 10px rgba(100, 180, 230, ${ringOpacity * 0.5})`,
              opacity: ringOpacity,
            }}
          />
        );
      })}
      
      {/* Water streams radiating outward */}
      {WATER_STREAMS.map((data, i) => (
        <WaterStream key={`stream-${i}`} data={data} scrollProgress={scrollProgress} />
      ))}
      
      {/* Splash droplets */}
      {SPLASH_DROPLETS.map((data, i) => (
        <WaterDroplet key={`droplet-${i}`} data={data} scrollProgress={scrollProgress} />
      ))}
      
      {/* Screen splatters - water hitting the "glass" */}
      {SCREEN_SPLATTERS.map((data, i) => (
        <ScreenSplatter key={`splatter-${i}`} data={data} scrollProgress={scrollProgress} />
      ))}
      
      {/* Screen water drip effect at edges */}
      {scrollProgress > 0.5 && (
        <>
          {[...Array(8)].map((_, i) => {
            const dripProgress = Math.max(0, scrollProgress - 0.5 - i * 0.03);
            const xPos = 10 + (i * 12);
            return (
              <div
                key={`drip-${i}`}
                className="absolute pointer-events-none"
                style={{
                  left: `${xPos}%`,
                  top: 0,
                  width: 6 + (i % 3) * 2,
                  height: dripProgress * 300,
                  background: `linear-gradient(180deg,
                    rgba(150, 210, 250, 0.4) 0%,
                    rgba(100, 180, 230, 0.5) 30%,
                    rgba(80, 170, 220, 0.3) 70%,
                    rgba(60, 150, 200, 0.1) 100%
                  )`,
                  borderRadius: '0 0 50% 50%',
                  opacity: Math.max(0, 1 - dripProgress * 0.5),
                }}
              />
            );
          })}
        </>
      )}
      
      {/* Fine mist spray overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: scrollProgress > 0.2 ? `
            radial-gradient(circle at 30% 40%, rgba(200, 230, 250, ${(scrollProgress - 0.2) * 0.15}) 0%, transparent 30%),
            radial-gradient(circle at 70% 30%, rgba(180, 220, 250, ${(scrollProgress - 0.2) * 0.12}) 0%, transparent 25%),
            radial-gradient(circle at 50% 70%, rgba(160, 210, 245, ${(scrollProgress - 0.2) * 0.1}) 0%, transparent 35%)
          ` : 'none',
          opacity: Math.max(0, 1 - (scrollProgress - 0.6) * 2),
        }}
      />
    </div>
  );
};

// Floating Water Droplets Background
const FloatingDroplets = () => {
  const dropletData = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${(i * 6.7) % 100}%`,
      delay: (i * 0.4) % 5,
      duration: 10 + (i % 5) * 2,
      size: 4 + (i % 4) * 3,
      xDrift: ((i * 17) % 80) - 40,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dropletData.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute"
          style={{
            left: drop.left,
            bottom: '-50px',
            width: drop.size,
            height: drop.size * 1.4,
            background: 'radial-gradient(ellipse at 30% 30%, rgba(168, 212, 240, 0.6), rgba(74, 158, 208, 0.3))',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            boxShadow: '0 0 10px rgba(74, 158, 208, 0.3)',
          }}
          animate={{
            y: [0, -1200],
            x: [0, drop.xDrift],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: drop.duration,
            delay: drop.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

// Video Background Component
const VideoBackground = ({ src, opacity = 0.3 }: { src: string; opacity?: number }) => (
  <div className="absolute inset-0 overflow-hidden z-0">
    <div className="absolute inset-0 bg-[#0A1628] z-0" />
    <iframe 
      src={`${src}&background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`} 
      className="absolute inset-0 w-full h-full scale-150 opacity-0 animate-fade-in"
      style={{ opacity }}
      allow="autoplay; fullscreen; picture-in-picture" 
      allowFullScreen
      title="Background Video"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/90 via-[#0E2240]/80 to-[#0A1628]/90 z-10" />
  </div>
);

// Animated Section Component
const AnimatedSection = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
};

// Product Card Component
const ProductCard = ({ icon: Icon, title, description, features, imageSrc, popular }: {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  imageSrc?: string;
  popular?: boolean;
}) => (
  <motion.div
    className={`product-card h-full relative overflow-hidden group ${popular ? 'border-2 border-[#9B4D5D]/50' : ''}`}
    whileHover={{ scale: 1.02, y: -10 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    {popular && (
      <div className="absolute top-0 right-0 bg-[#9B4D5D] text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-20">
        MOST POPULAR
      </div>
    )}
    
    {imageSrc && (
      <div className="relative h-64 -mx-8 -mt-8 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E2240] to-transparent z-10" />
        <Image 
          src={imageSrc} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 feature-icon">
          <Icon className="w-8 h-8 text-[#4A9ED0]" />
        </div>
      </div>
    )}
    
    {!imageSrc && (
      <div className="feature-icon mx-auto">
        <Icon className="w-12 h-12 text-[#4A9ED0]" />
      </div>
    )}
    
    <h3 className="text-2xl lg:text-3xl font-display font-bold text-white mb-5 text-center">{title}</h3>
    <p className="text-gray-300 mb-8 text-center text-lg">{description}</p>
    <ul className="space-y-4">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center gap-4 text-gray-200 text-lg">
          <Check className="w-6 h-6 text-[#9B4D5D] flex-shrink-0" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

// Contact Form Component
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Form submitted:', formData);
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div 
        className="text-center py-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#4A9ED0] to-[#1A6EA0] flex items-center justify-center">
          <Check className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-display font-bold text-white mb-2">Thank You!</h3>
        <p className="text-gray-300">We&apos;ll be in touch within 24 hours.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Email *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="you@company.com"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="(318) 555-0000"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Company</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Your company name"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-2">Message *</label>
        <textarea
          required
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Tell us about your water needs..."
        />
      </div>
      <motion.button
        type="submit"
        className="btn-primary w-full"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Get Your Free Quote'}
      </motion.button>
    </form>
  );
};

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [splashComplete, setSplashComplete] = useState(false);
  const [splashProgress, setSplashProgress] = useState(0);
  const accumulatedScroll = useRef(0);
  const splashDuration = 2500; // Total scroll pixels needed to complete splash (slower animation)
  
  // Lock scrolling and capture scroll events during splash animation
  useEffect(() => {
    if (splashComplete) return;
    
    const handleWheel = (e: WheelEvent) => {
      if (splashComplete) return;
      
      e.preventDefault();
      
      // Accumulate scroll delta
      accumulatedScroll.current += Math.abs(e.deltaY);
      
      // Calculate progress (0 to 1)
      const progress = Math.min(1, accumulatedScroll.current / splashDuration);
      setSplashProgress(progress);
      
      // When splash is complete, unlock scrolling
      if (progress >= 1) {
        setSplashComplete(true);
      }
    };
    
    // Prevent default scrolling during splash
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // Also handle touch scrolling
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (splashComplete) return;
      
      e.preventDefault();
      
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      touchStartY = touchY;
      
      accumulatedScroll.current += Math.abs(deltaY);
      const progress = Math.min(1, accumulatedScroll.current / splashDuration);
      setSplashProgress(progress);
      
      if (progress >= 1) {
        setSplashComplete(true);
      }
    };
    
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [splashComplete]);
  
  // After splash completes, use regular scroll for the rest of the page
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  });

  // Text fades out as user scrolls past 50% of hero section (after splash)
  const textOpacity = useTransform(
    scrollYProgress, 
    [0, 0.5, 0.8], 
    [1, 1, 0]
  );
  const textY = useTransform(scrollYProgress, [0.5, 0.8], [0, -50]);
  const textScale = useTransform(scrollYProgress, [0.5, 0.8], [1, 0.95]);

  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Cunningham Pure Water" width={180} height={60} className="h-12 w-auto" priority />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="nav-link">About</a>
            <a href="#products" className="nav-link">Products</a>
            <a href="#why-us" className="nav-link">Why Us</a>
            <a href="#contact" className="btn-primary text-sm py-2 px-6">Get Quote</a>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Scroll-Locked Animation */}
      <section ref={heroRef} className="relative h-[200vh]">
        {/* Sticky container keeps content visible while scrolling through 200vh */}
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] via-[#0E2240] to-[#1A3A5F]" />
          
          {/* Floating droplets background */}
          <FloatingDroplets />
          
          {/* Water Splash Effect - Driven by scroll */}
          <WaterSplash scrollProgress={splashProgress} />
          
          {/* Hero Content */}
          <motion.div 
            className="relative z-10 text-center px-6 max-w-5xl mx-auto w-full"
            style={{ 
              opacity: splashComplete ? textOpacity : 1, 
              y: splashComplete ? textY : 0, 
              scale: splashComplete ? textScale : 1 
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <span className="text-[#4A9ED0] font-medium tracking-[0.3em] uppercase text-sm md:text-base mb-6 block">
                Louisiana&apos;s Only Authorized Wellsys Dealer
              </span>
            </motion.div>
            
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-8 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <span className="gradient-text-burgundy">Cunningham</span>
              <br />
              <span className="gradient-text">Pure Water</span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-12 font-light text-center w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              Premium water solutions for Louisiana businesses. 
              No bottles. No hassle. Just pure, refreshing water.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <a href="#contact" className="btn-primary text-lg">
                Get Started
              </a>
              <a href="#products" className="btn-secondary text-lg">
                View Products
              </a>
            </motion.div>
          </motion.div>
          
          {/* Scroll Indicator - Fades out as user scrolls */}
          {splashProgress < 0.05 && !splashComplete && (
            <motion.div 
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="text-gray-400 text-sm tracking-wider">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronDown className="w-6 h-6 text-[#4A9ED0]" />
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen py-24 md:py-32 relative flex items-center justify-center border-t border-[#4A9ED0]/20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A3A5F] via-[#0E2240] to-[#0A1628]" />
        
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <AnimatedSection className="text-center mb-24">
            <span className="block text-[#8B3D4D] font-medium tracking-[0.3em] uppercase text-base md:text-lg">About Us</span>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-white mt-6 mb-10">
              Water Done <span className="gradient-text-burgundy">Right</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed text-center w-full max-w-4xl mx-auto">
              Cunningham Pure Water brings Wellsys&apos; industry-leading bottleless water coolers 
              and ice machines to Louisiana businesses. Advanced multi-stage filtration. 
              Sleek, modern design. Hassle-free rental programs.
            </p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-10 lg:gap-14">
            {[
              {
                icon: Droplets,
                title: 'Pure Filtration',
                description: '5-6 stage reverse osmosis removes 99%+ of contaminants for the cleanest water possible.',
              },
              {
                icon: Leaf,
                title: 'Eco-Friendly',
                description: 'Eliminate plastic bottle waste. Better for your business and the planet.',
              },
              {
                icon: Zap,
                title: 'Always Fresh',
                description: 'Hot, cold, and ambient water on demand. No jugs to lift, store, or schedule.',
              },
            ].map((item, i) => (
              <AnimatedSection key={i}>
                <div className="text-center p-10 lg:p-12 glass rounded-3xl min-h-[320px] flex flex-col justify-center">
                  <div className="feature-icon mx-auto">
                    <item.icon className="w-10 h-10 text-[#4A9ED0]" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-display font-bold text-white mb-5">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-lg">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="min-h-screen py-24 md:py-32 relative flex items-center justify-center border-t border-[#4A9ED0]/20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] via-[#0E2240] to-[#1A3A5F]" />
        
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <AnimatedSection className="text-center mb-20">
            <span className="block text-[#8B3D4D] font-medium tracking-[0.3em] uppercase text-base md:text-lg">Our Products</span>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-white mt-6">
              <span className="gradient-text-burgundy">Wellsys</span> Water Solutions
            </h2>
            <p className="text-gray-300 mt-8 text-xl md:text-2xl text-center w-full max-w-3xl mx-auto">
              Industry-leading water coolers and ice machines. Designed for reliability, built for performance.
            </p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            <AnimatedSection>
              <ProductCard
                icon={Droplets}
                title="Water Coolers"
                description="Free-standing and countertop models with advanced multi-stage filtration."
                imageSrc="https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=2131&auto=format&fit=crop"
                popular={true}
                features={[
                  'Hot, Cold & Ambient Options',
                  '5-6 Stage Reverse Osmosis',
                  'Touchless Dispensing Available',
                  'Energy Efficient Operation',
                  'Sleek, Modern Design',
                ]}
              />
            </AnimatedSection>
            
            <AnimatedSection>
              <ProductCard
                icon={Snowflake}
                title="Ice Machines"
                description="Commercial-grade ice production with built-in water purification."
                imageSrc="https://images.unsplash.com/photo-1633934542430-0905ccb5f050?q=80&w=2525&auto=format&fit=crop"
                features={[
                  'Up to 165 lbs Ice/Day',
                  'Chewable Ice Cubes',
                  'Built-in Water Filtration',
                  'Self-Sanitizing Options',
                  'Antimicrobial Protection',
                ]}
              />
            </AnimatedSection>
            
            <AnimatedSection>
              <ProductCard
                icon={Shield}
                title="Filtration Systems"
                description="Multi-stage purification that removes 99%+ of contaminants."
                imageSrc="https://images.unsplash.com/photo-1521410833026-94a53e994c6f?q=80&w=2668&auto=format&fit=crop"
                features={[
                  'Reverse Osmosis Membrane',
                  'Pre & Post Carbon Filters',
                  'Sediment Filtration',
                  'Mineral Enhancement Option',
                  'Regular Filter Service',
                ]}
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <section className="min-h-screen py-24 md:py-32 relative flex items-center justify-center border-t border-[#4A9ED0]/20 bg-[#0A1628]">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <AnimatedSection className="text-center mb-20">
            <span className="block text-[#8B3D4D] font-medium tracking-[0.3em] uppercase text-base md:text-lg">See It In Action</span>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-white mt-6">
              Experience <span className="gradient-text-burgundy">Purity</span>
            </h2>
            <p className="text-gray-300 mt-8 text-xl md:text-2xl text-center w-full max-w-3xl mx-auto">
              See how our advanced purification technology transforms your water supply.
            </p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {[
              "https://player.vimeo.com/video/761207400?h=95298ad517",
              "https://player.vimeo.com/video/1021104216?h=004efc2eb3",
              "https://player.vimeo.com/video/1022298850?h=a658ee9673",
              "https://player.vimeo.com/video/1057559362?h=a1204f5727"
            ].map((src, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-[#4A9ED0]/20 group bg-black">
                  <iframe 
                    src={`${src}&background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`} 
                    className="absolute inset-0 w-full h-full scale-105 group-hover:scale-100 transition-transform duration-700"
                    allow="autoplay; fullscreen; picture-in-picture" 
                    allowFullScreen
                    title={`Cunningham Pure Water Video ${i+1}`}
                  />
                  <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-2xl" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="min-h-screen py-24 md:py-32 relative flex items-center justify-center overflow-hidden border-t border-[#4A9ED0]/20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A3A5F] via-[#0E2240] to-[#0A1628]" />
        
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <AnimatedSection className="text-center mb-20">
            <span className="block text-[#8B3D4D] font-medium tracking-[0.3em] uppercase text-base md:text-lg">Why Choose Us</span>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-white mt-6">
              The <span className="gradient-text-burgundy">Cunningham</span> Difference
            </h2>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {[
              {
                icon: Award,
                title: 'Authorized Dealer',
                description: 'Louisiana\'s only authorized Wellsys dealer with direct manufacturer support.',
                accent: true,
              },
              {
                icon: Shield,
                title: 'Hassle-Free Rental',
                description: 'No upfront equipment costs. Simple monthly rental includes maintenance.',
                accent: false,
              },
              {
                icon: Leaf,
                title: 'Eco-Friendly',
                description: 'Eliminate plastic bottle waste and reduce your environmental footprint.',
                accent: true,
              },
              {
                icon: Droplets,
                title: 'Statewide Coverage',
                description: 'Serving all of Louisiana with reliable delivery and service.',
                accent: false,
              },
            ].map((item, i) => (
              <AnimatedSection key={i}>
                <div className="text-center p-10 lg:p-12">
                  <div className="feature-icon mx-auto">
                    <item.icon className={`w-10 h-10 ${item.accent ? 'text-[#9B4D5D]' : 'text-[#4A9ED0]'}`} />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen py-24 md:py-32 relative flex items-center justify-center border-t border-[#4A9ED0]/20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] to-[#0E2240]" />
        
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <AnimatedSection>
              <span className="text-[#8B3D4D] font-medium tracking-[0.3em] uppercase text-base md:text-lg">Get Started</span>
              <h2 className="text-5xl md:text-6xl font-display font-bold text-white mt-6 mb-8">
                Ready for <span className="gradient-text-burgundy">Pure</span> Water?
              </h2>
              <p className="text-gray-300 text-xl mb-12 leading-relaxed">
                Let us help you find the perfect water solution for your business. 
                Request a free, no-obligation quote and discover why Louisiana 
                businesses trust Cunningham Pure Water.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center border border-[#7B2D3D]/30">
                    <Phone className="w-7 h-7 text-[#9B4D5D]" />
                  </div>
                  <div>
                    <div className="text-base text-gray-400 mb-1">Call Us</div>
                    <a href="tel:3187277873" className="text-white text-2xl font-medium hover:text-[#9B4D5D] transition-colors">
                      (318) 727-PURE
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center">
                    <Mail className="w-7 h-7 text-[#4A9ED0]" />
                  </div>
                  <div>
                    <div className="text-base text-gray-400 mb-1">Email Us</div>
                    <a href="mailto:admin@officepurewater.com" className="text-white text-2xl font-medium hover:text-[#4A9ED0] transition-colors">
                      admin@officepurewater.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center border border-[#7B2D3D]/30">
                    <MapPin className="w-7 h-7 text-[#9B4D5D]" />
                  </div>
                  <div>
                    <div className="text-base text-gray-400 mb-1">Visit Us</div>
                    <span className="text-white text-2xl font-medium">1215 Texas Ave., Alexandria, LA 71301</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection>
              <div className="glass-dark rounded-3xl p-10 md:p-14">
                <ContactForm />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 md:py-20 relative">
        <div className="absolute inset-0 bg-[#0A1628]" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#7B2D3D] to-transparent" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <Image src="/logo.png" alt="Cunningham Pure Water" width={180} height={60} className="h-14 w-auto opacity-80" />
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-base">
                © {new Date().getFullYear()} Cunningham Pure Water LLC. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm mt-3">
                Louisiana&apos;s Only Authorized Wellsys Dealer
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
