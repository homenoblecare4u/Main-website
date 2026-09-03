import RevealWrapper from './RevealWrapper';

export default function FaqSection() {
  return (
    <section id="faq">
      <div className="wrap faq-grid">
        <RevealWrapper className="faq-intro">
          <p className="eyebrow">Good to know</p>
          <h2>Your questions, answered</h2>
          <p className="lead">
            A few helpful answers before you arrange care. Exact availability and pricing will be confirmed during your
            consultation.
          </p>
        </RevealWrapper>
        <RevealWrapper className="faq-list">
          <details>
            <summary>Which services does Noblecare4u provide?</summary>
            <p>
              The current core services are elder care, nursing at home and physiotherapy at home. The exact plan depends
              on the person&apos;s needs and a care assessment.
            </p>
          </details>
          <details>
            <summary>How do I know which service is right?</summary>
            <p>
              Share the patient&apos;s current condition, daily needs and care goals. A coordinator can help identify
              the most suitable starting point.
            </p>
          </details>
          <details>
            <summary>Can the care plan change over time?</summary>
            <p>
              Yes. Home care needs can evolve, so plans can be reviewed and adjusted based on progress and family
              feedback.
            </p>
          </details>
          <details>
            <summary>How soon can care begin?</summary>
            <p>
              Timelines depend on your location, professional availability and the type of care required. This should be
              confirmed during the callback.
            </p>
          </details>
          <details>
            <summary>How is pricing decided?</summary>
            <p>
              Pricing depends on the service, session or shift length, frequency and clinical requirements. Your care
              coordinator will explain the applicable options before care begins.
            </p>
          </details>
        </RevealWrapper>
      </div>
    </section>
  );
}
