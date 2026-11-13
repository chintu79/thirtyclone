import "./index.css";
import Canvas from "./canvas";
import data from "./data";
import Lenis from "lenis";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);

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

/* split heading into animated char spans (Splitting.js-style, no dep) */
function CharReveal({ as: Tag = "h1", className, children }) {
  const ref = useRef(null);
  useGSAP(() => {
    const chars = ref.current?.querySelectorAll(".char");
    if (!chars) return;
    gsap.fromTo(chars,
      { yPercent: 120, rotationZ: 30, opacity: 0 },
      { yPercent: 0, rotationZ: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.028 }
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
};

/* rotating circular text — real site uses CircleType */
function CircularText() {
  return (
    <svg viewBox="0 0 200 200" className="circular-spin w-36 h-36 md:w-44 md:h-44 text-[#FD2C2A]" aria-hidden="true">
      <defs>
        <path id="circlePath" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
      </defs>
      <text fill="currentColor" fontSize="11.5" letterSpacing="3.5" fontWeight="700">
        <textPath href="#circlePath">THIRTYSIXSTUDIO — FOR ALL THINGS DIGITAL PRODUCTION — </textPath>
      </text>
      <circle cx="100" cy="100" r="46" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" opacity="0.6" />
      <text x="100" y="106" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="800">36</text>
    </svg>
  );
}

function Accordion() {
  const [open, setOpen] = useState(1);
  return (
    <div className="mt-2">
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
    <form onSubmit={submit} className="grid md:grid-cols-2 gap-5" noValidate>
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
        <button type="submit" className={`btn-send ${valid ? "" : "disabled"} ${status === "error" ? "" : ""}`} disabled={!valid || status === "sending"}>
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
  const heroRef = useRef(null);

  // Lenis smooth scroll (what the real site runs)
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    let raf;
    const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  // Custom cursor
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
    gsap.to(el, { x: -totalWidth, duration: 18, ease: "none", repeat: -1 });
  }, { scope: scrollTitleRef, dependencies: [] });

  const pepperBurst = () => {
    setShowCanvas((prev) => !prev);
    gsap.fromTo("body", { backgroundColor: "#FD2C2A" }, { backgroundColor: "#0a0a0a", duration: 1.4, ease: "power2.out" });
  };

  return (
    <>
      <div ref={cursorRef} className="cursor" aria-hidden="true"></div>
      <div ref={mainRef} className="selection:bg-[#FD2C2A] selection:text-black bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden">

        {/* NAV */}
        <header className="fixed top-0 left-0 w-full z-50 px-[4%] py-5 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm">
          <a href="#top" className="text-xl font-extrabold tracking-tight">thirtysix<span className="text-[#FD2C2A]">studio</span></a>
          <nav className="hidden md:flex items-center gap-8">
            <a className="nav-link" href="#work">What we do</a>
            <a className="nav-link" href="#who">Who we are</a>
            <a className="nav-link" href="#giveback">How we give back</a>
            <a className="nav-link" href="#talk">Talk to us</a>
          </nav>
          <a href="#talk" className="text-xs font-bold border border-[#FD2C2A]/60 rounded-md px-3 py-2 hover:bg-[#FD2C2A] hover:text-black transition-colors">MENU</a>
        </header>

        {/* HERO */}
        <section id="top" ref={heroRef} className="min-h-screen flex flex-col justify-end relative px-[4%] pb-10 pt-28 overflow-hidden">
          {showCanvas && data[0].map((d) => <Canvas key={d.startIndex} details={d} />)}
          <div className="max-w-5xl">
            <CharReveal as="h2" className="h-display">At Thirtysixstudio, we build digital assets and immersive experiences for purposeful brands.</CharReveal>
            <p className="mt-6 text-lg text-white/70 max-w-xl">We&apos;re a boutique production studio focused on design, animation, and technology — constantly rethinking what digital craft can do.</p>
            <p className="mt-8 text-sm tracking-[0.3em] text-white/50">↓ SCROLL</p>
          </div>
          <div className="absolute right-[2%] bottom-[18%] hidden lg:block"><CircularText /></div>
          <button onClick={pepperBurst} aria-label="Thirtysixstudio — click for the pepper easter egg" className="w-full text-left">
            <CharReveal as="h1" className="mt-8 whitespace-nowrap text-[9vw] leading-[0.85] font-black tracking-tighter hover:text-white/90 transition-colors">THIRTYSIXSTUDIO</CharReveal>
          </button>
        </section>

        {/* MARQUEE */}
        <div className="w-full overflow-hidden border-y border-white/10 py-2 bg-black">
          <div ref={scrollTitleRef} className="flex whitespace-nowrap w-max">
            {[0, 1].map((n) => <span key={n} className="text-lg md:text-2xl font-semibold tracking-[0.2em] text-white/85">FOR ALL THINGS DIGITAL PRODUCTION —&nbsp;&nbsp;FOR ALL THINGS DIGITAL PRODUCTION —&nbsp;&nbsp;</span>)}
          </div>
        </div>

        {/* 01 WHAT WE DO */}
        <section id="work" className="relative px-[4%] py-24">
          {showCanvas && data[1].map((d) => <Canvas key={d.startIndex} details={d} />)}
          <p className="kicker mb-5">01 — WHAT WE DO</p>
          <h2 className="h-display max-w-5xl">We elevate creative production in the advertising industry, transforming ambitious ideas into reality.</h2>
          <div className="grid md:grid-cols-2 gap-8 mt-8 max-w-5xl text-white/75 leading-relaxed">
            <p>By combining cutting-edge craft with modern technology and top-tier processes, we deliver sophisticated work that resonates. Whether you need a full-scale campaign or help at a specific phase, we&apos;ve got you covered.</p>
            <p>Our agile approach balances innovation with simplicity, ensuring your journey with us is seamless, transparent, and rewarding.</p>
          </div>
          <h3 className="mt-16 mb-2 text-sm tracking-[0.35em] text-white/50">OUR SERVICES</h3>
          <Accordion />
          <p className="mt-10 text-white/70">Got a project in mind? Drop us a line at <a className="text-[#FD2C2A] underline underline-offset-4" href="#talk">talk to us</a> — or ask for the undefined. Let&apos;s explore all creative and technical possibilities.</p>
        </section>

        {/* 02 WHO WE ARE */}
        <section id="who" className="px-[4%] py-24 bg-[#0d0d0d]">
          <p className="kicker mb-5">02 — WHO WE ARE</p>
          <h2 className="h-display max-w-4xl">We elevate creative production, while creating impact and opportunity.</h2>
          <div className="grid md:grid-cols-3 gap-10 mt-14 max-w-6xl">
            {[
              ["Agile", "We live and breathe efficiency and are not limited by geography. Local to Amsterdam with hubs in London, Paris, Johannesburg and beyond — we curate the right team for each project and get moving swiftly."],
              ["Innovative", "We use carefully crafted operational processes and new technology to ensure our initiatives run smoothly. This allows our people to do what they do best — the creative work."],
              ["Connected", "We are community-focused, and deliberate about challenging the status quo. Our people reflect today&apos;s realities and remain relentlessly curious."],
            ].map(([t, d]) => (
              <div key={t} className="border-t border-white/10 pt-6">
                <h3 className="text-2xl font-bold tracking-tight">{t}</h3>
                <p className="mt-3 text-white/70 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-12 mt-16 max-w-6xl items-center">
            <div>
              <p className="text-white/80 leading-relaxed">Thirtysixstudio was founded by Gita Jagessar, a seasoned production, project, and operations director from Amsterdam — bringing 15+ years of digital, tech, and advertising expertise shaped on work for iconic brands.</p>
              <p className="mt-4 text-white/80 leading-relaxed">Thirtysixstudio represents the modern world: socially engaged, and purpose-driven.</p>
            </div>
            <img src="https://images.pexels.com/photos/29940157/pexels-photo-29940157/free-photo-of-digital-artist-using-graphic-tablet-with-stylus.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Studio artist at work" className="w-full h-auto rounded-2xl object-cover shadow-2xl aspect-[16/10]" loading="lazy" />
          </div>
        </section>

        {/* 03 HOW WE GIVE BACK */}
        <section id="giveback" className="px-[4%] py-24 relative overflow-hidden">
          <p className="kicker mb-5">03 — HOW WE GIVE BACK</p>
          <h2 className="h-display max-w-5xl">At Thirtysixstudio, we recognize that our industry can perpetuate harm. We believe we have to try and reverse some of that.</h2>
          <div className="mt-10 border-l-4 border-[#FD2C2A] pl-6 max-w-3xl">
            <p className="text-xl text-white/85 leading-relaxed">Through <span className="text-white font-bold">SS36</span>, we reinvest some of our revenue and expertise into the communities that shape the culture and trends our field runs on.</p>
            <p className="mt-4 text-white/70 leading-relaxed">Our SS36 work includes community-centric projects for local marginalized groups, as well as career initiatives for marginalized talent — opening doors into production, design and creative technology. The most impactful way to help is to collaborate with us.</p>
          </div>
        </section>

        {/* 04 TALK TO US */}
        <section id="talk" className="px-[4%] py-24 bg-[#0d0d0d]">
          <p className="kicker mb-5">04 — TALK TO US</p>
          <h2 className="h-display max-w-5xl">Ready to get your project off the ground?</h2>
          <div className="grid md:grid-cols-2 gap-12 mt-14 max-w-6xl">
            <div>
              <h3 className="text-sm tracking-[0.35em] text-white/50 mb-4">TALENT</h3>
              <p className="text-white/80 leading-relaxed">Thirtysixstudio is always on the lookout for talented collaborators — progressive individuals who take pride in exceptional work and a continuous drive to learn.</p>
              <h4 className="mt-6 text-sm tracking-[0.35em] text-white/50 mb-4">ROLES OPEN</h4>
              <div className="flex flex-wrap gap-2">{ROLES.map((r) => <span key={r} className="chip">{r}</span>)}</div>
            </div>
            <div>
              <h3 className="text-sm tracking-[0.35em] text-white/50 mb-4">CLIENTS</h3>
              <p className="text-white/80 leading-relaxed">We&apos;re currently accepting new clients and are excited to hear from you. Not sure what you need? We&apos;re here to help you define the undefined.</p>
              <a href="mailto:hello@thirtysixstudio.com" className="mt-6 inline-block text-xl font-bold text-[#FD2C2A] underline underline-offset-8 decoration-2">hello@thirtysixstudio.com</a>
            </div>
          </div>

          <div className="mt-16 max-w-6xl border border-white/10 rounded-2xl p-6 md:p-10">
            <h3 className="text-sm tracking-[0.35em] text-white/50 mb-6">DROP US A LINE</h3>
            <ContactForm />
          </div>
        </section>

        {/* 05 SPICE — the easter egg trigger */}
        <section className="px-[4%] py-24 text-center relative">
          <p className="kicker mb-4">PSSST.</p>
          <h2 className="h-display">Looking for something spicy?</h2>
          <p className="mt-4 text-white/70 max-w-xl mx-auto">Find the floating adjuma peppers or hit the big red button to unlock our fiery alter ego. Be warned — it&apos;s hot in here.</p>
          <button onClick={pepperBurst} className="mt-10 inline-flex items-center gap-3 bg-[#FD2C2A] text-black font-black tracking-[0.2em] rounded-lg px-10 py-5 text-lg hover:bg-[#ff443f] transition-colors">BRING THE HEAT!</button>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10 px-[4%] py-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-lg font-extrabold">thirtysix<span className="text-[#FD2C2A]">studio</span> <span className="text-white/40 font-normal text-sm">— unofficial clone</span></p>
              <p className="text-xs text-white/45 mt-2 max-w-md">Unofficial portfolio experiment. Not affiliated with Thirtysixstudio B.V. All original design, copy and assets are theirs.</p>
            </div>
            <div className="flex items-center gap-3">
              <a className="social-link" href="https://www.linkedin.com/company/thirtysixstudio" target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <a className="social-link" href="https://www.instagram.com/thirtysixstudio.ams" target="_blank" rel="noreferrer">Instagram ↗</a>
              <a className="social-link" href="#top">Back to top ↑</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
