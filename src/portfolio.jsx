import { useState, useEffect, useRef } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiDocumentText } from "react-icons/hi";

const NAV_LINKS = ["Work", "About", "Skills", "Contact"];

const PROJECTS = [
  {
    id: 1,
    title: "Peculiar Designs Studio",
    tag: "Brand & UI Design",
    year: "2024",
    desc: "A personal design studio showcase featuring curated UI/UX case studies, brand identities, and creative direction — built with smooth micro-interactions.",
    tech: ["React", "Tailwind CSS", "Figma", "CSS Animations"],
    color: "#0F6E56", bg: "#E1F5EE", accent: "#1D9E75", link: "#",
  },
  {
    id: 2,
    title: "ShopEase E-commerce",
    tag: "Web App",
    year: "2024",
    desc: "A fully responsive e-commerce storefront with dynamic product filtering, cart state management, and a seamless checkout flow.",
    tech: ["React", "JavaScript", "Tailwind CSS", "Git"],
    color: "#185FA5", bg: "#E6F1FB", accent: "#378ADD", link: "#",
  },
  {
    id: 3,
    title: "DevFolio Template",
    tag: "UI Template",
    year: "2024",
    desc: "An open-source, fully responsive portfolio template for developers — pixel-perfect on all screen sizes, with dark mode and accessible markup.",
    tech: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    color: "#854F0B", bg: "#FAEEDA", accent: "#BA7517", link: "#",
  },
  {
    id: 4,
    title: "Campus Connect",
    tag: "UI/UX Design",
    year: "2023",
    desc: "A student networking platform designed during training at Digital Fortress Institute — wireframes, prototypes, and a React-based frontend implementation.",
    tech: ["React", "CSS", "GitHub"],
    color: "#533AB7", bg: "#EEEDFE", accent: "#7F77DD", link: "#",
  },
];

const SKILLS = [
  { name: "HTML & CSS", level: 95 },
  { name: "JavaScript", level: 85 },
  { name: "React", level: 80 },
  { name: "Tailwind CSS", level: 85 },
  { name: "Git / GitHub", level: 82 },
];

const TOOLS = [
 "VS Code", "GitHub", "Vercel","Chrome DevTools", 
  "Git", "Responsive Design", "Accessibility",
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function AnimSection({ children, delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { if (!isMobile) setMenuOpen(false); }, [isMobile]);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 1.25rem", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled || menuOpen ? "rgba(8,8,8,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff" }}>
          peculiar<span style={{ color: "#A8FF3E" }}>.</span>designs
        </div>

        {!isMobile && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {NAV_LINKS.slice(0, 3).map(l => (
              <button key={l} onClick={() => scrollTo(l)} style={{
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(255,255,255,0.55)", fontSize: 14,
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "0.02em", padding: "6px 12px", borderRadius: 6,
                transition: "color 0.2s",
              }}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.55)"}
              >{l}</button>
            ))}
            <button onClick={() => scrollTo("Contact")} style={{
              background: "#A8FF3E", color: "#080808", border: "none", cursor: "pointer",
              fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              padding: "8px 18px", borderRadius: 100,
              transition: "transform 0.15s, box-shadow 0.15s", marginLeft: 8,
            }}
              onMouseEnter={e => { e.target.style.transform = "scale(1.04)"; e.target.style.boxShadow = "0 0 20px rgba(168,255,62,0.4)"; }}
              onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "none"; }}
            >Hire Me</button>
          </div>
        )}

        {isMobile && (
          <button onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu" style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", justifyContent: "center",
            gap: 5, padding: 8, width: 40, height: 40,
          }}>
            <span style={{
              display: "block", width: 22, height: 2, background: "#fff", borderRadius: 2,
              transition: "transform 0.3s, opacity 0.3s",
              transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
            }} />
            <span style={{
              display: "block", width: 22, height: 2, background: "#fff", borderRadius: 2,
              transition: "transform 0.3s, opacity 0.3s",
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: "block", width: 22, height: 2, background: "#fff", borderRadius: 2,
              transition: "transform 0.3s, opacity 0.3s",
              transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
            }} />
          </button>
        )}
      </nav>

      {isMobile && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, zIndex: 99,
          background: "rgba(8,8,8,0.97)",
          borderBottom: menuOpen ? "1px solid rgba(255,255,255,0.08)" : "none",
          maxHeight: menuOpen ? 320 : 0,
          overflow: "hidden",
          transition: "max-height 0.35s ease",
        }}>
          <div style={{ padding: "1rem 1.25rem 1.5rem" }}>
            {NAV_LINKS.map(l => (
              <button key={l} onClick={() => scrollTo(l)} style={{
                display: "block", width: "100%", textAlign: "left",
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(255,255,255,0.75)", fontSize: 20,
                fontFamily: "'Syne', sans-serif", fontWeight: 700,
                padding: "13px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}>{l}</button>
            ))}
            <button onClick={() => scrollTo("Contact")} style={{
              marginTop: 16, width: "100%",
              background: "#A8FF3E", color: "#080808",
              border: "none", cursor: "pointer",
              fontSize: 15, fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
              padding: "14px", borderRadius: 12,
            }}>Hire Me</button>
          </div>
        </div>
      )}
    </>
  );
}

function Hero() {
  const [hover, setHover] = useState(false);
  const isMobile = useIsMobile();

  return (
    <section id="hero" style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center",
      padding: isMobile ? "100px 1.25rem 60px" : "80px 2rem 0",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `linear-gradient(rgba(168,255,62,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(168,255,62,0.04) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      <div style={{
        position: "absolute",
        top: isMobile ? "20%" : "30%",
        left: isMobile ? "50%" : "60%",
        width: isMobile ? 280 : 600, height: isMobile ? 280 : 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(168,255,62,0.08) 0%, transparent 70%)",
        transform: "translate(-50%,-50%)", zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 820 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(168,255,62,0.1)", border: "1px solid rgba(168,255,62,0.2)",
          borderRadius: 100, padding: "6px 14px", marginBottom: 24,
          fontSize: 11, fontFamily: "'DM Sans', sans-serif",
          color: "#A8FF3E", letterSpacing: "0.08em",
          animation: "fadeDown 0.6s ease both",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#A8FF3E", display: "inline-block" }} />
          AVAILABLE FOR WORK
        </div>

        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: isMobile ? "clamp(38px, 10vw, 56px)" : "clamp(48px, 8vw, 88px)",
          fontWeight: 800, lineHeight: 1.0,
          letterSpacing: "-0.04em", color: "#fff",
          margin: "0 0 20px",
          animation: "fadeUp 0.7s ease 0.1s both",
        }}>
          Designing &amp; building<br />
          <span style={{ WebkitTextStroke: "2px #fff", color: "transparent" }}>interfaces</span>
          <br />that inspire.
        </h1>

        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: isMobile ? 15 : 18, lineHeight: 1.7,
          color: "rgba(255,255,255,0.5)",
          maxWidth: 480, margin: "0 0 32px",
          animation: "fadeUp 0.7s ease 0.2s both",
        }}>
          Frontend Developer &amp; Creative Designer — crafting clean, responsive,
          and visually compelling web experiences that users love.
        </p>

        <div style={{
          display: "flex", gap: 12, flexWrap: "wrap",
          animation: "fadeUp 0.7s ease 0.3s both",
        }}>
          <button
            onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              background: "#A8FF3E", color: "#080808",
              border: "none", cursor: "pointer",
              fontSize: isMobile ? 14 : 15,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
              padding: isMobile ? "12px 22px" : "14px 28px", borderRadius: 100,
              display: "flex", alignItems: "center", gap: 8,
              transition: "transform 0.15s, box-shadow 0.15s",
              transform: hover ? "scale(1.03)" : "scale(1)",
              boxShadow: hover ? "0 0 30px rgba(168,255,62,0.35)" : "none",
            }}
          >
            View My Work <span style={{ fontSize: 16 }}>→</span>
          </button>
          <a href="https://github.com/dejitheog" target="_blank" rel="noreferrer" style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#fff", fontSize: isMobile ? 14 : 15,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            padding: isMobile ? "12px 22px" : "14px 28px", borderRadius: 100,
            textDecoration: "none", display: "flex", alignItems: "center", gap: 8,
            transition: "background 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
          >GitHub Profile</a>
        </div>

        <div style={{
          display: "flex", gap: isMobile ? 24 : 32, marginTop: isMobile ? 48 : 64,
          animation: "fadeUp 0.7s ease 0.4s both",
        }}>
          {[["1+", "Year Experience"], ["10+", "Projects Built"], ["2", "Disciplines"]].map(([n, l]) => (
            <div key={l}>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: isMobile ? 26 : 32, fontWeight: 800, color: "#fff",
                letterSpacing: "-0.04em", lineHeight: 1,
              }}>{n}</div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11, color: "rgba(255,255,255,0.35)",
                marginTop: 4, letterSpacing: "0.04em",
              }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {!isMobile && (
        <div style={{
          position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
          animation: "bounce 2s ease-in-out infinite",
        }}>
          <div style={{
            width: 28, height: 44, borderRadius: 14,
            border: "2px solid rgba(255,255,255,0.2)",
            display: "flex", justifyContent: "center", paddingTop: 8,
          }}>
            <div style={{
              width: 4, height: 8, borderRadius: 2,
              background: "rgba(255,255,255,0.4)",
              animation: "scrollDot 2s ease-in-out infinite",
            }} />
          </div>
        </div>
      )}
    </section>
  );
}

function ProjectCard({ project, index }) {
  const [ref, visible] = useInView(0.1);
  const [hovered, setHovered] = useState(false);
  return (
    <div ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `all 0.3s ease, opacity 0.6s ease ${index * 100}ms, transform 0.6s ease ${index * 100}ms`,
        background: hovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 20, padding: "24px",
        cursor: "pointer", position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${project.accent}, transparent)`,
        borderRadius: "20px 20px 0 0",
        opacity: hovered ? 1 : 0, transition: "opacity 0.3s",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
          color: project.accent, background: `${project.bg}22`,
          border: `1px solid ${project.accent}33`, padding: "4px 10px", borderRadius: 100,
        }}>{project.tag.toUpperCase()}</div>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.25)" }}>{project.year}</span>
      </div>
      <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", margin: "0 0 10px" }}>{project.title}</h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.45)", margin: "0 0 18px" }}>{project.desc}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
        {project.tech.map(t => (
          <span key={t} style={{
            fontFamily: "'DM Mono', monospace", fontSize: 10,
            color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)", padding: "3px 10px", borderRadius: 6,
          }}>{t}</span>
        ))}
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
        color: hovered ? "#A8FF3E" : "rgba(255,255,255,0.35)", transition: "color 0.3s",
      }}>
        View Project
        <span style={{ display: "inline-block", transform: hovered ? "translateX(4px)" : "translateX(0)", transition: "transform 0.3s" }}>→</span>
      </div>
    </div>
  );
}

function Work() {
  const isMobile = useIsMobile();
  return (
    <section id="work" style={{ padding: isMobile ? "80px 1.25rem" : "120px 2rem", maxWidth: 1200, margin: "0 auto" }}>
      <AnimSection>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#A8FF3E", letterSpacing: "0.15em", marginBottom: 14 }}>01 — SELECTED WORK</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: isMobile ? "clamp(28px, 8vw, 40px)" : "clamp(32px, 5vw, 52px)",
            fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", margin: 0,
          }}>Projects I'm proud of.</h2>
        </div>
      </AnimSection>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 16,
      }}>
        {PROJECTS.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
      </div>
    </section>
  );
}

function About() {
  const isMobile = useIsMobile();
  return (
    <section id="about" style={{ padding: isMobile ? "80px 1.25rem" : "120px 2rem", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? 36 : 80, alignItems: "center",
      }}>
        <AnimSection>
          <div style={{
            position: "relative", width: "100%",
            aspectRatio: isMobile ? "16/9" : "1/1",
            borderRadius: 24, overflow: "hidden",
            background: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            minHeight: isMobile ? 200 : "auto",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 12,
            }}>
                          <img
              src="/profile.jpeg"
              alt="Peculiar David"
              style={{
                width: isMobile ? 120 : 300,
                height: isMobile ? 120 : 300,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid rgba(168,255,62,0.2)",
              }}
/>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? 15 : 18, fontWeight: 800, color: "#fff" }}>Peculiar David</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>FRONTEND DEV & DESIGNER</div>
            </div>
            {[...Array(9)].map((_, i) => (
              <div key={i} style={{
                position: "absolute",
                right: 16 + (i % 3) * 14,
                bottom: 16 + Math.floor(i / 3) * 14,
                width: 4, height: 4, borderRadius: "50%",
                background: "rgba(168,255,62,0.3)",
              }} />
            ))}
          </div>
        </AnimSection>

        <AnimSection delay={isMobile ? 0 : 150}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#A8FF3E", letterSpacing: "0.15em", marginBottom: 14 }}>02 — ABOUT ME</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: isMobile ? "clamp(26px, 7vw, 36px)" : "clamp(28px, 4vw, 42px)",
            fontWeight: 800, letterSpacing: "-0.04em",
            color: "#fff", margin: "0 0 18px", lineHeight: 1.1,
          }}>
            I turn ideas into<br />
            <span style={{ color: "#A8FF3E" }}>fast, beautiful</span><br />
            web experiences.
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.45)", margin: "0 0 12px" }}>
            I'm Olorunsola Peculiar David — a Frontend Developer and Creative Designer
            with a B.Sc. in Industrial Mathematics from Covenant University. I trained
            in Frontend Development at Digital Fortress Institute and bring a unique
            analytical edge to every project I design.
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.45)", margin: "0 0 24px" }}>
            I blend clean code with thoughtful design — building responsive, accessible
            interfaces under my brand, <span style={{ color: "#A8FF3E", fontWeight: 600 }}>Peculiar Designs</span>.
            Currently open to junior roles and exciting collaborations.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
  {
    icon: <FaGithub />,
    label: "Github",
    href: "https://github.com/dejitheog",
  },
  {
    icon: <FaLinkedin />,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/peculiar-olorunsola-7663a3212/",
  },
  {
    icon: <HiDocumentText />,
    label: "Resume",
    href: "https://drive.google.com/file/d/13szWET8-a61zeA9wRyuqFkwCzQYus2DU/view?usp=drive_link",
  },
].map(({ icon, label, href }) => (
              <a key={label} href={href} style={{
                display: "flex", alignItems: "center", gap: 6,
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                color: "rgba(255,255,255,0.55)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "9px 14px", borderRadius: 100,
                textDecoration: "none", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
              >
  <span style={{ display: "flex", alignItems: "center", fontSize: 16 }}>
    {icon}
  </span>

  <span>{label}</span>
</a>
            ))}
          </div>
        </AnimSection>
      </div>
    </section>
  );
}

function SkillBar({ skill, visible, delay }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
        <span>{skill.name}</span>
        <span style={{ color: "#A8FF3E", fontFamily: "'DM Mono', monospace" }}>{skill.level}%</span>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          background: "linear-gradient(90deg, #A8FF3E, #1D9E75)",
          borderRadius: 100,
          width: visible ? `${skill.level}%` : "0%",
          transition: `width 1s ease ${delay}ms`,
        }} />
      </div>
    </div>
  );
}

function Skills() {
  const [ref, visible] = useInView(0.2);
  const isMobile = useIsMobile();
  return (
    <section id="skills" style={{
      padding: isMobile ? "80px 1.25rem" : "120px 2rem",
      background: "rgba(255,255,255,0.02)",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <AnimSection>
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#A8FF3E", letterSpacing: "0.15em", marginBottom: 14 }}>03 — SKILLS</div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: isMobile ? "clamp(28px, 8vw, 40px)" : "clamp(32px, 5vw, 52px)",
              fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", margin: 0,
            }}>The stack I live in.</h2>
          </div>
        </AnimSection>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 36 : 80,
        }}>
          <div ref={ref}>
            {SKILLS.map((s, i) => (
              <SkillBar key={s.name} skill={s} visible={visible} delay={i * 100} />
            ))}
          </div>
          <AnimSection delay={isMobile ? 0 : 200}>
            <div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginBottom: 14 }}>TOOLS & PLATFORMS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {TOOLS.map(t => (
                  <span key={t} style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                    color: "rgba(255,255,255,0.55)",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    padding: "7px 12px", borderRadius: 100,
                  }}>{t}</span>
                ))}
              </div>
              <div style={{
                marginTop: 32, background: "rgba(168,255,62,0.05)",
                border: "1px solid rgba(168,255,62,0.15)", borderRadius: 16, padding: 20,
              }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: "#A8FF3E", marginBottom: 8 }}>Currently Learning</div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.45)", margin: 0 }}>
                  Deep-diving into Next.js, TypeScript, and motion design with Framer Motion to level up my frontend and design capabilities.
                </p>
              </div>
            </div>
          </AnimSection>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = () => {
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" style={{ padding: isMobile ? "80px 1.25rem" : "120px 2rem", maxWidth: 1200, margin: "0 auto" }}>
      <AnimSection>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#A8FF3E", letterSpacing: "0.15em", marginBottom: 14 }}>04 — CONTACT</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: isMobile ? "clamp(28px, 8vw, 40px)" : "clamp(32px, 5vw, 52px)",
            fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", margin: "0 0 12px",
          }}>Let's build something.</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.4)", maxWidth: 440, margin: 0, lineHeight: 1.7 }}>
            Open to junior roles, freelance projects, and collaborations. Send a message and I'll respond within 24 hours.
          </p>
        </div>
      </AnimSection>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? 32 : 80,
      }}>
        <AnimSection delay={100}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[["Name", "name", "text", "Peculiar David"], ["Email", "email", "email", "peculiar@example.com"]].map(([label, field, type, placeholder]) => (
              <div key={field}>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>{label.toUpperCase()}</label>
                <input type={type} placeholder={placeholder} value={form[field]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  style={{
                    width: "100%", padding: "13px 16px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12, outline: "none",
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#fff",
                    boxSizing: "border-box", transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(168,255,62,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>
            ))}
            <div>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>MESSAGE</label>
              <textarea placeholder="Tell me about your project..." value={form.message} rows={5}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                style={{
                  width: "100%", padding: "13px 16px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12, outline: "none", resize: "vertical",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#fff",
                  boxSizing: "border-box", transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(168,255,62,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>
            <button onClick={handleSubmit} style={{
              background: sent ? "#1D9E75" : "#A8FF3E",
              color: "#080808", border: "none", cursor: "pointer",
              fontSize: 15, fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
              padding: "15px 28px", borderRadius: 12, transition: "all 0.3s",
            }}
              onMouseEnter={e => !sent && (e.target.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.target.style.transform = "scale(1)")}
            >{sent ? "✓ Message Sent!" : "Send Message →"}</button>
          </div>
        </AnimSection>

        <AnimSection delay={isMobile ? 0 : 200}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Email", value: "olorunsolapeculiar@gmail.com", icon: "✉" },
              { label: "Location", value: "Lagos, Nigeria", icon: "📍" },
              { label: "Availability", value: "Open to opportunities", icon: "🟢" },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 14,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12, padding: "14px 18px",
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: "rgba(168,255,62,0.08)",
                  border: "1px solid rgba(168,255,62,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
                }}>{icon}</div>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", marginBottom: 2 }}>{label.toUpperCase()}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </AnimSection>
      </div>
    </section>
  );
}

function Footer() {
  const isMobile = useIsMobile();
  return (
    <footer style={{
      borderTop: "1px solid rgba(255,255,255,0.05)",
      padding: "24px 1.25rem",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: isMobile ? 8 : 0,
      maxWidth: 1200, margin: "0 auto",
    }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: "#fff" }}>
        peculiar<span style={{ color: "#A8FF3E" }}>.</span>designs
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
        © 2025 Olorunsola Peculiar David. Built with React.
      </div>
    </footer>
  );
}

export default function Portfolio() {
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
      *, *::before, *::after { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { margin: 0; background: #080808; overflow-x: hidden; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: #111; }
      ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
      input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeDown {
        from { opacity: 0; transform: translateY(-12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes bounce {
        0%, 100% { transform: translateX(-50%) translateY(0); }
        50% { transform: translateX(-50%) translateY(8px); }
      }
      @keyframes scrollDot {
        0%, 100% { opacity: 1; transform: translateY(0); }
        50% { opacity: 0.3; transform: translateY(10px); }
      }
    `;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  return (
    <div style={{ background: "#080808", minHeight: "100vh", overflowX: "hidden" }}>
      <NavBar />
      <Hero />
      <Work />
      <About />
      <Skills />
      <Contact />
      <Footer />
    </div>
  );
}