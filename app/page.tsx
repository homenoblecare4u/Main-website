import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrustSection from '@/components/TrustSection';
import ServicesSection from '@/components/ServicesSection';
import ProcessSection from '@/components/ProcessSection';
import AboutSection from '@/components/AboutSection';
import QuoteSection from '@/components/QuoteSection';
import FaqSection from '@/components/FaqSection';
import CallbackForm from '@/components/CallbackForm';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <TrustSection />
        <ServicesSection />
        <ProcessSection />
        <AboutSection />
        <QuoteSection />
        <FaqSection />
        <CallbackForm />
      </main>
      <Footer />
    </>
  );
}
