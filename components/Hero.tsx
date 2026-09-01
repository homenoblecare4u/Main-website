import Image from 'next/image';

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Professional home healthcare</p>
          <h1>Care that feels close, even at home.</h1>
          <p className="lead">
            Compassionate elder care, skilled nursing and personalised physiotherapy—thoughtfully coordinated around
            your family&apos;s needs.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#contact">
              Find the right care <span aria-hidden="true">→</span>
            </a>
            <a className="btn btn-secondary" href="#services">
              Explore services
            </a>
          </div>
          <div className="hero-note">
            <div className="avatars" aria-hidden="true">
              <span>RN</span>
              <span>PT</span>
              <span>EC</span>
            </div>
            <span>Care coordinated by trained professionals</span>
          </div>
        </div>
        <div className="hero-visual">
          <Image
            className="hero-bg"
            src="/images/noblecare4u/noblecare4u-care-illustration.webp"
            alt="Illustration of an Indian care professional supporting a senior woman with a mobility exercise at home"
            width={500}
            height={590}
            priority
          />
          <div className="floating-card">
            <span className="heart" aria-hidden="true">
              ♡
            </span>
            <strong>Made for real life</strong>
            <p>Flexible support in the comfort and familiarity of home.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
