import Image from 'next/image';
import MobileNav from './MobileNav';

export default function Header() {
  return (
    <header>
      <div className="carebar">
        <div className="wrap">
          <span>Care that respects every routine, relationship and recovery.</span>
          <a href="#contact">Plan care at home →</a>
        </div>
      </div>
      <nav className="wrap" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Noblecare4u home">
          <Image
            className="brand-logo"
            src="/images/noblecare4u/noblecare4u-logo.webp"
            alt="Noblecare4u"
            width={250}
            height={42}
            priority
          />
        </a>
        <MobileNav />
      </nav>
    </header>
  );
}
