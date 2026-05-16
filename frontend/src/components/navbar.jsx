const navItems = [
  { label: "Beranda", href: "#hero" },
  { label: "Tentang", href: "#about" },
  { label: "Simulasi", href: "#simulation" },
  { label: "Peta Risiko", href: "#riskmap" },
  { label: "Kit 72 Jam", href: "#kit" },
  { label: "Kuis", href: "#quiz" },
];

const Navbar = () => {
  return (
    <header className="mx-auto flex h-20 w-full max-w-[1720px] items-center justify-between rounded-t-[2rem] border border-outline-variant/35 bg-surface/92 px-7 shadow-[0_18px_48px_rgba(46,50,48,0.16)] backdrop-blur sm:px-10">
      <div className="flex items-center gap-7">
        <a href="#home" className="flex items-center gap-3 text-on-background">
          <span className="font-headline text-3xl font-extrabold leading-none text-primary">
          EarthquakeEdu
          </span>
        </a>

        <div className="hidden items-center gap-3 rounded-full border border-[#d9bc8b] bg-[#fff8ea]/80 px-5 py-3 text-sm font-bold text-on-secondary-container lg:flex">
          <span className="material-symbols-outlined text-3xl text-tertiary">
            diversity_3
          </span>
          Powered by PMI DIY Yogyakarta
        </div>
      </div>

      <div className="flex items-center gap-5">
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="relative text-base font-medium text-on-surface hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button className="inline-flex h-14 items-center gap-3 rounded-2xl bg-primary px-7 text-base font-extrabold text-on-primary shadow-[0_12px_28px_rgba(46,82,54,0.22)] transition hover:bg-on-primary-fixed-variant">
          <span className="material-symbols-outlined">person</span>
          Sign In
        </button>
      </div>
    </header>
  );
};

export default Navbar;
