import "./index.css";
import Canvas from "./canvas";
import data from "./data";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP, ScrollTrigger);

const SERVICES = [
  ["Creative", ["Art direction", "Creative direction"]],
  ["Design", ["Digital design", "UX/UI design", "Web design", "Graphic design", "3D design", "Interactive design", "Illustration design", "Brand design"]],
  ["Animation", ["2D animation", "3D animation", "Motion graphics", "Experimental animation", "Typography animation"]],
  ["Technology", ["Development", "Implementation", "Creative coding", "Prototyping", "Quality assurance", "Testing"]],
  ["Project delivery", ["Production strategy", "Project direction", "Operations excellence", "Team coordination"]],
  ["Example products", ["Social ads", "Websites", "AR filters and experiences", "Display ads", "Digital out of home", "Static and animated assets", "Digital installations", "Design toolkits"]],
];

const WHO = [
  ["Agile", "Local to Amsterdam with hubs in London, Paris and Johannesburg, we curate the right team per project and move swiftly."],
  ["Innovative", "Carefully crafted operational processes and new technology, so our people stay on the creative."],
  ["Connected", "Community-focused, and deliberate about challenging the status quo. Our people reflect today&apos;s realities and stay relentlessly curious."],
];

const ROLES = ["Project managers", "Digital producers", "Designers", "Illustrators", "Animators", "3D artists", "Motion designers", "Developers and coders", "Creative technologists", "Sound engineers"];

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).toLowerCase());
}

function Marquee() {
  const ref = useRef(null);
  useGSAP(() => {
    if (!ref.current) return;
    const el = ref.current;
    gsap.to(el, { x: -el.scrollWidth / 2, duration: 26, ease: "none", repeat: -1 });
  }, { scope: ref, dependencies: [] });
  const line = "FOR ALL THINGS DIGITAL PRODUCTION — ";
  return (
    <div className="marquee-band" aria-hidden="true">
      <div ref={ref} className="marquee-track">
        <span className="text-ink-2 text-sm md:text-base">{line.repeat(6)}</span>
        <span className="text-ink-2 text-sm md:text-base">{line.repeat(6)}</span>
      </div>
    </div>
  );
}

function Accordion() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mt-10 reveal">
      {SERVICES.map(([title, items], i) => (
        <div className="log-row" data-open={open === i} key={title}>
          <button className="service-toggle" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} style={{ display: "contents", background: "none", border: "none", cursor: "pointer", textAlign: "left", color: "inherit", padding: 0, font: "inherit" }}>
            <span className="log-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="log-title">{title}</span>
          </button>
          <ul className="log-items">{items.map((it) => <li key={it}>{it}</li>)}</ul>
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
    fetch("sendform.php", { method: "POST", body: new FormData(e.target) })
      .then((r) => r.text())
      .then((t) => setStatus(t && t.trim() === "success" ? "sent" : "error"))
      .catch(() => setStatus("error"));
  };

  if (status === "sent") {
    return (
      <div className="well">
        <p className="text-sm" style={{ color: "var(--color-success)" }}>Message sent</p>
        <p className="lead mt-2">Thank you for your message. We will get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid md:grid-cols-2 gap-4" noValidate>
      <div>
        <label className="contact-label" htmlFor="name">Name</label>
        <input id="name" name="name" className="contact-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      </div>
      <div>
        <label className="contact-label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="contact-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <p className={`form-error ${email && !validateEmail(email) ? "show" : ""}`}>Incorrect email</p>
      </div>
      <div className="md:col-span-2">
        <label className="contact-label" htmlFor="topic">Topic</label>
        <select id="topic" name="topic" className="contact-field" value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="">Topic</option>
          <option value="Talk about a project">Talk about a project</option>
          <option value="Become part of the team">Become part of the team</option>
          <option value="Something else">Something else</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="contact-label" htmlFor="message">Message</label>
        <textarea id="message" name="message" className="contact-field min-h-[100px]" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us about the project" />
      </div>
      <div className="md:col-span-2 flex items-center gap-5 flex-wrap">
        <button type="submit" className="btn-ember" style={status === "sent" ? { background: "var(--color-success)" } : undefined} disabled={!valid || status === "sending"}>{status === "sent" ? "Sent" : status === "sending" ? "Sending" : "Send"}</button>
        {status === "error" && <p className="form-error show">This static clone has no mail backend. Email <a className="underline underline-offset-2" href="mailto:shrikrishnachinta79@gmail.com">shrikrishnachinta79@gmail.com</a></p>}
      </div>
    </form>
  );
}

export default function App() {
  const [showCanvas, setShowCanvas] = useState(false);
  const cursorRef = useRef(null);
  const mainRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    let raf;
    const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  useGSAP(() => {
    if (!mainRef.current || !cursorRef.current) return;
    const move = (e) => gsap.to(cursorRef.current, { x: e.clientX - 9, y: e.clientY - 9, duration: 0.2, ease: "power2.out" });
    const over = () => gsap.to(cursorRef.current, { scale: 1.7, duration: 0.25 });
    const out = () => gsap.to(cursorRef.current, { scale: 1, duration: 0.25 });
    mainRef.current.addEventListener("mousemove", move);
    const hoverables = mainRef.current.querySelectorAll("a, button, .chip");
    hoverables.forEach((el) => { el.addEventListener("mouseenter", over); el.addEventListener("mouseleave", out); });
    return () => { mainRef.current?.removeEventListener("mousemove", move); hoverables.forEach((el) => { el.removeEventListener("mouseenter", over); el.removeEventListener("mouseleave", out); }); };
  }, { scope: mainRef, dependencies: [showCanvas] });

  // one reveal pass; visible by default, gsap only enhances
  useGSAP(() => {
    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.fromTo(el, { y: 26 }, { y: 0, duration: 0.75, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" } });
    });
  }, { scope: mainRef, dependencies: [] });

  const pepperBurst = () => {
    setShowCanvas((v) => !v);
    gsap.fromTo("body", { backgroundColor: "#FD2C2A" }, { backgroundColor: "var(--color-paper)", duration: 1.3, ease: "power2.out" });
  };

  return (
    <>
      <div ref={cursorRef} className="cursor" aria-hidden="true"></div>
      <div ref={mainRef} className="min-h-screen">

        {/* NAV — edge aligned: wordmark left, links + one action right */}
        <header className="site-nav">
          <a className="wordmark" href="#top">thirtysix<b>studio</b></a>
          <nav className="nav-links" aria-label="Sections">
            <a className="nav-link" href="#work">What we do</a>
            <a className="nav-link" href="#who">Who we are</a>
            <a className="nav-link" href="#giveback">How we give back</a>
            <a className="nav-link" href="#talk">Talk to us</a>
          </nav>
          <a className="btn-ember" href="#talk">Talk to us</a>
        </header>

        {/* HERO — Stage: headline left, the spinning pepper right */}
        <section id="top" className="section hero-fill" style={{ paddingBottom: "var(--space-xl)" }}>
          <div className="container hero-grid grid items-center gap-10 hero-fill-inner" style={{ gridTemplateColumns: "minmax(0, 7fr) minmax(0, 4fr)" }}>
            <div style={{ gridColumn: "span 7 / span 7" }}>
              <h1>Digital assets and experiences for purposeful brands.</h1>
              <p className="lead mt-5">A boutique production studio focused on design, animation and technology.</p>
              <div className="mt-8 flex items-center gap-3 flex-wrap">
                <a className="btn-ember" href="#talk">Talk to us</a>
                <a className="btn-ghost" href="#work">See what we do</a>
              </div>
            </div>
            <div className="pepper-stage" style={{ justifySelf: "start", minHeight: 300, maxWidth: "100%" }}>
              <div style={{ position: "relative", width: 260, height: 260 }}>
                <Canvas details={{ startIndex: 0, numImages: 150, duration: 5, size: 144, top: 0, left: 0, zIndex: 0 }} />
                <button onClick={pepperBurst} aria-label="Pepper burst" className="border-none bg-transparent p-0" style={{ position: "absolute", inset: 0, cursor: "none" }} />
              </div>
            </div>
          </div>
        </section>

        <Marquee />

        {/* 01 WORK — a firing log of six services */}
        <section id="work" className="section">
          <div className="container">
            <h2 className="h-section reveal">Creative production for ambitious advertising.</h2>
            <Accordion />
            <p className="mt-8 text-muted reveal">Got a project in mind? <a className="underline underline-offset-4 text-ink" href="#talk">Talk to us</a>, or let&apos;s define the undefined.</p>
          </div>
        </section>

        {/* 02 WHO */}
        <section id="who" className="section">
          <div className="container">
            <h2 className="h-section reveal">We create impact and opportunity, not just output.</h2>
            <div className="wells mt-10">
              {WHO.map(([t, d]) => (
                <div key={t} className="well reveal"><h3>{t}</h3><p className="mt-2 text-muted">{d}</p></div>
              ))}
            </div>
            <p className="mt-8 max-w-3xl text-ink-2 reveal">Founded by <span className="text-ink">Gita Jagessar</span>, a production, project and operations director from Amsterdam, with 15+ years across digital, tech and advertising. Thirtysixstudio represents the modern world: socially engaged, and purpose-driven.</p>
            {showCanvas && data[1].map((d) => <Canvas key={d.startIndex} details={d} />)}
          </div>
        </section>

        {/* 03 GIVE BACK */}
        <section id="giveback" className="section">
          <div className="container">
            <h2 className="h-section reveal">Our industry can perpetuate harm. We are trying to reverse some of that.</h2>
            <p className="lead mt-6 reveal">Through <span className="text-ink">SS36</span> we reinvest revenue and expertise into the communities that shape the culture: community-centric projects for local marginalized groups, and career initiatives that open doors into production, design and creative technology.</p>
          </div>
        </section>

        {/* 04 TALK */}
        <section id="talk" className="section">
          <div className="container">
            <h2 className="h-section reveal">Ready to get your project off the ground?</h2>
            <div className="grid gap-8 md:grid-cols-2 mt-10">
              <div className="reveal">
                <h3>Talent</h3>
                <p className="mt-2 text-muted">Always on the lookout for progressive collaborators with pride in the work and a continuous drive to learn.</p>
                <ul className="mt-4 flex flex-wrap gap-2">{ROLES.map((r) => <li key={r} className="chip">{r}</li>)}</ul>
              </div>
              <div className="reveal">
                <h3>Clients</h3>
                <p className="mt-2 text-muted">We are accepting new clients and we are excited to hear from you. Not sure what you need? We will help you define the undefined.</p>
                <a className="btn-ghost mt-5" href="mailto:hello@thirtysixstudio.com">hello@thirtysixstudio.com</a>
              </div>
            </div>
            <div className="well mt-10 reveal"><ContactForm /></div>
          </div>
        </section>

        {/* spice egg */}
        <section className="section">
          <div className="container reveal grid gap-10 md:grid-cols-2 items-center">
            <div>
              <h2 className="h-section" style={{ maxWidth: "none" }}>Something spicy, anyone?</h2>
              <p className="lead mt-4">Hit the button and meet our fiery alter ego.</p>
              <button onClick={pepperBurst} className="btn-ember mt-8">Bring the heat</button>
            </div>
            <div className="well" style={{ display: "grid", placeItems: "center", minHeight: 220, borderRadius: "var(--radius-card)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(5rem, 14vw, 9rem)", lineHeight: 1, color: "var(--color-accent)", letterSpacing: "-0.04em" }}>36</div>
            </div>
          </div>
        </section>

        {/* FOOTER — mast */}
        <footer className="footer-mast">
          <div className="container">
            <p className="footer-word">thirtysix<b style={{ color: "var(--color-accent)", fontWeight: "inherit" }}>studio</b></p>
            <p className="mt-2 text-muted max-w-md">Digital production studio, Amsterdam. Unofficial clone; unaffiliated with Thirtysixstudio B.V.</p>
            <div className="mt-6 flex items-center gap-6 flex-wrap">
              <a className="foot-link" href="https://www.linkedin.com/company/thirtysixstudio" target="_blank" rel="noreferrer">LinkedIn</a>
              <a className="foot-link" href="https://www.instagram.com/thirtysixstudio.ams" target="_blank" rel="noreferrer">Instagram</a>
              <a className="foot-link" href="#top">Back to top</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

