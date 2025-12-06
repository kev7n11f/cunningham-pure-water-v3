'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Droplets, Snowflake, Shield, Leaf, Phone, Mail, MapPin, ChevronDown, Check, Award, Zap } from 'lucide-react';

// Generate realistic splash droplets with physics-based properties
const generateSplashDroplets = (count: number) => {
  const droplets = [];
  for (let i = 0; i < count; i++) {
    // Use golden ratio for even distribution
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const angle = i * goldenAngle + (Math.random() * 0.3 - 0.15);
    const randomFactor = ((i * 1.618033988749) % 1);
    const randomFactor2 = ((i * 2.718281828459) % 1);
    const randomFactor3 = ((i * 3.141592653589) % 1);
    
    // Categorize droplets: large slow, medium, small fast, tiny mist
    const category = randomFactor < 0.15 ? 'large' : 
                     randomFactor < 0.4 ? 'medium' : 
                     randomFactor < 0.75 ? 'small' : 'mist';
    
    const props = {
      large: { size: 35 + randomFactor2 * 30, speed: 0.4 + randomFactor3 * 0.2, distance: 200 + randomFactor * 400 },
      medium: { size: 15 + randomFactor2 * 18, speed: 0.6 + randomFactor3 * 0.3, distance: 300 + randomFactor * 500 },
      small: { size: 6 + randomFactor2 * 10, speed: 0.9 + randomFactor3 * 0.4, distance: 400 + randomFactor * 600 },
      mist: { size: 2 + randomFactor2 * 5, speed: 1.1 + randomFactor3 * 0.5, distance: 500 + randomFactor * 700 },
    }[category];
    
    droplets.push({
      angle,
      distance: props.distance,
      size: props.size,
      speed: props.speed,
      category,
      // Realistic elongation based on size (smaller = more elongated in motion)
      elongation: category === 'mist' ? 2.5 + randomFactor * 1.5 : 1.3 + randomFactor * 0.8,
      rotation: randomFactor3 * 360,
      delay: randomFactor2 * 0.12,
      // Gravity increases with size
      gravity: category === 'large' ? 0.8 + randomFactor * 0.4 : 
               category === 'medium' ? 0.5 + randomFactor * 0.3 : 0.2 + randomFactor * 0.2,
      zDepth: randomFactor,
      // Surface tension affects shape
      surfaceTension: 0.3 + randomFactor2 * 0.7,
      // Spin for tumbling effect
      spin: (randomFactor3 - 0.5) * 720,
      // Secondary droplet spawning
      hasTrail: category !== 'mist' && randomFactor > 0.6,
    });
  }
  return droplets;
};

// Generate water streams with realistic fluid dynamics
const generateWaterStreams = (count: number) => {
  const streams = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.2 - 0.1);
    const randomFactor = ((i * 1.414213562373) % 1);
    const randomFactor2 = ((i * 1.732050807569) % 1);
    streams.push({
      angle,
      length: 120 + randomFactor * 280,
      width: 2 + randomFactor2 * 6,
      speed: 0.7 + randomFactor * 0.5,
      opacity: 0.5 + randomFactor2 * 0.4,
      waviness: randomFactor * 15,
      taper: 0.3 + randomFactor2 * 0.5,
    });
  }
  return streams;
};

// Generate screen splatter with realistic splash physics
const generateSplatters = (count: number) => {
  const splatters = [];
  for (let i = 0; i < count; i++) {
    const randomX = ((i * 3.14159265) % 1);
    const randomY = ((i * 2.71828182) % 1);
    const randomFactor = ((i * 1.61803398) % 1);
    splatters.push({
      x: (randomX - 0.5) * 120,
      y: (randomY - 0.5) * 80,
      size: 25 + randomFactor * 100,
      delay: randomFactor * 0.25,
      dripLength: 40 + ((i * 2.23606797) % 1) * 150,
      dripWidth: 3 + randomFactor * 4,
      subDroplets: Math.floor(3 + randomFactor * 5),
      spreadAngle: 30 + randomFactor * 60,
    });
  }
  return splatters;
};

// Generate caustic light patterns
const generateCaustics = (count: number) => {
  const caustics = [];
  for (let i = 0; i < count; i++) {
    const randomFactor = ((i * 1.618) % 1);
    const randomFactor2 = ((i * 2.718) % 1);
    caustics.push({
      x: randomFactor * 100,
      y: randomFactor2 * 100,
      size: 50 + randomFactor * 150,
      intensity: 0.1 + randomFactor2 * 0.2,
      phase: randomFactor * Math.PI * 2,
      delay: 0.05 + randomFactor * 0.2, // Stagger the caustic appearance
    });
  }
  return caustics;
};

const SPLASH_DROPLETS = generateSplashDroplets(120);
const WATER_STREAMS = generateWaterStreams(32);
const SCREEN_SPLATTERS = generateSplatters(18);
const CAUSTICS = generateCaustics(12);

// Realistic water droplet with refraction and highlights
const WaterDroplet = ({ 
  data,
  scrollProgress 
}: { 
  data: typeof SPLASH_DROPLETS[0];
  scrollProgress: number;
}) => {
  const adjustedProgress = Math.max(0, scrollProgress - data.delay);
  const easedProgress = Math.pow(adjustedProgress, 0.5);
  const progress = Math.min(1, easedProgress * data.speed * 2.2);
  
  // Physics-based trajectory with gravity
  const baseX = Math.cos(data.angle) * data.distance * progress;
  const baseY = Math.sin(data.angle) * data.distance * progress;
  const gravityOffset = progress * progress * data.gravity * 280;
  const airResistance = 1 - progress * 0.15;
  
  const x = baseX * airResistance;
  const y = baseY + gravityOffset;
  
  // Realistic opacity falloff
  const opacity = adjustedProgress < 0.02 ? adjustedProgress * 50 : 
                  progress > 0.5 ? Math.pow(1 - progress, 1.5) * 2 : 1;
  
  // Scale based on z-depth (perspective)
  const perspectiveScale = (0.4 + progress * 0.7) * (0.8 + data.zDepth * 0.6);
  
  // Rotation from spin and motion direction
  const motionAngle = Math.atan2(gravityOffset + 1, x || 1) * (180 / Math.PI);
  const totalRotation = data.rotation + motionAngle + (data.spin * progress);
  
  // Deformation based on velocity (Weber number simulation)
  const velocity = data.speed * (1 - progress * 0.3);
  const deformation = 1 + velocity * 0.15 * (1 - data.surfaceTension);
  
  if (opacity < 0.01) return null;
  
  return (
    <>
      <div
        className="absolute pointer-events-none"
        style={{
          width: data.size * deformation,
          height: data.size * data.elongation / deformation,
          left: '50%',
          top: '50%',
          transform: `translate(${x}px, ${y}px) scale(${perspectiveScale}) rotate(${totalRotation}deg)`,
          opacity: opacity * 0.92,
          background: data.category === 'mist' 
            ? `radial-gradient(ellipse at 35% 25%, 
                rgba(255, 255, 255, 0.8) 0%,
                rgba(200, 230, 255, 0.5) 40%,
                rgba(150, 200, 240, 0.2) 100%
              )`
            : `radial-gradient(ellipse at 30% 20%, 
                rgba(255, 255, 255, 0.98) 0%,
                rgba(240, 250, 255, 0.95) 8%,
                rgba(200, 235, 255, 0.9) 20%,
                rgba(150, 210, 250, 0.85) 35%,
                rgba(100, 180, 235, 0.75) 50%,
                rgba(60, 150, 210, 0.6) 65%,
                rgba(40, 120, 180, 0.4) 80%,
                rgba(30, 90, 150, 0.2) 100%
              )`,
          boxShadow: data.category === 'mist' ? 'none' : `
            0 0 ${8 + data.size * 0.2}px rgba(100, 190, 240, 0.4),
            0 0 ${15 + data.size * 0.4}px rgba(60, 150, 210, 0.2),
            inset -${data.size * 0.12}px -${data.size * 0.08}px ${data.size * 0.25}px rgba(255,255,255,0.7),
            inset ${data.size * 0.06}px ${data.size * 0.04}px ${data.size * 0.15}px rgba(30, 100, 170, 0.25)
          `,
          borderRadius: data.category === 'large' 
            ? '48% 52% 45% 55% / 50% 45% 55% 50%'
            : '45% 55% 50% 50% / 45% 50% 50% 55%',
          filter: data.category === 'mist' ? `blur(${1 + data.zDepth * 2}px)` : `blur(${data.zDepth * 0.8}px)`,
        }}
      >
        {/* Primary highlight - simulates light refraction */}
        {data.category !== 'mist' && (
          <div
            style={{
              position: 'absolute',
              top: '12%',
              left: '18%',
              width: '35%',
              height: '25%',
              background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(1px)',
              transform: 'rotate(-20deg)',
            }}
          />
        )}
        {/* Secondary highlight */}
        {data.category === 'large' && (
          <div
            style={{
              position: 'absolute',
              top: '55%',
              left: '60%',
              width: '18%',
              height: '12%',
              background: 'radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(1px)',
            }}
          />
        )}
      </div>
      
      {/* Trail droplets for larger drops */}
      {data.hasTrail && progress > 0.2 && progress < 0.8 && (
        <div
          className="absolute pointer-events-none"
          style={{
            width: data.size * 0.3,
            height: data.size * 0.4,
            left: '50%',
            top: '50%',
            transform: `translate(${x * 0.85}px, ${y * 0.85 - 10}px) scale(${perspectiveScale * 0.6})`,
            opacity: opacity * 0.5,
            background: `radial-gradient(ellipse at 35% 30%, 
              rgba(255, 255, 255, 0.9) 0%,
              rgba(180, 220, 250, 0.7) 40%,
              rgba(100, 180, 230, 0.3) 100%
            )`,
            borderRadius: '45% 55% 50% 50% / 40% 40% 60% 60%',
            filter: 'blur(1px)',
          }}
        />
      )}
    </>
  );
};

// Realistic water stream with fluid dynamics
const WaterStream = ({
  data,
  scrollProgress
}: {
  data: typeof WATER_STREAMS[0];
  scrollProgress: number;
}) => {
  const progress = Math.min(1, scrollProgress * data.speed * 2.8);
  
  // Curved trajectory with gravity influence
  const startDist = 40 * progress;
  const endDist = (40 + data.length) * progress;
  const gravityBend = progress * progress * 0.3;
  
  const startX = Math.cos(data.angle) * startDist;
  const startY = Math.sin(data.angle) * startDist + gravityBend * startDist;
  
  // Tapered width (thinner at the end)
  const taperFactor = 1 - (progress * data.taper * 0.5);
  const endWidth = data.width * taperFactor;
  
  const opacity = scrollProgress < 0.04 ? scrollProgress * 25 :
                  progress > 0.45 ? Math.pow(1 - progress, 1.5) * 2 * data.opacity : data.opacity;
  
  if (opacity < 0.01) return null;
  
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: '50%',
        top: '50%',
        width: data.length * progress,
        height: data.width,
        transform: `translate(${startX}px, ${startY}px) rotate(${data.angle * (180 / Math.PI) + gravityBend * 20}deg)`,
        transformOrigin: 'left center',
        opacity,
        background: `linear-gradient(90deg, 
          rgba(220, 245, 255, 0.9) 0%,
          rgba(170, 220, 250, 0.8) 15%,
          rgba(120, 195, 240, 0.65) 40%,
          rgba(80, 165, 220, 0.45) 70%,
          rgba(50, 140, 200, 0.15) 100%
        )`,
        borderRadius: `${data.width}px ${data.width * taperFactor}px ${data.width * taperFactor}px ${data.width}px / 50%`,
        boxShadow: `
          0 0 ${data.width * 2}px rgba(100, 190, 240, 0.3),
          inset 0 -${data.width * 0.3}px ${data.width * 0.5}px rgba(255,255,255,0.4)
        `,
        filter: 'blur(0.5px)',
      }}
    />
  );
};

// Realistic screen splatter with sub-droplets and proper fluid physics
const ScreenSplatter = ({
  data,
  scrollProgress
}: {
  data: typeof SCREEN_SPLATTERS[0];
  scrollProgress: number;
}) => {
  const adjustedProgress = Math.max(0, scrollProgress - 0.25 - data.delay);
  const impactProgress = Math.min(1, adjustedProgress * 5);
  const spreadProgress = Math.min(1, adjustedProgress * 3);
  
  const dripProgress = Math.max(0, adjustedProgress - 0.15) * 1.8;
  const fadeOut = scrollProgress > 0.7 ? Math.max(0, 1 - (scrollProgress - 0.7) * 3) : 1;
  
  // Generate sub-droplet positions
  const subDroplets = useMemo(() => {
    const drops = [];
    for (let i = 0; i < data.subDroplets; i++) {
      const angle = (data.spreadAngle * (i / data.subDroplets - 0.5)) * (Math.PI / 180);
      const dist = 15 + ((i * 1.618) % 1) * 35;
      drops.push({
        x: Math.cos(angle + Math.PI / 2) * dist,
        y: Math.sin(angle + Math.PI / 2) * dist + dist * 0.3,
        size: 4 + ((i * 2.718) % 1) * 8,
        delay: i * 0.02,
      });
    }
    return drops;
  }, [data.subDroplets, data.spreadAngle]);
    return drops;
  }, [data.subDroplets, data.spreadAngle]);
  
  if (impactProgress <= 0) return null;
  
  return (
      style={{
        left: `calc(50% + ${data.x}%)`,
        top: `calc(50% + ${data.y}%)`,
        transform: 'translate(-50%, -50%)',
        opacity: fadeOut,
      }}
    >
      {/* Main splatter blob with realistic refraction */}
      <div
        style={{
          width: data.size * impactProgress,
          height: data.size * impactProgress * 0.75,
          background: `
            radial-gradient(ellipse at 35% 25%,
              rgba(255, 255, 255, 0.5) 0%,
              rgba(230, 245, 255, 0.4) 15%,
              rgba(180, 225, 250, 0.3) 35%,
              rgba(120, 195, 240, 0.2) 55%,
              rgba(80, 165, 220, 0.1) 75%,
              transparent 100%
            )
          `,
          borderRadius: '55% 45% 48% 52% / 45% 52% 48% 55%',
          boxShadow: `
            inset 0 0 ${data.size * 0.15}px rgba(255,255,255,0.4),
            inset -${data.size * 0.05}px -${data.size * 0.03}px ${data.size * 0.1}px rgba(100, 180, 230, 0.2),
            0 0 ${data.size * 0.08}px rgba(100, 190, 240, 0.25)
          `,
          opacity: Math.max(0, 1 - adjustedProgress * 0.7),
          transform: `scale(${1 + spreadProgress * 0.2})`,
        }}
      >
        {/* Inner highlight for refraction effect */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '20%',
            width: '30%',
            height: '20%',
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.7) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(2px)',
          }}
        />
      </div>
      
      {/* Sub-droplets from splash */}
      {subDroplets.map((drop, i) => {
        const dropProgress = Math.max(0, spreadProgress - drop.delay);
        if (dropProgress <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: drop.x * dropProgress,
              top: drop.y * dropProgress,
              width: drop.size,
              height: drop.size * 1.2,
              background: `radial-gradient(ellipse at 35% 30%, 
                rgba(255, 255, 255, 0.85) 0%,
                rgba(180, 220, 250, 0.6) 40%,
                rgba(100, 180, 230, 0.3) 100%
              )`,
              borderRadius: '45% 55% 50% 50% / 40% 40% 60% 60%',
              opacity: Math.max(0, 0.8 - dropProgress * 0.6),
              boxShadow: '0 0 4px rgba(100, 190, 240, 0.3)',
            }}
          />
        );
      })}
      
      {/* Main drip running down with realistic shape */}
      <div
        style={{
          position: 'absolute',
          top: data.size * 0.5 * impactProgress,
          left: '45%',
          width: data.dripWidth,
          height: data.dripLength * dripProgress,
          background: `linear-gradient(180deg,
            rgba(200, 235, 255, 0.45) 0%,
            rgba(150, 215, 250, 0.5) 20%,
            rgba(100, 185, 240, 0.45) 60%,
            rgba(70, 160, 220, 0.3) 85%,
            rgba(50, 140, 200, 0.15) 100%
          )`,
          borderRadius: '40% 40% 50% 50% / 5% 5% 95% 95%',
          opacity: Math.max(0, 1 - adjustedProgress * 0.4) * fadeOut,
          boxShadow: `
            inset -1px 0 2px rgba(255,255,255,0.3),
            0 0 3px rgba(100, 180, 230, 0.2)
          `,
        }}
      >
        {/* Drip highlight */}
        <div
          style={{
            position: 'absolute',
            left: '20%',
            top: 0,
            width: '30%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            borderRadius: 'inherit',
          }}
        />
      </div>
      
      {/* Secondary smaller drip */}
      {dripProgress > 0.3 && (
        <div
          style={{
            position: 'absolute',
            top: data.size * 0.6 * impactProgress,
            left: '60%',
            width: data.dripWidth * 0.6,
            height: data.dripLength * 0.5 * Math.max(0, dripProgress - 0.3) * 1.4,
            background: `linear-gradient(180deg,
              rgba(180, 225, 250, 0.4) 0%,
              rgba(120, 195, 240, 0.35) 50%,
              rgba(80, 165, 220, 0.2) 100%
            )`,
            borderRadius: '40% 40% 50% 50% / 5% 5% 95% 95%',
            opacity: Math.max(0, 0.8 - adjustedProgress * 0.4) * fadeOut,
          }}
        />
      )}
    </div>
  );
};

// Main Water Splash Effect Component - Ultra-realistic bucket of water effect
const WaterSplash = ({ scrollProgress }: { scrollProgress: number }) => {
  // Global fade out - everything disappears as splash completes
  const globalFadeOut = scrollProgress > 0.7 ? Math.max(0, 1 - (scrollProgress - 0.7) * 3.33) : 1;
  
  // Don't render anything if fully faded out
  if (globalFadeOut <= 0) return null;
  
  // Main water mass that bursts toward viewer - more dramatic
  const centralProgress = Math.min(1, scrollProgress * 3);
  const centralScale = scrollProgress < 0.15 
    ? 1 + scrollProgress * 12 
    : Math.max(0, 2.8 - (scrollProgress - 0.15) * 5);
  
  const centralOpacity = (scrollProgress < 0.25 
    ? Math.min(1, scrollProgress * 6) 
    : Math.max(0, 1 - (scrollProgress - 0.25) * 2.5)) * globalFadeOut;

  // Water sheet that spreads across screen
  const sheetProgress = Math.max(0, scrollProgress - 0.1);
  const sheetScale = sheetProgress * 18;
  const sheetOpacity = (sheetProgress < 0.25 
    ? sheetProgress * 2.5 
    : Math.max(0, 0.65 - (sheetProgress - 0.25) * 1.8)) * globalFadeOut;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: globalFadeOut }}>
      {/* Caustics light patterns - light refraction through water */}
      {CAUSTICS.map((caustic, i) => {
        const causticProgress = Math.max(0, scrollProgress - caustic.delay);
        if (causticProgress <= 0 || causticProgress > 0.6) return null;
        return (
          <div
            key={`caustic-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${caustic.x}%`,
              top: `${caustic.y}%`,
              width: caustic.size * (1 + causticProgress * 0.5),
              height: caustic.size * (1 + causticProgress * 0.5),
              background: `radial-gradient(ellipse at ${30 + causticProgress * 20}% ${30 + causticProgress * 20}%, 
                rgba(255, 255, 255, ${0.3 * caustic.intensity}) 0%,
                rgba(200, 235, 255, ${0.2 * caustic.intensity}) 30%,
                transparent 70%
              )`,
              filter: 'blur(4px)',
              opacity: Math.sin(causticProgress * Math.PI / 0.6) * 0.7,
              transform: `rotate(${causticProgress * 45}deg)`,
            }}
          />
        );
      })}
      
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
      
      {/* Screen water drip effect at edges - more realistic with bulging tips */}
      {scrollProgress > 0.4 && (
        <>
          {[...Array(12)].map((_, i) => {
            const startDelay = 0.4 + i * 0.025;
            const dripProgress = Math.max(0, scrollProgress - startDelay);
            const xPos = 5 + (i * 8);
            const dripWidth = 4 + (i % 4) * 2;
            const maxHeight = 250 + (i % 3) * 100;
            const wobble = Math.sin(dripProgress * Math.PI * 2) * 2;
            
            return (
              <div
                key={`drip-${i}`}
                className="absolute pointer-events-none"
                style={{
                  left: `calc(${xPos}% + ${wobble}px)`,
                  top: 0,
                }}
              >
                {/* Main drip body */}
                <div
                  style={{
                    width: dripWidth,
                    height: Math.min(dripProgress * 400, maxHeight),
                    background: `linear-gradient(180deg,
                      rgba(180, 225, 250, 0.35) 0%,
                      rgba(140, 205, 245, 0.45) 20%,
                      rgba(100, 180, 230, 0.5) 50%,
                      rgba(80, 165, 220, 0.4) 80%,
                      rgba(60, 150, 200, 0.25) 100%
                    )`,
                    borderRadius: '40% 40% 50% 50% / 0% 0% 50% 50%',
                    opacity: Math.max(0, 1 - dripProgress * 0.4),
                    boxShadow: `
                      inset -1px 0 2px rgba(255,255,255,0.3),
                      inset 1px 0 1px rgba(100, 180, 230, 0.2),
                      0 0 4px rgba(100, 180, 230, 0.2)
                    `,
                  }}
                >
                  {/* Highlight along drip */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '15%',
                      top: 0,
                      width: '25%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                      borderRadius: 'inherit',
                    }}
                  />
                </div>
                
                {/* Bulging droplet at tip */}
                {dripProgress > 0.1 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: Math.min(dripProgress * 400, maxHeight) - dripWidth * 1.2,
                      left: -dripWidth * 0.4,
                      width: dripWidth * 1.8,
                      height: dripWidth * 2.2,
                      background: `radial-gradient(ellipse at 35% 35%,
                        rgba(255, 255, 255, 0.6) 0%,
                        rgba(180, 225, 250, 0.5) 30%,
                        rgba(100, 180, 230, 0.4) 60%,
                        rgba(60, 150, 200, 0.2) 100%
                      )`,
                      borderRadius: '45% 45% 50% 50% / 40% 40% 60% 60%',
                      opacity: Math.max(0, 1 - dripProgress * 0.3),
                      boxShadow: '0 2px 4px rgba(100, 180, 230, 0.3)',
                    }}
                  />
                )}
              </div>
            );
          })}
        </>
      )}
      
      {/* Fine mist spray overlay - enhanced with multiple layers */}
      <div
        className="absolute inset-0"
        style={{
          background: scrollProgress > 0.15 ? `
            radial-gradient(circle at 25% 35%, rgba(220, 240, 255, ${(scrollProgress - 0.15) * 0.18}) 0%, transparent 25%),
            radial-gradient(circle at 75% 25%, rgba(200, 235, 255, ${(scrollProgress - 0.15) * 0.15}) 0%, transparent 20%),
            radial-gradient(circle at 50% 65%, rgba(180, 225, 250, ${(scrollProgress - 0.15) * 0.12}) 0%, transparent 30%),
            radial-gradient(circle at 15% 70%, rgba(160, 215, 245, ${(scrollProgress - 0.15) * 0.1}) 0%, transparent 22%),
            radial-gradient(circle at 85% 60%, rgba(170, 220, 248, ${(scrollProgress - 0.15) * 0.1}) 0%, transparent 18%)
          ` : 'none',
          opacity: Math.max(0, 1 - (scrollProgress - 0.55) * 2.2),
        }}
      />
      
      {/* Subtle screen wetness effect - appears after main splash */}
      {scrollProgress > 0.35 && (
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg, 
                rgba(200, 235, 255, ${Math.min(0.08, (scrollProgress - 0.35) * 0.2)}) 0%,
                transparent 30%,
                rgba(180, 225, 250, ${Math.min(0.05, (scrollProgress - 0.35) * 0.15)}) 70%,
                rgba(160, 215, 245, ${Math.min(0.1, (scrollProgress - 0.35) * 0.25)}) 100%
              )
            `,
            opacity: Math.max(0, 1 - (scrollProgress - 0.7) * 3),
          }}
        />
      )}
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
    
    try {
      // Send the form data to the chatbot API which will email it to admin@cpwsales.com
      const emailContent = `
New Contact Form Submission:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Company: ${formData.company || 'Not provided'}

Message:
${formData.message}

---
Please follow up with this lead within 24 hours.
      `.trim();

      // Send to the chat API to process and email
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ 
            role: 'user', 
            content: `SYSTEM: Email the following contact form submission to admin@cpwsales.com:\n\n${emailContent}` 
          }],
          formSubmission: {
            to: 'admin@cpwsales.com',
            subject: `New Contact Form Submission from ${formData.name}`,
            data: formData,
          }
        }),
      });
      
      console.log('Form submitted to admin@cpwsales.com:', formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
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
        onClick={() => {
          // After form submission, open AquaBuddy to assist
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('openAquaBuddy', { 
              detail: { message: 'I just submitted a contact form. Can you help me with any questions I might have?', autoSend: true } 
            }));
          }, 1500);
        }}
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
            <Image src="/logo.png" alt="Cunningham Pure Water, LLC" width={180} height={60} className="h-12 w-auto" priority />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="nav-link">About</a>
            <a href="#products" className="nav-link">Products</a>
            <a href="#why-us" className="nav-link">Why Us</a>
            <button 
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('openAquaBuddy', { 
                    detail: { message: 'I\'d like to get a quote for water solutions for my business.', autoSend: true } 
                  }));
                }, 500);
              }}
              className="btn-primary text-sm py-2 px-6"
            >Get Quote</button>
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
                Louisiana&apos;s Authorized Wellsys Dealer
              </span>
            </motion.div>
            
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-8 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <span className="gradient-text-burgundy italic font-script" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Cunningham</span>
              <br />
              <span className="gradient-text uppercase tracking-wide">PURE WATER</span>
              <span className="text-3xl md:text-4xl lg:text-5xl block mt-2 font-light tracking-widest">LLC</span>
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
              <button 
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('openAquaBuddy', { 
                      detail: { message: 'I\'m interested in getting started with pure water solutions for my business!', autoSend: true } 
                    }));
                  }, 500);
                }}
                className="btn-primary text-lg"
              >
                Get Started
              </button>
              <button 
                onClick={() => {
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('openAquaBuddy', { 
                      detail: { message: 'Tell me about the Wellsys water coolers, ice machines, and other products you offer.', autoSend: true } 
                    }));
                  }, 500);
                }}
                className="btn-secondary text-lg"
              >
                View Products
              </button>
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
        <VideoBackground src="https://player.vimeo.com/video/761207400?h=95298ad517" opacity={0.15} />
        
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <AnimatedSection className="text-center mb-24 flex flex-col items-center">
            <span className="block text-[#8B3D4D] font-medium tracking-[0.3em] uppercase text-base md:text-lg">About Us</span>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-white mt-6 mb-10">
              Water Done <span className="gradient-text-burgundy">Right</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed text-center max-w-4xl">
              Cunningham Pure Water LLC brings Wellsys&apos; industry-leading bottleless water coolers and ice machines to Louisiana businesses. Advanced multi-stage filtration. Sleek, modern design. Hassle-free rental programs.
            </p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-10 lg:gap-14">
            {[
              {
                icon: Droplets,
                title: 'Pure Filtration',
                description: '5 & 6 stage reverse osmosis removes 99%+ of contaminants for the cleanest water possible.',
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
          <AnimatedSection className="text-center mb-20 flex flex-col items-center">
            <span className="block text-[#8B3D4D] font-medium tracking-[0.3em] uppercase text-base md:text-lg">Our Products</span>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-white mt-6">
              <span className="gradient-text-burgundy">Wellsys</span> Water Solutions
            </h2>
            <p className="text-gray-300 mt-8 text-xl md:text-2xl text-center max-w-3xl">
              Industry-leading reverse osmosis water coolers and ice machines. Designed for reliability, built for performance.
            </p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            <AnimatedSection>
              <ProductCard
                icon={Droplets}
                title="Water Coolers"
                description="Free-standing and countertop models with advanced multi-stage reverse osmosis filtration."
                imageSrc="/water-cooler-4.png"
                features={[
                  'Hot, Cold & Ambient Options',
                  '5 & 6 Stage Reverse Osmosis',
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
                description="Commercial-grade ice production with built-in reverse osmosis water purification."
                imageSrc="/ice-machine-1.png"
                features={[
                  'Up to 389 lbs Ice/Day',
                  'Chewable Ice Cubes',
                  'Built-in Reverse Osmosis Filtration',
                  'Self-Sanitizing Options',
                  'Antimicrobial Protection',
                ]}
              />
            </AnimatedSection>
            
            <AnimatedSection>
              <ProductCard
                icon={Shield}
                title="Countertop Models"
                description="Compact countertop units perfect for break rooms and smaller spaces."
                imageSrc="/countertop-2.jpg"
                features={[
                  'Space-Saving Design',
                  'Ice, Hot & Cold Water',
                  'Advanced Filtration',
                  'Easy Installation',
                  'Low Maintenance',
                ]}
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <section className="min-h-screen py-24 md:py-32 relative flex items-center justify-center border-t border-[#4A9ED0]/20 bg-[#0A1628]">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <AnimatedSection className="text-center mb-20 flex flex-col items-center">
            <span className="block text-[#8B3D4D] font-medium tracking-[0.3em] uppercase text-base md:text-lg">See It In Action</span>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-white mt-6">
              Experience <span className="gradient-text-burgundy">Purity</span>
            </h2>
            <p className="text-gray-300 mt-8 text-xl md:text-2xl text-center max-w-3xl">
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
        <VideoBackground src="https://player.vimeo.com/video/1021104216?h=004efc2eb3" opacity={0.12} />
        
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
        <VideoBackground src="https://player.vimeo.com/video/1022298850?h=a658ee9673" opacity={0.1} />
        
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
                businesses trust Cunningham Pure Water LLC.
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
                    <a href="mailto:admin@cpwsales.com" className="text-white text-2xl font-medium hover:text-[#4A9ED0] transition-colors">
                      admin@cpwsales.com
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
              
              {/* Google Maps Embed */}
              <div className="mt-10 rounded-2xl overflow-hidden border border-[#4A9ED0]/20 h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3407.0676892692897!2d-92.44698868485058!3d31.311556981413186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86243a5c58fa2ae7%3A0x8d9ded7d2c5cfa57!2s1215%20Texas%20Ave%2C%20Alexandria%2C%20LA%2071301!5e0!3m2!1sen!2sus!4v1701800000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Cunningham Pure Water LLC Location"
                />
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
                Louisiana&apos;s Authorized Wellsys Dealer
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
