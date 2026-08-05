"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Episode = {
  number: string;
  guest: string;
  title: string;
  theme: string;
  image: string;
  url: string;
};

const episodes: Episode[] = [
  {
    number: "01",
    guest: "Phil Daru",
    title: "From Fighting to Coaching Seven World Champions",
    theme: "Purpose",
    image: "/media/episodes/episode-01.webp",
    url: "https://www.youtube.com/watch?v=VoAk3qxwHpQ",
  },
  {
    number: "02",
    guest: "Caitlin Sinclair",
    title: "The Toxic Overload Ruining America",
    theme: "Culture",
    image: "/media/episodes/episode-02.webp",
    url: "https://www.youtube.com/watch?v=DKvJ8cqLeSE",
  },
  {
    number: "03",
    guest: "The Lollis",
    title: "The Truth About Parenting in Modern Society",
    theme: "Family",
    image: "/media/episodes/episode-03.webp",
    url: "https://www.youtube.com/watch?v=Q28jL8bfVeU",
  },
  {
    number: "04",
    guest: "Olivia Audrey",
    title: "Your Body Is Listening to Everything You Think and Feel",
    theme: "Wellness",
    image: "/media/episodes/episode-04.webp",
    url: "https://www.youtube.com/watch?v=nCkQ1NJHCew",
  },
  {
    number: "05",
    guest: "Denis & Marianne Beausejour",
    title: "How Forgiveness Saved a Marriage and Built a Legacy",
    theme: "Marriage",
    image: "/media/episodes/episode-05.webp",
    url: "https://www.youtube.com/watch?v=8vqpUurOfKA",
  },
  {
    number: "06",
    guest: "John Kiriakou",
    title: "Truth, Betrayal and the Cost of Speaking Out",
    theme: "Truth",
    image: "/media/episodes/episode-06.webp",
    url: "https://www.youtube.com/watch?v=yJVUqlEZ2zQ",
  },
  {
    number: "07",
    guest: "Dr. Gina Loudon",
    title: "The Spiritual Battle for Our Children, Families and Future",
    theme: "Faith",
    image: "/media/episodes/episode-07.webp",
    url: "https://www.youtube.com/watch?v=nLbDrhzeyac",
  },
];

const themes = ["All", "Purpose", "Culture", "Family", "Wellness", "Marriage", "Truth", "Faith"];

export default function Home() {
  const parallaxRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [activeTheme, setActiveTheme] = useState("All");
  const [query, setQuery] = useState("");
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [guestSent, setGuestSent] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setReady(true), reduceMotion ? 50 : 3500);

    let ticking = false;
    const updateScroll = () => {
      const y = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty("--scroll-y", `${y}px`);
      document.documentElement.style.setProperty("--scroll-progress", `${total > 0 ? y / total : 0}`);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    window.addEventListener("scroll", onScroll, { passive: true });
    updateScroll();

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let cleanup = () => {};

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      const gsap = gsapModule.default;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion || !parallaxRef.current) return;

      const mobile = window.matchMedia("(max-width: 650px)").matches;

      const context = gsap.context(() => {
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: parallaxRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.15,
            invalidateOnRefresh: true,
          },
        });

        if (mobile) {
          timeline
            .to(".parallax__backdrop", { yPercent: 8, scale: 1.07, filter: "sepia(.2) saturate(.62) brightness(.42)" }, 0)
            .to(".parallax__dust", { yPercent: -180, opacity: 0 }, 0)
            .fromTo(".parallax__portal-copy", { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: .3 }, .38)
            .to(".parallax__portal-copy", { y: -50, opacity: 0, duration: .22 }, .78);
        } else {
          timeline
            .to(".parallax__backdrop", { yPercent: 13, scale: 1.18 }, 0)
            .to(".parallax__rings", { yPercent: -32, rotate: 18, scale: 1.12 }, 0)
            .to(".parallax__title", { yPercent: -115, scale: .88, opacity: 0 }, 0)
            .to(".parallax__portrait", { yPercent: -72, scale: 1.14 }, 0)
            .to(".parallax__seal", { yPercent: -190, rotate: -8, opacity: 0 }, 0)
            .to(".parallax__journal", { yPercent: -250, rotate: -15 }, 0)
            .to(".parallax__compass", { yPercent: -330, rotate: 115 }, 0)
            .to(".parallax__mic", { yPercent: -420, rotate: -8 }, 0)
            .to(".parallax__foreground", { yPercent: -58, scale: 1.22 }, 0)
            .to(".parallax__dust", { yPercent: -580, opacity: 0 }, 0)
            .fromTo(".parallax__portal-copy", { y: 160, opacity: 0 }, { y: 0, opacity: 1, duration: .28 }, .58)
            .to(".parallax__portal-copy", { y: -100, opacity: 0, duration: .18 }, .86);
        }
      }, parallaxRef);

      cleanup = () => context.revert();
      ScrollTrigger.refresh();
    });

    return () => cleanup();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const filteredEpisodes = useMemo(() => {
    const search = query.trim().toLowerCase();
    return episodes.filter((episode) => {
      const matchesTheme = activeTheme === "All" || episode.theme === activeTheme;
      const matchesSearch = !search || `${episode.guest} ${episode.title} ${episode.theme}`.toLowerCase().includes(search);
      return matchesTheme && matchesSearch;
    });
  }, [activeTheme, query]);

  const handleNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterSent(true);
  };

  const handleGuest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGuestSent(true);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <div className={`preloader ${ready ? "preloader--done" : ""}`} aria-hidden="true">
        <div className="preloader__beam" />
        <img src="/media/podcast-mark.webp" alt="" className="preloader__mark" />
        <p>Preserving what must not be lost</p>
      </div>

      <div className="film-grain" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true" />

      <header className="site-header">
        <a className="brand-lockup" href="#home" aria-label="To My Sons and Daughters home">
          <span className="brand-lockup__seal">TMSD</span>
          <span>To My Sons &amp; Daughters</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#archive">The Archive</a>
          <a href="#purpose">The Purpose</a>
          <a href="#host">The Host</a>
          <a href="#join">Join Us</a>
        </nav>
        <button className="menu-trigger" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen}>
          {menuOpen ? "Close" : "Menu"}
        </button>
      </header>

      <div className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`} aria-hidden={!menuOpen}>
        <nav aria-label="Mobile navigation">
          <a href="#archive" onClick={closeMenu}>The Archive <span>01</span></a>
          <a href="#purpose" onClick={closeMenu}>The Purpose <span>02</span></a>
          <a href="#host" onClick={closeMenu}>The Host <span>03</span></a>
          <a href="#join" onClick={closeMenu}>Join Us <span>04</span></a>
        </nav>
        <p>A living library for future generations.</p>
      </div>

      <section className="parallax" id="home" ref={parallaxRef}>
        <div className="hero parallax__stage">
        <div className="parallax__backdrop" aria-hidden="true" />
        <div className="hero__rings parallax__rings" aria-hidden="true" />
        <div className="hero__dust hero__dust--one parallax__dust" aria-hidden="true" />
        <div className="hero__dust hero__dust--two parallax__dust" aria-hidden="true" />

        <div className="hero__copy parallax__title">
          <p className="eyebrow">A podcast by Ben Swann · New conversations weekly</p>
          <h1 className="hero__title">To My Sons<br />&amp; Daughters</h1>
          <p className="hero__statement">
            A living library of lessons, conversations and truth created for the moments future generations will need them most.
          </p>
          <div className="hero__actions">
            <a className="button button--bronze" href="#archive">Enter the archive <span>↓</span></a>
            <a className="text-link" href="https://www.youtube.com/@ToMySonsandDaughtersPodcast" target="_blank" rel="noreferrer">Watch on YouTube ↗</a>
          </div>
        </div>

        <div className="hero__portrait-wrap parallax__portrait" aria-label="Ben Swann in the To My Sons and Daughters podcast artwork">
          <div className="hero__portrait-light" aria-hidden="true" />
          <img src="/media/podcast-cover.webp" alt="Ben Swann, host of To My Sons and Daughters" className="hero__portrait" />
          <div className="hero__portrait-caption">
            <span>Host</span>
            <strong>Ben Swann</strong>
          </div>
        </div>

        <img className="parallax__seal" src="/media/podcast-mark.webp" alt="" aria-hidden="true" />
        <div className="parallax__journal" aria-hidden="true"><span>For what<br/>comes next</span></div>
        <div className="parallax__compass" aria-hidden="true"><span>N</span></div>
        <div className="parallax__mic" aria-hidden="true"><i /></div>
        <div className="hero__masked-type parallax__foreground" aria-hidden="true">LEGACY</div>
        <div className="parallax__portal-copy" aria-hidden="true"><span>The noise fades.</span><strong>The archive remains.</strong></div>
        <div className="hero__scroll-cue" aria-hidden="true"><span /> Scroll to open</div>
        </div>
      </section>

      <section className="mobile-hero-summary" aria-label="Podcast introduction">
        <p className="eyebrow">A podcast by Ben Swann · New conversations weekly</p>
        <h1>To My Sons<br />&amp; Daughters</h1>
        <p>A living library of lessons, conversations and truth created for the moments future generations will need them most.</p>
        <div className="mobile-hero-summary__actions">
          <a className="button button--bronze" href="#archive">Enter the archive <span>↓</span></a>
          <a className="text-link" href="https://www.youtube.com/@ToMySonsandDaughtersPodcast" target="_blank" rel="noreferrer">Watch on YouTube ↗</a>
        </div>
      </section>

      <section className="archive-intro" id="purpose">
        <div className="archive-intro__object archive-intro__object--journal" aria-hidden="true">
          <span>Vol. I</span><i /><i /><i />
        </div>
        <div className="archive-intro__object archive-intro__object--compass" aria-hidden="true"><span>N</span></div>
        <div className="archive-intro__object archive-intro__object--mic" aria-hidden="true"><i /></div>
        <p className="section-index">01 — The Purpose</p>
        <div className="archive-intro__content" data-reveal>
          <h2>Not another news cycle.<br /><em>An inheritance.</em></h2>
          <p>
            The headlines disappear. Principles remain. This archive leaves the noise behind to preserve the failures, redemptions and hard-earned wisdom that can guide a family through generations.
          </p>
        </div>
        <div className="archive-principles" data-reveal>
          <article><span>01</span><h3>Truth without varnish</h3><p>Conversations that refuse easy answers and fashionable narratives.</p></article>
          <article><span>02</span><h3>Wisdom earned</h3><p>Lessons shaped by failure, responsibility, forgiveness and renewal.</p></article>
          <article><span>03</span><h3>Legacy shared</h3><p>Stories built for children, parents and anyone searching for direction.</p></article>
        </div>
      </section>

      <section className="featured" aria-labelledby="featured-title">
        <div className="featured__visual" data-reveal>
          <a href={episodes[6].url} target="_blank" rel="noreferrer" aria-label={`Watch ${episodes[6].title} on YouTube`}>
            <img src={episodes[6].image} alt={`Ben Swann with ${episodes[6].guest}`} />
            <span className="play-button">Play</span>
          </a>
        </div>
        <div className="featured__copy" data-reveal>
          <p className="section-index">Latest entry — Episode 07</p>
          <h2 id="featured-title">The spiritual battle for our children, families and future.</h2>
          <p>Dr. Gina Loudon joins Ben Swann for a conversation on faith, adoption, homeschooling and protecting what is sacred.</p>
          <div className="featured__meta"><span>Dr. Gina Loudon</span><span>Faith · Family · Future</span></div>
          <a className="button button--outline" href={episodes[6].url} target="_blank" rel="noreferrer">Watch the conversation ↗</a>
        </div>
      </section>

      <section className="episode-library" id="archive">
        <div className="library-heading" data-reveal>
          <div><p className="section-index">02 — The Living Library</p><h2>Open a conversation.</h2></div>
          <p>Seven entries. Seven lives. One growing archive of ideas worth carrying forward.</p>
        </div>

        <div className="library-tools">
          <div className="theme-filters" aria-label="Filter episodes by theme">
            {themes.map((theme) => (
              <button key={theme} className={activeTheme === theme ? "is-active" : ""} onClick={() => setActiveTheme(theme)}>{theme}</button>
            ))}
          </div>
          <label className="episode-search">
            <span className="sr-only">Search the archive</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the archive" />
            <span>⌕</span>
          </label>
        </div>

        <div className="episode-grid">
          {filteredEpisodes.map((episode) => (
            <article className="episode-card" key={episode.number} data-reveal>
              <a href={episode.url} target="_blank" rel="noreferrer">
                <div className="episode-card__image">
                  <img src={episode.image} alt={`${episode.guest} on To My Sons and Daughters`} />
                  <span className="episode-card__number">Entry {episode.number}</span>
                  <span className="episode-card__play">Watch ↗</span>
                </div>
                <div className="episode-card__text">
                  <span>{episode.theme}</span>
                  <h3>{episode.title}</h3>
                  <p>With {episode.guest}</p>
                </div>
              </a>
            </article>
          ))}
        </div>
        {filteredEpisodes.length === 0 && <p className="empty-library">No entry matches that search. Try another name or theme.</p>}
      </section>

      <section className="host" id="host">
        <div className="host__portrait" data-reveal>
          <img src="/media/podcast-cover.webp" alt="Ben Swann seated in a warm library setting" />
          <div className="host__stamp"><span>20+</span> years pursuing truth</div>
        </div>
        <div className="host__copy" data-reveal>
          <p className="section-index">03 — The Imperfect Messenger</p>
          <h2>Ben Swann spent decades reporting on the world. Then the most important story became legacy.</h2>
          <p>For more than twenty years, Ben built a career asking difficult questions and covering stories others would not touch. But as a father of five and grandfather of two, reporting was no longer enough.</p>
          <p>To My Sons and Daughters is his time capsule: an archive of principles that do not expire, built for his children and shared with every parent, son and daughter searching for deeper truth.</p>
          <a className="text-link" href="https://www.youtube.com/@ToMySonsandDaughtersPodcast" target="_blank" rel="noreferrer">Meet Ben through the conversations ↗</a>
        </div>
        <blockquote data-reveal>“The truth is not merely something we report. It is something we leave behind.”</blockquote>
      </section>

      <section className="voices" aria-labelledby="voices-title">
        <p className="section-index">04 — Voices in the Archive</p>
        <h2 id="voices-title" data-reveal>People who have lived the lesson.</h2>
        <div className="voices__marquee" aria-hidden="true">
          <div>PHIL DARU · CAITLIN SINCLAIR · THE LOLLIS · OLIVIA AUDREY · DENIS &amp; MARIANNE BEAUSEJOUR · JOHN KIRIAKOU · DR. GINA LOUDON ·&nbsp;</div>
          <div>PHIL DARU · CAITLIN SINCLAIR · THE LOLLIS · OLIVIA AUDREY · DENIS &amp; MARIANNE BEAUSEJOUR · JOHN KIRIAKOU · DR. GINA LOUDON ·&nbsp;</div>
        </div>
      </section>

      <section className="join" id="join">
        <div className="join__header" data-reveal>
          <p className="section-index">05 — Continue the Library</p>
          <h2>Some conversations are meant to outlive us.</h2>
        </div>
        <div className="join__grid">
          <article className="join-card" data-reveal>
            <span className="join-card__number">01</span>
            <h3>Receive the next entry.</h3>
            <p>New conversations, selected lessons and notes from the archive—delivered without the noise.</p>
            {newsletterSent ? (
              <p className="form-success">Your place in the archive is noted. Email delivery will be connected for launch.</p>
            ) : (
              <form onSubmit={handleNewsletter}>
                <label><span className="sr-only">Email address</span><input type="email" required placeholder="Your email address" /></label>
                <button type="submit">Join the library →</button>
              </form>
            )}
          </article>
          <article className="join-card join-card--light" data-reveal>
            <span className="join-card__number">02</span>
            <h3>Bring a story worth preserving.</h3>
            <p>Have you lived through failure, redemption or a lesson future generations need to hear?</p>
            {guestSent ? (
              <p className="form-success">Your interest is noted. The full guest application will be connected for launch.</p>
            ) : (
              <form onSubmit={handleGuest}>
                <label><span className="sr-only">Your name</span><input type="text" required placeholder="Your name" /></label>
                <button type="submit">Become a guest →</button>
              </form>
            )}
          </article>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-footer__rings" aria-hidden="true" />
        <img src="/media/podcast-mark.webp" alt="To My Sons and Daughters Podcast" />
        <div className="site-footer__statement">A living library for the people we love—and the future we may never see.</div>
        <div className="site-footer__links">
          <a href="https://www.youtube.com/@ToMySonsandDaughtersPodcast" target="_blank" rel="noreferrer">YouTube ↗</a>
          <a href="https://www.youtube.com/@ToMySonsandDaughtersPodcast" target="_blank" rel="noreferrer">Spotify — Coming soon</a>
          <a href="https://www.youtube.com/@ToMySonsandDaughtersPodcast" target="_blank" rel="noreferrer">Apple Podcasts — Coming soon</a>
          <a href="mailto:info@company.com">Contact</a>
        </div>
        <div className="site-footer__bottom"><span>© 2026 To My Sons &amp; Daughters</span><span>Built to endure.</span></div>
      </footer>
    </main>
  );
}
