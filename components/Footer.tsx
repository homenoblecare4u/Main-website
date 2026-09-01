import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <a className="brand" href="#top" aria-label="Noblecare4u home">
              <Image
                className="brand-logo"
                src="/images/noblecare4u/noblecare4u-logo.webp"
                alt="Noblecare4u"
                width={230}
                height={39}
              />
            </a>
            <p>Home healthcare focused on elder care, nursing and physiotherapy.</p>
          </div>
          <div className="footer-links">
            <div>
              <strong>Navigate</strong>
              <a href="#services">Services</a>
              <a href="#how">How it works</a>
              <a href="#faq">FAQs</a>
            </div>
            <div>
              <strong>Care</strong>
              <a href="#contact">Elder care</a>
              <a href="#contact">Nursing</a>
              <a href="#contact">Physiotherapy</a>
            </div>
          </div>
        </div>
        <div className="copyright">
          © 2026 Noblecare4u. UI prototype only. Final legal details, policies and contact information pending client
          approval.
        </div>
      </div>
    </footer>
  );
}
