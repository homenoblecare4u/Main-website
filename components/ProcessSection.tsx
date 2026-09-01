import RevealWrapper from './RevealWrapper';

export default function ProcessSection() {
  return (
    <section className="process" id="how">
      <div className="wrap">
        <RevealWrapper className="section-head">
          <div>
            <p className="eyebrow">Simple by design</p>
            <h2>From first call to care at home</h2>
          </div>
          <p className="lead">A warm, guided experience that makes arranging support feel less overwhelming.</p>
        </RevealWrapper>
        <div className="process-grid">
          <RevealWrapper className="step" tag="article">
            <div className="step-no">01</div>
            <h3>Tell us what you need</h3>
            <p>Share a few details about the person, their routine and the kind of support you are looking for.</p>
          </RevealWrapper>
          <RevealWrapper className="step" tag="article">
            <div className="step-no">02</div>
            <h3>Receive a care recommendation</h3>
            <p>Our care team understands the requirement and recommends a suitable plan and professional.</p>
          </RevealWrapper>
          <RevealWrapper className="step" tag="article">
            <div className="step-no">03</div>
            <h3>Begin care with confidence</h3>
            <p>Care starts at home, with clear communication and regular check-ins as needs evolve.</p>
          </RevealWrapper>
        </div>
      </div>
    </section>
  );
}
