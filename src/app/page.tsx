'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Droplets, Snowflake, Shield, Leaf, Phone, Mail, MapPin, ChevronDown, Check, Award, Zap } from 'lucide-react';

// Generate stable random values for particles
const generateParticleData = (count: number) => {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const randomOffset = (i * 1.618) % 1; // Golden ratio for pseudo-random distribution
    particles.push({
      angle,
      distance: 200 + randomOffset * 600,
      size: 10 + (randomOffset * 30),
      speed: 0.8 + randomOffset * 0.4,
      xOffset: ((i * 7) % 100) - 50,
    });
  }
  return particles;
};

const PARTICLE_DATA = generateParticleData(50);

// Water Splash Particle - Explodes across screen on scroll
const SplashParticle = ({ 
  data,
  scrollProgress 
}: { 
  data: typeof PARTICLE_DATA[0];
  scrollProgress: number;
}) => {
  const progress = Math.min(1, scrollProgress * data.speed * 1.5);
  
  // Particles start from center and explode outward
  const x = Math.cos(data.angle) * data.distance * progress + data.xOffset * progress;
  const y = Math.sin(data.angle) * data.distance * progress - (progress * 150);
  
  // Fade in quickly, then fade out as they reach the edges
  const opacity = progress < 0.1 ? progress * 10 : 
                  progress > 0.7 ? (1 - progress) * 3.33 : 1;
  
  const scale = 0.3 + progress * 1.2;
  
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: data.size,
        height: data.size * 1.4,
        left: '50%',
        top: '50%',
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        opacity: opacity * 0.9,
        background: `radial-gradient(ellipse at 30% 30%, rgba(168, 212, 240, 0.95), rgba(74, 158, 208, 0.7), rgba(26, 110, 160, 0.4))`,
        boxShadow: `0 0 ${20 + progress * 20}px rgba(74, 158, 208, ${0.5 + progress * 0.3}), inset -2px -2px 10px rgba(255,255,255,0.4)`,
        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
      }}
    />
  );
};

// Main Water Splash Effect Component
const WaterSplash = ({ scrollProgress }: { scrollProgress: number }) => {
  // Central water droplet that "bursts"
  const centralScale = scrollProgress < 0.3 
    ? 1 + scrollProgress * 2 
    : Math.max(0, 1.6 - (scrollProgress - 0.3) * 4);
  
  const centralOpacity = scrollProgress < 0.4 
    ? 0.9 
    : Math.max(0, 0.9 - (scrollProgress - 0.4) * 2);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Central water droplet */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: 120,
          height: 160,
          transform: `translate(-50%, -50%) scale(${centralScale})`,
          opacity: centralOpacity,
          background: `radial-gradient(ellipse at 35% 25%, rgba(200, 230, 255, 0.95), rgba(74, 158, 208, 0.8) 40%, rgba(26, 110, 160, 0.6) 70%, rgba(10, 60, 120, 0.4))`,
          boxShadow: `
            0 0 60px rgba(74, 158, 208, 0.6),
            0 0 120px rgba(74, 158, 208, 0.3),
            inset -8px -8px 40px rgba(255,255,255,0.4),
            inset 4px 4px 20px rgba(26, 110, 160, 0.3)
          `,
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        }}
      />
      
      {/* Expanding ripple rings */}
      {[1, 2, 3, 4].map((ring) => {
        const ringProgress = Math.max(0, scrollProgress - ring * 0.08);
        const ringScale = ringProgress * (ring + 2);
        const ringOpacity = Math.max(0, 0.6 - ringProgress * 1.5);
        
        return (
          <div
            key={ring}
            className="absolute left-1/2 top-1/2 rounded-full border-2"
            style={{
              width: 100,
              height: 100,
              transform: `translate(-50%, -50%) scale(${ringScale})`,
              borderColor: `rgba(74, 158, 208, ${ringOpacity})`,
              opacity: ringOpacity,
            }}
          />
        );
      })}
      
      {/* Splash particles */}
      {PARTICLE_DATA.map((data, i) => (
        <SplashParticle key={i} data={data} scrollProgress={scrollProgress} />
      ))}
      
      {/* Mist/spray effect */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: 600 + scrollProgress * 800,
          height: 600 + scrollProgress * 800,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, rgba(74, 158, 208, ${0.15 * scrollProgress}) 0%, transparent 70%)`,
          filter: 'blur(40px)',
          opacity: scrollProgress > 0.2 ? Math.min(1, (scrollProgress - 0.2) * 2) : 0,
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

// Animated Section Component
const AnimatedSection = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

// Product Card Component
const ProductCard = ({ icon: Icon, title, description, features }: {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
}) => (
  <motion.div
    className="product-card h-full"
    whileHover={{ scale: 1.02, y: -10 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="feature-icon mx-auto">
      <Icon className="w-10 h-10 text-[#4A9ED0]" />
    </div>
    <h3 className="text-2xl font-display font-bold text-white mb-4 text-center">{title}</h3>
    <p className="text-gray-300 mb-6 text-center">{description}</p>
    <ul className="space-y-3">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center gap-3 text-gray-200">
          <Check className="w-5 h-5 text-[#4A9ED0] flex-shrink-0" />
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
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  });
  
  // The splash animation is driven by scroll progress from 0 to 1
  // 0-0.5: Splash animation plays while page is pinned
  // 0.5-1: Text fades out, preparing for next section
  const splashProgress = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const [splashValue, setSplashValue] = useState(0);
  
  useEffect(() => {
    const unsubscribe = splashProgress.on('change', (v) => setSplashValue(v));
    return () => unsubscribe();
  }, [splashProgress]);

  // Text animations - fade out as splash progresses
  const textOpacity = useTransform(scrollYProgress, [0, 0.15, 0.5, 0.7], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.15, 0.5, 0.7], [50, 0, 0, -100]);
  const textScale = useTransform(scrollYProgress, [0.5, 0.7], [1, 0.9]);
  
  // Scroll hint fades out once user starts scrolling
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

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
      {/* The section is 300vh tall to give scroll room while viewport stays pinned */}
      <section ref={heroRef} className="relative h-[300vh]">
        {/* Sticky container - stays fixed while user scrolls through the 300vh */}
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] via-[#0E2240] to-[#1A3A5F]" />
          
          {/* Floating droplets background */}
          <FloatingDroplets />
          
          {/* Water Splash Effect - Driven by scroll */}
          <WaterSplash scrollProgress={splashValue} />
          
          {/* Hero Content */}
          <motion.div 
            className="relative z-10 text-center px-6 max-w-5xl mx-auto w-full"
            style={{ opacity: textOpacity, y: textY, scale: textScale }}
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
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto font-light"
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
          <motion.div 
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            style={{ opacity: scrollHintOpacity }}
          >
            <span className="text-gray-400 text-sm tracking-wider">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-6 h-6 text-[#4A9ED0]" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A3A5F] via-[#0E2240] to-[#0A1628]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <AnimatedSection className="text-center mb-20">
            <span className="text-[#4A9ED0] font-medium tracking-[0.2em] uppercase text-sm">About Us</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mt-4 mb-8">
              Water Done Right
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Cunningham Pure Water brings Wellsys&apos; industry-leading bottleless water coolers 
              and ice machines to Louisiana businesses. Advanced multi-stage filtration. 
              Sleek, modern design. Hassle-free rental programs.
            </p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8">
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
                <div className="text-center p-8 glass rounded-3xl">
                  <div className="feature-icon mx-auto">
                    <item.icon className="w-8 h-8 text-[#4A9ED0]" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] via-[#0E2240] to-[#1A3A5F]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <span className="text-[#4A9ED0] font-medium tracking-[0.2em] uppercase text-sm">Our Products</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mt-4">
              Wellsys Water Solutions
            </h2>
            <p className="text-gray-300 mt-6 max-w-2xl mx-auto text-lg">
              Industry-leading water coolers and ice machines. Designed for reliability, built for performance.
            </p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedSection>
              <ProductCard
                icon={Droplets}
                title="Water Coolers"
                description="Free-standing and countertop models with advanced multi-stage filtration."
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

      {/* Why Us Section */}
      <section id="why-us" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A3A5F] via-[#0E2240] to-[#0A1628]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <span className="text-[#4A9ED0] font-medium tracking-[0.2em] uppercase text-sm">Why Choose Us</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mt-4">
              The Cunningham Difference
            </h2>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: 'Authorized Dealer',
                description: 'Louisiana\'s only authorized Wellsys dealer with direct manufacturer support.',
              },
              {
                icon: Shield,
                title: 'Hassle-Free Rental',
                description: 'No upfront equipment costs. Simple monthly rental includes maintenance.',
              },
              {
                icon: Leaf,
                title: 'Eco-Friendly',
                description: 'Eliminate plastic bottle waste and reduce your environmental footprint.',
              },
              {
                icon: Droplets,
                title: 'Statewide Coverage',
                description: 'Serving all of Louisiana with reliable delivery and service.',
              },
            ].map((item, i) => (
              <AnimatedSection key={i}>
                <div className="text-center p-8">
                  <div className="feature-icon mx-auto">
                    <item.icon className="w-8 h-8 text-[#4A9ED0]" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628] to-[#0E2240]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <span className="text-[#4A9ED0] font-medium tracking-[0.2em] uppercase text-sm">Get Started</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mt-4 mb-6">
                Ready for Pure Water?
              </h2>
              <p className="text-gray-300 text-lg mb-10 leading-relaxed">
                Let us help you find the perfect water solution for your business. 
                Request a free, no-obligation quote and discover why Louisiana 
                businesses trust Cunningham Pure Water.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center">
                    <Phone className="w-6 h-6 text-[#4A9ED0]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Call Us</div>
                    <a href="tel:3187277873" className="text-white text-xl font-medium hover:text-[#4A9ED0] transition-colors">
                      (318) 727-PURE
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#4A9ED0]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Email Us</div>
                    <a href="mailto:admin@officepurewater.com" className="text-white text-xl font-medium hover:text-[#4A9ED0] transition-colors">
                      admin@officepurewater.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[#4A9ED0]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Visit Us</div>
                    <span className="text-white text-xl font-medium">1215 Texas Ave., Alexandria, LA 71301</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection>
              <div className="glass-dark rounded-3xl p-8 md:p-10">
                <ContactForm />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 relative">
        <div className="absolute inset-0 bg-[#0A1628]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Image src="/logo.png" alt="Cunningham Pure Water" width={150} height={50} className="h-10 w-auto opacity-80" />
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Cunningham Pure Water LLC. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Louisiana&apos;s Only Authorized Wellsys Dealer
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
