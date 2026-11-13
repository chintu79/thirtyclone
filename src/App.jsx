import "./index.css";
import Canvas from "./canvas";
import data from "./data";
import Lenis from "lenis";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP, ScrollTrigger);

const SERVICES = [
  { num: "01", title: "CREATIVE", items: ["Art direction", "Creative direction"] },
  { num: "02", title: "DESIGN", items: ["Digital Design", "UX/UI Design", "Web Design", "Graphic Design", "3D Design", "Interactive Design", "Illustration Design", "Brand Design"] },
  { num: "03", title: "ANIMATION", items: ["2D Animation", "3D Animation", "Motion Graphics", "Experimental Animation", "Typography Animation"] },
  { num: "04", title: "TECHNOLOGY", items: ["Development", "Implementation", "Creative Coding", "Prototyping", "Quality Assurance", "Testing"] },
  { num: "05", title: "PROJECT DELIVERY", items: ["Production Strategy", "Project Direction", "Operations Excellence", "Team Coordination"] },
  { num: "06", title: "EXAMPLE PRODUCTS", items: ["Social Ads", "Websites", "AR Filters and Experiences", "Display Ads (Html5, Static, Rich media)", "Digital Out of Home", "Static and Animated Assets", "Digital Installations", "Design Toolkits"] },
];

const ROLES = ["Project Managers", "Digital Producers", "Designers", "Illustrators", "Animators", "3D Artists", "Motion Designers", "Developers and Coders", "Creative Technologists", "Sound Engineers"];

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).toLowerCase());
}

/* split text into animated char spans (Splitting.js-style, no dep) */
function CharReveal({ as: Tag = "h1", className, children, delay = 0 }) {
  const ref = useRef(null);
  useGSAP(() => {
    const chars = ref.current?.querySelectorAll(".char");
    if (!chars) return;
    gsap.fromTo(chars,
      { yPercent: 115, rotationZ: 25, opacity: 0 },
      { yPercent: 0, rotationZ: 0, opacity: 1, duration: 1.05, delay, ease: "power3.out", stagger: 0.024 }
    );
  }, { scope: ref });
  return (
    <Tag className={className} ref={ref} aria-label={children}>
      {String(children).split("").map((ch, i) => (
        <span key={i} className="char inline-block will-change-transform" aria-hidden="true">{ch === " " ? " " : ch}</span>
      ))}
    </Tag>
  );
}

CharReveal.propTypes = {
  as: PropTypes.elementType,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  delay: PropTypes.number,
};

/* rotating circular text */
function CircularText() {
  return (
    <svg viewBox="0 0 200 200" className="circular-spin w-32 h-32 md:w-40 md:h-40 text-[#FD2C2A]" aria-hidden="true">
      <defs>
        <path id="circlePath" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
      </defs>
      <text fill="currentColor" fontSize="11.5" letterSpacing="3.6" fontWeight="700">
        <textPath href="#circlePath">THIRTYSIXSTUDIO — FOR ALL THINGS DIGITAL PRODUCTION — </textPath>
      </text>
      <circle cx="100" cy="100" r="44" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" opacity="0.7" />
      <text x="100" y="107" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="800">36</text>
    </svg>
  );
}

function Accordion() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mt-2 max-w-4xl">
      {SERVICES.map((s, i) => (
        <div key={s.title} className="service" data-open={open === i}>
          <button className="service-btn" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            <span className="flex items-baseline"><span className="service-index">{s.num}</span><span className="service-title">{s.title}</span></span>
            <span className="service-chevron">+</span>
          </button>
          <div className="service-body">
            <ul className="service-list">{s.items.map((it) => <li key={it}>{it}</li>)}</ul>
          </div>
        </div>
      ))}
    </div>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const formRef = useRef(null);
  const valid = name.trim() && validateEmail(email) && topic && message.trim();

  const submit = (e) => {
    e.preventDefault();
    if (!valid || status === "sending") return;
    setStatus("sending");
    // NOTE: endpoint is the same XHR target the original site uses; this repo ships no backend.
    fetch("sendform.php", { method: "POST", body: new FormData(e.target) })
      .then((r) => r.text())
      .then((t) => setStatus(t && t.trim() === "success" ? "sent" : "error"))
      .catch(() => setStatus("error"));
  };

  if (status === "sent") {
    return (
      <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-xl p-10 text-center">
        <p className="text-xs tracking-[0.35em] text-emerald-400 mb-3">MESSAGE SENT!</p>
        <p className="text-xl text-white">Thank you for your message. We will get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} ref={formRef} className="grid md:grid-cols-2 gap-5" noValidate>
      <div>
        <label className="contact-label" htmlFor="name">Name</label>
        <input id="name" name="name" className="contact-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
      </div>
      <div>
        <label className="contact-label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="contact-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        <p className={`form-error ${email && !validateEmail(email) ? "show" : ""}`}>*Incorrect email</p>
      </div>
      <div className="md:col-span-2">
        <label className="contact-label" htmlFor="topic">Topic</label>
        <select id="topic" name="topic" className="contact-field" value={topic} onChange={(e) => setTopic(e.target.value)} required>
          <option value="">Topic*</option>
          <option value="Talk about a project">Talk about a project</option>
          <option value="Become part of the team">Become part of the team</option>
          <option value="Something else">Something else</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="contact-label" htmlFor="message">Message</label>
        <textarea id="message" name="message" className="contact-field min-h-[110px]" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us about the project…" required />
      </div>
      <div className="md:col-span-2 flex items-center gap-6 flex-wrap">
        <button type="submit" className={`btn-send ${valid ? "" : "disabled"}`} disabled={!valid || status === "sending"}>
          {status === "sending" ? "SENDING…" : "SEND"}
        </button>
        {status === "error" && <p className="form-error show">Send failed — this static clone has no mail backend. Email <a className="underline" href="mailto:shrikrishnachinta79@gmail.com">shrikrishnachinta79@gmail.com</a></p>}
      </div>
    </form>
  );
}

export default function App() {
  const [showCanvas, setShowCanvas] = useState(false);
  const cursorRef = useRef(null);
  const mainRef = useRef(null);
  const scrollTitleRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSectionRef = useRef(null);

  // Lenis smooth scroll (what the real site runs)
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    let raf;
    const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  // Custom cursor — grows over interactive elements
  useGSAP(() => {
    if (!mainRef.current || !cursorRef.current) return;
    const move = (e) => gsap.to(cursorRef.current, { x: e.clientX - 12, y: e.clientY - 12, duration: 0.18, ease: "power2.out" });
    const over = () => gsap.to(cursorRef.current, { scale: 1.6, duration: 0.3 });
    const out = () => gsap.to(cursorRef.current, { scale: 1, duration: 0.3 });
    mainRef.current.addEventListener("mousemove", move);
    mainRef.current.querySelectorAll("a, button, .service-btn").forEach((el) => {
      el.addEventListener("mouseenter", over);
      el.addEventListener("mouseleave", out);
    });
    return () => mainRef.current?.removeEventListener("mousemove", move);
  }, { scope: mainRef, dependencies: [showCanvas] });

  // Marquee
  useGSAP(() => {
    if (!scrollTitleRef.current) return;
    const el = scrollTitleRef.current;
    const totalWidth = el.scrollWidth / 2;
    gsap.to(el, { x: -totalWidth, duration: 16, ease: "none", repeat: -1 });
  }, { scope: scrollTitleRef, dependencies: [] });

  // Scroll scrub parallax: hero title drifts, orbs drift at own rates
  useGSAP(() => {
    gsap.utils.toArray(".parallax-slow").forEach((el) => {
      gsap.fromTo(el, { yPercent: 12 }, { yPercent: -18, ease: "none",
        scrollTrigger: { trigger: el.closest("section") ?? el, start: "top top", end: "bottom top", scrub: 1.1 } });
    });
    gsap.utils.toArray(".parallax-fast").forEach((el) => {
      gsap.fromTo(el, { yPercent: 30 }, { yPercent: -30, ease: "none",
        scrollTrigger: { trigger: el.closest("section") ?? el, start: "top bottom", end: "bottom top", scrub: 0.8 } });
    });
    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.fromTo(el, { y: 56, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none reverse" } });
    });
  }, { scope: mainRef, dependencies: [] });

  const pepperBurst = () => {
    setShowCanvas((prev) => !prev);
    gsap.fromTo("body", { backgroundColor: "#FD2C2A" }, { backgroundColor: "#0a0a0a", duration: 1.4, ease: "power2.out" });
  };

  return (
    <>
      <div ref={cursorRef} className="cursor" aria-hidden="true"></div>
      <div ref={mainRef} className="selection:bg-[#FD2C2A] selection:text-black bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden">

        {/* NAV */}
        <header className="fixed top-0 left-0 w-full z-50 px-[4%] py-5 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
          <a href="#top" className="text-lg font-extrabold tracking-tight">thirtysix<span className="text-[#FD2C2A]">studio</span></a>
          <nav className="flex items-center gap-5 md:gap-8">
            <a className="nav-link" href="#work">Work</a>
            <a className="nav-link" href="#who">Who</a>
            <a className="nav-link" href="#giveback">Give back</a>
            <a className="nav-link" href="#talk">Talk to us</a>
          </nav>
        </header>

        {/* HERO */}
        <section id="top" ref={heroSectionRef} className="min-h-[94vh] flex flex-col justify-end relative px-[4%] pb-8 pt-24 overflow-hidden">
          {/* parallax orbs — our own pure-CSS art, no borrowed assets */}
          <div className="orb orb-red parallax-fast" style={{ top: "12%", right: "8%" }} />
          <div className="orb orb-ring parallax-slow" style={{ top: "38%", left: "68%" }} />
          <div className="orb orb-red orb-sm parallax-slow" style={{ top: "66%", left: "3%", opacity: 0.55 }} />
          {showCanvas && data[0].map((d) => <Canvas key={d.startIndex} details={d} />)}

          <p className="kicker mb-6 parallax-slow">Digital production studio — Amsterdam</p>
          <CharReveal as="h2" className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug max-w-3xl">At Thirtysixstudio, we build digital assets and immersive experiences for purposeful brands.</CharReveal>
          <p className="mt-5 text-white/60 max-w-md">Design, animation and technology for advertising — done properly. ↓ Scroll</p>

          <div className="relative mt-8 md:mt-10">
            <button ref={heroTitleRef} onClick={pepperBurst} aria-label="THIRTYSIXSTUDIO — click for the pepper easter egg" className="block w-full text-left parallax-slow">
              <CharReveal as="h1" className="whitespace-nowrap text-[8.6vw] leading-none font-black tracking-tighter hover:text-white/90 transition-colors">THIRTYSIXSTUDIO</CharReveal>
            </button>
            <div className="absolute -right-2 bottom-2 md:right-6 md:bottom-4 opacity-90"><CircularText /></div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="w-full overflow-hidden border-y border-white/10 py-2 bg-black">
          <div ref={scrollTitleRef} className="flex whitespace-nowrap w-max">
            {[0, 1].map((n) => <span key={n} className="text-base md:text-xl font-semibold tracking-[0.2em] text-white/80">FOR ALL THINGS DIGITAL PRODUCTION —&nbsp;&nbsp;FOR ALL THINGS DIGITAL PRODUCTION —&nbsp;&nbsp;</span>)}
          </div>
        </div>

        {/* 01 WHAT WE DO */}
        <section id="work" className="relative px-[4%] py-20 overflow-hidden">
          <div className="orb orb-ring parallax-fast" style={{ top: "6%", left: "84%" }} />
          <p className="kicker mb-5 reveal">01 — What we do</p>
          <h2 className="h-display max-w-4xl reveal">We elevate creative production in the advertising industry.</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-6 max-w-4xl text-white/70 leading-relaxed reveal">
            <p>Cutting-edge craft, modern technology and top-tier processes — sophisticated work that resonates. Full campaign or one phase, we&apos;ve got you covered.</p>
            <p>Agile by default: innovation with simplicity, so the journey is seamless, transparent and rewarding.</p>
          </div>
          <h3 className="mt-14 mb-3 text-xs tracking-[0.35em] text-white/45 reveal">OUR SERVICES</h3>
          <Accordion />
          <p className="mt-8 text-white/65 reveal">Got a project in mind? <a className="text-[#FD2C2A] underline underline-offset-4" href="#talk">Talk to us</a> — or let&apos;s define the undefined together.</p>
        </section>

        {/* 02 WHO WE ARE */}
        <section id="who" className="px-[4%] py-20 bg-[#0d0d0d]">
          <p className="kicker mb-5 reveal">02 — Who we are</p>
          <h2 className="h-display max-w-4xl reveal">Creative production, while creating impact and opportunity.</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-6xl">
            {[
              ["Agile", "Efficiency, not geography. Amsterdam-local, London/Paris/Johannesburg-hubbed — the right team per project, moving swiftly."],
              ["Innovative", "Carefully crafted processes and new technology, so work runs smoothly and people stay on the creative."],
              ["Connected", "Community-focused and deliberate about challenging the status quo. Our people reflect today&apos;s realities and stay relentlessly curious."],
            ].map(([t, d]) => (
              <div key={t} className="border-t border-white/10 pt-5 reveal">
                <h3 className="text-xl font-bold">{t}</h3>
                <p className="mt-2 text-white/65 leading-relaxed text-[0.95rem]">{d}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-10 mt-14 max-w-6xl items-center">
            <p className="text-white/75 leading-relaxed reveal">Founded by <span className="text-white">Gita Jagessar</span>, a seasoned production, project and operations director — 15+ years of digital, tech and advertising shaped on work for iconic brands. Thirtysixstudio represents the modern world: socially engaged, and purpose-driven.</p>
            <img src="https://images.pexels.com/photos/29940157/pexels-photo-29940157/free-photo-of-digital-artist-using-graphic-tablet-with-stylus.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Studio artist at work" className="w-full h-auto rounded-2xl object-cover aspect-[16/10]" loading="lazy" />
          </div>
        </section>

        {/* 03 HOW WE GIVE BACK */}
        <section id="giveback" className="px-[4%] py-20 relative overflow-hidden">
          <div className="orb orb-red parallax-fast" style={{ top: "20%", left: "88%" }} />
          <p className="kicker mb-5 reveal">03 — How we give back</p>
          <h2 className="h-display max-w-5xl reveal">Our industry can perpetuate harm. We&apos;re trying to reverse some of that.</h2>
          <div className="mt-8 border-l-4 border-[#FD2C2A] pl-6 max-w-3xl reveal">
            <p className="text-lg text-white/85 leading-relaxed">Through <span className="text-white font-bold">SS36</span> we reinvest revenue and expertise into the communities that shape the culture — community-centric projects for local marginalized groups and career initiatives opening doors into production, design and creative technology.</p>
          </div>
        </section>

        {/* 04 TALK TO US */}
        <section id="talk" className="px-[4%] py-20 bg-[#0d0d0d]">
          <p className="kicker mb-5 reveal">04 — Talk to us</p>
          <h2 className="h-display max-w-4xl reveal">Ready to get your project off the ground?</h2>
          <div className="grid md:grid-cols-2 gap-10 mt-12 max-w-6xl">
            <div className="reveal">
              <h3 className="text-xs tracking-[0.35em] text-white/45 mb-3">TALENT</h3>
              <p className="text-white/75 leading-relaxed">Always on the lookout for progressive collaborators who take pride in exceptional work and a continuous drive to learn.</p>
              <h4 className="mt-6 text-xs tracking-[0.35em] text-white/45 mb-3">ROLES OPEN</h4>
              <div className="flex flex-wrap gap-2">{ROLES.map((r) => <span key={r} className="chip">{r}</span>)}</div>
            </div>
            <div className="reveal">
              <h3 className="text-xs tracking-[0.35em] text-white/45 mb-3">CLIENTS</h3>
              <p className="text-white/75 leading-relaxed">We&apos;re accepting new clients and are excited to hear from you. Not sure what you need? We&apos;ll help you define the undefined.</p>
              <a href="mailto:hello@thirtysixstudio.com" className="mt-6 inline-block text-xl font-bold text-[#FD2C2A] underline underline-offset-8 decoration-2">hello@thirtysixstudio.com</a>
            </div>
          </div>

          <div className="mt-14 max-w-6xl border border-white/10 rounded-2xl p-6 md:p-8 reveal">
            <h3 className="text-xs tracking-[0.35em] text-white/45 mb-5">DROP US A LINE</h3>
            <ContactForm />
          </div>
        </section>

        {/* 05 SPICE */}
        <section className="px-[4%] py-20 text-center">
          <p className="kicker mb-3 reveal">PSSST.</p>
          <h2 className="h-display reveal">Looking for something spicy?</h2>
          <p className="mt-3 text-white/60 max-w-md mx-auto reveal">Floating adjuma peppers or the big red button — unlock our fiery alter ego.</p>
          <button onClick={pepperBurst} className="mt-8 inline-flex items-center gap-3 bg-[#FD2C2A] text-black font-black tracking-[0.2em] rounded-lg px-8 py-4 hover:bg-[#ff443f] transition-colors reveal">BRING THE HEAT!</button>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10 px-[4%] py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-extrabold">thirtysix<span className="text-[#FD2C2A]">studio</span> <span className="text-white/40 font-normal text-xs">— unofficial clone</span></p>
              <p className="text-[11px] text-white/40 mt-1 max-w-md">Portfolio experiment. Not affiliated with Thirtysixstudio B.V. Copy, design and assets belong to their owners.</p>
            </div>
            <div className="flex items-center gap-3">
              <a className="social-link" href="https://www.linkedin.com/company/thirtysixstudio" target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <a className="social-link" href="https://www.instagram.com/thirtysixstudio.ams" target="_blank" rel="noreferrer">Instagram ↗</a>
              <a className="social-link" href="#top">Top ↑</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

