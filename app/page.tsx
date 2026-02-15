import AnimatedBackground from '@/components/animations/AnimatedBackground';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';

export default function HomePage() {
  return (
    <>
      <AnimatedBackground />
      <Hero />
      <Features />
      <HowItWorks />
    </>
  );
}
