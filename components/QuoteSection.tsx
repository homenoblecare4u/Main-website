import Image from 'next/image';
import RevealWrapper from './RevealWrapper';

export default function QuoteSection() {
  return (
    <section className="quote-section">
      <div className="wrap">
        <RevealWrapper className="quote-card">
          <blockquote className="quote-body">
            <div className="quote-mark" aria-hidden="true">
              “
            </div>
            <p>
              Home is where people feel most like themselves. Our role is to bring dependable care into that space—with
              skill, patience and dignity.
            </p>
            <footer>— The care philosophy behind Noblecare4u</footer>
          </blockquote>
          <Image
            src="/images/noblecare4u/home-philosophy-illustration.webp"
            alt="Illustration of an older Indian couple enjoying tea together at home"
            width={400}
            height={350}
          />
        </RevealWrapper>
      </div>
    </section>
  );
}
