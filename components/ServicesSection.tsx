import Image from 'next/image';
import RevealWrapper from './RevealWrapper';

export default function ServicesSection() {
  return (
    <section className="services" id="services">
      <div className="wrap">
        <RevealWrapper className="section-head">
          <div>
            <p className="eyebrow">Our core services</p>
            <h2>The right support for every chapter</h2>
          </div>
          <p className="lead">Focused care plans designed to support independence, comfort and recovery at home.</p>
        </RevealWrapper>
        <div className="service-grid">
          <RevealWrapper className="service-card" tag="article">
            <Image
              src="/images/noblecare4u/elder-care-illustration.webp"
              alt="Indian elder-care professional sharing a flower-arranging activity with a senior woman at home"
              width={360}
              height={240}
            />
            <div className="service-body">
              <h3>Elder Care</h3>
              <p>
                Respectful day-to-day assistance, companionship and wellbeing support that helps seniors live safely and
                confidently.
              </p>
              <a className="text-link" href="#contact">
                Enquire about elder care <span>→</span>
              </a>
            </div>
          </RevealWrapper>

          <RevealWrapper className="service-card" tag="article">
            <Image
              src="/images/noblecare4u/nursing-illustration.webp"
              alt="Indian nurse checking an older man's blood pressure in his home"
              width={360}
              height={240}
            />
            <div className="service-body">
              <h3>Nursing</h3>
              <p>
                Skilled clinical support at home for recovery, medication routines, wound care and ongoing health
                needs.
              </p>
              <a className="text-link" href="#contact">
                Enquire about nursing <span>→</span>
              </a>
            </div>
          </RevealWrapper>

          <RevealWrapper className="service-card" tag="article">
            <Image
              src="/images/noblecare4u/physiotherapy-illustration.webp"
              alt="Illustration of an Indian physiotherapist supporting an older man during a mobility exercise at home"
              width={360}
              height={240}
            />
            <div className="service-body">
              <h3>Physiotherapy</h3>
              <p>
                Goal-led movement and rehabilitation sessions tailored to mobility, pain management and post-surgery
                recovery.
              </p>
              <a className="text-link" href="#contact">
                Enquire about physiotherapy <span>→</span>
              </a>
            </div>
          </RevealWrapper>
        </div>
      </div>
    </section>
  );
}
