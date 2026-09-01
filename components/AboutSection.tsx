import Image from 'next/image';
import RevealWrapper from './RevealWrapper';

export default function AboutSection() {
  return (
    <section id="about">
      <div className="wrap about-grid">
        <RevealWrapper className="about-img-wrap">
          <Image
            src="/images/noblecare4u/care-planning-illustration.webp"
            alt="Illustration of a care coordinator discussing a home-care plan with an Indian senior woman and her daughter"
            width={520}
            height={550}
          />
          <div className="seal">
            Human care,
            <br />
            thoughtfully
            <br />
            delivered
          </div>
        </RevealWrapper>
        <RevealWrapper className="about-copy">
          <p className="eyebrow">The Noblecare4u approach</p>
          <h2>Clinical confidence, with a human touch</h2>
          <p className="lead">
            Great home care is more than a visit. It is listening closely, respecting routines and helping families
            feel informed at every step.
          </p>
          <ul className="check-list">
            <li>Care plans shaped around the person&apos;s needs and daily life</li>
            <li>Professionals selected for the required type of support</li>
            <li>Regular communication to help families stay reassured</li>
            <li>Flexible care that can adapt as recovery or needs change</li>
          </ul>
          <a className="btn btn-primary" href="#contact">
            Speak to a care coordinator
          </a>
        </RevealWrapper>
      </div>
    </section>
  );
}
