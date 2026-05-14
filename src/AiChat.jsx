import { useState, useRef, useEffect, useCallback } from "react";

const SYSTEM_PROMPTS = {
  default: "You are a helpful, thoughtful AI assistant. Be concise but thorough.",
  coder: "You are an expert software engineer. Write clean, well-commented code. Prefer modern patterns and best practices.",
  writer: "You are a creative writing assistant. Help craft compelling, vivid prose with strong voice and style.",
  analyst: "You are a data analyst and strategic thinker. Break down complex problems with structured reasoning and clear insights.",
};

const PERSONAS = [
  { id: "default", icon: "✦", label: "Assistant", color: "#7C6FF7", bg: "#7C6FF715" },
  { id: "coder",   icon: "⌥", label: "Engineer",  color: "#0ABFA3", bg: "#0ABFA315" },
  { id: "writer",  icon: "✍", label: "Writer",    color: "#F26D6D", bg: "#F26D6D15" },
  { id: "analyst", icon: "◈", label: "Analyst",   color: "#E9A838", bg: "#E9A83815" },
];

const STARTERS = [
  { icon: "💡", text: "Explain quantum entanglement simply" },
  { icon: "🐍", text: "Write a Python web scraper" },
  { icon: "✉️", text: "Draft a cold email template" },
  { icon: "📊", text: "Analyze pros and cons of remote work" },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

function TypingDots({ color }) {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "4px 2px" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: "50%",
          background: color || "#7C6FF7",
          display: "block",
          animation: "typingBounce 1.3s ease-in-out infinite",
          animationDelay: `${i * 0.18}s`,
        }} />
      ))}
    </div>
  );
}

function Avatar({ persona, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: persona.bg,
      border: `1.5px solid ${persona.color}40`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38,
      color: persona.color,
      fontFamily: "'DM Mono', monospace",
    }}>
      {persona.icon}
    </div>
  );
}

function MessageBubble({ msg, persona }) {
  const isUser = msg.role === "user";
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: isUser ? "row-reverse" : "row",
      gap: 10,
      alignItems: "flex-end",
      padding: "4px 0",
      animation: "msgIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both",
    }}>
      {!isUser && <Avatar persona={persona} size={32} />}

      <div style={{ maxWidth: "78%", minWidth: 0 }}>
        {!isUser && (
          <p style={{
            fontSize: 11, color: "rgba(255,255,255,0.35)",
            marginBottom: 4, paddingLeft: 2,
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.02em",
          }}>Aura · {persona.label}</p>
        )}
        <div style={{
          background: isUser
            ? "linear-gradient(135deg, #7C6FF7 0%, #A78BFA 100%)"
            : "rgba(255,255,255,0.055)",
          border: isUser ? "none" : "1px solid rgba(255,255,255,0.09)",
          borderRadius: isUser ? "20px 20px 5px 20px" : "5px 20px 20px 20px",
          padding: "10px 15px",
          fontSize: 14.5,
          lineHeight: 1.7,
          color: isUser ? "#fff" : "#DDD8FF",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "-0.01em",
        }}>
          {msg.content}
        </div>

        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: isUser ? "flex-end" : "flex-start",
          gap: 8, marginTop: 4, paddingLeft: isUser ? 0 : 2,
        }}>
          <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans', sans-serif" }}>
            {new Date(msg.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          {!isUser && (
            <button onClick={copy} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 11, color: copied ? "#0ABFA3" : "rgba(255,255,255,0.25)",
              fontFamily: "'DM Sans', sans-serif", padding: 0,
              transition: "color 0.2s",
            }}>
              {copied ? "✓ copied" : "copy"}
            </button>
          )}
        </div>
      </div>

      {isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #7C6FF7, #A78BFA)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, color: "#fff", fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
        }}>
          U
        </div>
      )}
    </div>
  );
}

function Sidebar({ conversations, activeId, onSelect, onNew, persona, onPersonaChange, open, onClose, isMobile }) {
  return (
    <>
      {isMobile && open && (
        <div onClick={onClose} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          zIndex: 40, backdropFilter: "blur(2px)",
        }} />
      )}
      <aside style={{
        width: 265, flexShrink: 0,
        background: "#0D0B1E",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column",
        position: isMobile ? "fixed" : "relative",
        left: 0, top: 0, bottom: 0, zIndex: 50,
        height: "100%",
        transform: isMobile ? (open ? "translateX(0)" : "translateX(-100%)") : "none",
        transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: isMobile && open ? "4px 0 32px rgba(0,0,0,0.5)" : "none",
      }}>
        {/* Logo */}
        <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
            <div style={{
              width: 34, height: 34,
              background: "linear-gradient(135deg, #7C6FF7, #A78BFA)",
              borderRadius: 10, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 16, flexShrink: 0,
            }}>✦</div>
            <div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>Aura</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif", marginTop: 1 }}>AI Assistant</p>
            </div>
            <span style={{
              marginLeft: "auto", fontSize: 9.5,
              background: "#7C6FF720", color: "#A78BFA",
              padding: "2px 7px", borderRadius: 5,
              border: "1px solid #7C6FF740",
              fontFamily: "'DM Mono', monospace",
            }}>beta</span>
          </div>
          <button onClick={onNew} style={{
            width: "100%", padding: "9px 14px",
            background: "rgba(124,111,247,0.1)",
            border: "1px solid rgba(124,111,247,0.25)",
            borderRadius: 10, color: "#A78BFA",
            cursor: "pointer", fontSize: 13,
            display: "flex", alignItems: "center", gap: 7,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            transition: "all 0.18s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(124,111,247,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(124,111,247,0.1)"}
          >
            <span style={{ fontSize: 18, lineHeight: 1, marginTop: -1 }}>+</span> New conversation
          </button>
        </div>

        {/* Conversations */}
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", padding: "0 8px 6px", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>Recent</p>
          {conversations.length === 0 && (
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.18)", padding: "6px 8px", fontFamily: "'DM Sans', sans-serif" }}>No chats yet</p>
          )}
          {conversations.map(conv => (
            <button key={conv.id} onClick={() => { onSelect(conv.id); if (isMobile) onClose(); }}
              style={{
                width: "100%", textAlign: "left", padding: "8px 10px",
                background: conv.id === activeId ? "rgba(124,111,247,0.13)" : "transparent",
                border: conv.id === activeId ? "1px solid rgba(124,111,247,0.22)" : "1px solid transparent",
                borderRadius: 9, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
                marginBottom: 2, transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (conv.id !== activeId) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { if (conv.id !== activeId) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 14, flexShrink: 0 }}>💬</span>
              <span style={{
                fontSize: 12.5, color: conv.id === activeId ? "#C4BFFF" : "rgba(255,255,255,0.5)",
                fontFamily: "'DM Sans', sans-serif",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
              }}>{conv.title || "New conversation"}</span>
            </button>
          ))}
        </div>

        {/* Persona picker */}
        <div style={{ padding: "10px 14px 18px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginBottom: 8, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>Mode</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {PERSONAS.map(p => (
              <button key={p.id} onClick={() => onPersonaChange(p.id)} style={{
                padding: "7px 8px",
                background: persona.id === p.id ? p.bg : "rgba(255,255,255,0.03)",
                border: persona.id === p.id ? `1px solid ${p.color}45` : "1px solid rgba(255,255,255,0.07)",
                borderRadius: 8, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 12, color: p.color }}>{p.icon}</span>
                <span style={{ fontSize: 12, color: persona.id === p.id ? "#fff" : "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

export default function AiChat() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [personaId, setPersonaId] = useState("default");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const streamRef = useRef("");
  const isMobile = useIsMobile();

  const persona = PERSONAS.find(p => p.id === personaId);
  const activeConv = conversations.find(c => c.id === activeId);
  const messages = activeConv?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 140) + "px";
    }
  }, [input]);

  const newConversation = useCallback(() => {
    const id = Date.now().toString();
    setConversations(prev => [{ id, title: "", messages: [] }, ...prev]);
    setActiveId(id);
    setError(null);
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  useEffect(() => { newConversation(); }, []);

  const updateConv = (id, fn) => setConversations(prev => prev.map(c => c.id === id ? fn(c) : c));

  const sendMessage = async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;
    setInput("");
    setError(null);

    let convId = activeId;
    if (!convId) {
      const id = Date.now().toString();
      setConversations(prev => [{ id, title: "", messages: [] }, ...prev]);
      setActiveId(id);
      convId = id;
    }

    const userMsg = { role: "user", content, ts: Date.now() };
    updateConv(convId, c => ({
      ...c,
      title: c.title || content.slice(0, 40) + (content.length > 40 ? "…" : ""),
      messages: [...c.messages, userMsg],
    }));

    setLoading(true);
    streamRef.current = "";

    const currentMessages = conversations.find(c => c.id === convId)?.messages || [];
    const history = [...currentMessages, userMsg].map(m => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1000,
          stream: true,
          messages: [
            { role: "system", content: SYSTEM_PROMPTS[personaId] || SYSTEM_PROMPTS.default },
            ...history,
          ],
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || `API error ${response.status}`);
      }

      const assistantMsg = { role: "assistant", content: "", ts: Date.now() };
      updateConv(convId, c => ({ ...c, messages: [...c.messages, assistantMsg] }));

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const token = parsed.choices?.[0]?.delta?.content;
            if (token) {
              streamRef.current += token;
              const snap = streamRef.current;
              updateConv(convId, c => {
                const msgs = [...c.messages];
                msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content: snap };
                return { ...c, messages: msgs };
              });
            }
          } catch {}
        }
      }
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
      updateConv(convId, c => {
        const msgs = [...c.messages];
        if (msgs[msgs.length - 1]?.role === "assistant" && !msgs[msgs.length - 1]?.content) msgs.pop();
        return { ...c, messages: msgs };
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const isEmpty = messages.length === 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(124,111,247,0.25); border-radius: 3px; }
        textarea { resize: none; outline: none; }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 18px rgba(124,111,247,0.12); }
          50% { box-shadow: 0 0 30px rgba(124,111,247,0.25); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .send-btn:hover { transform: rotate(-45deg) scale(1.08) !important; }
        .send-btn:active { transform: rotate(-45deg) scale(0.95) !important; }
        .starter-btn:hover { background: rgba(124,111,247,0.1) !important; border-color: rgba(124,111,247,0.28) !important; color: #C4BFFF !important; }
        textarea::placeholder { color: rgba(255,255,255,0.22); }
        @media (max-width: 767px) {
          .chat-input-wrap { padding: 10px 12px 14px !important; }
          .messages-area { padding: 14px 0 8px !important; }
          .msg-inner { padding: 0 12px !important; }
          .empty-state { padding: 30px 16px !important; }
          .starter-grid { grid-template-columns: 1fr !important; max-width: 100% !important; }
        }
      `}</style>

      <div style={{
        display: "flex", height: "100dvh", width: "100vw",
        background: "#0B0919",
        fontFamily: "'DM Sans', sans-serif",
        overflow: "hidden",
        position: "relative",
      }}>
        {/* Ambient */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse 55% 45% at 75% 15%, rgba(124,111,247,0.07) 0%, transparent 65%), radial-gradient(ellipse 35% 35% at 15% 85%, rgba(167,139,250,0.05) 0%, transparent 65%)",
        }} />

        <Sidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={id => { setActiveId(id); setError(null); }}
          onNew={newConversation}
          persona={persona}
          onPersonaChange={setPersonaId}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isMobile={isMobile}
        />

        {/* Main panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative", zIndex: 1 }}>

          {/* Header */}
          <header style={{
            padding: "0 16px", height: 54,
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(11,9,25,0.85)", backdropFilter: "blur(14px)",
            flexShrink: 0,
          }}>
            <button onClick={() => setSidebarOpen(s => !s)} style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8, color: "rgba(255,255,255,0.5)",
              cursor: "pointer", fontSize: 16, padding: "5px 9px",
              display: "flex", alignItems: "center", transition: "all 0.15s",
              flexShrink: 0,
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.09)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            >☰</button>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: 13, color: "rgba(255,255,255,0.5)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                fontFamily: "'DM Sans', sans-serif",
              }}>{activeConv?.title || "New conversation"}</p>
            </div>

            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              background: persona.bg,
              border: `1px solid ${persona.color}35`,
              borderRadius: 8, padding: "4px 10px", flexShrink: 0,
            }}>
              <span style={{ fontSize: 11, color: persona.color }}>{persona.icon}</span>
              <span style={{ fontSize: 11.5, color: persona.color, fontFamily: "'DM Mono', monospace" }}>{persona.label}</span>
            </div>
          </header>

          {/* Messages */}
          <div className="messages-area" style={{ flex: 1, overflowY: "auto", padding: "20px 0 10px" }}>
            {isEmpty ? (
              <div className="empty-state" style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", minHeight: "100%", padding: "40px 24px",
              }}>
                <div style={{
                  width: 68, height: 68, borderRadius: "50%",
                  background: persona.bg,
                  border: `1.5px solid ${persona.color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26, marginBottom: 18,
                  animation: "glow 3.5s ease-in-out infinite",
                }}>{persona.icon}</div>

                <h2 style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 700,
                  fontSize: isMobile ? 20 : 23, color: "#EEE9FF",
                  marginBottom: 6, letterSpacing: "-0.04em", textAlign: "center",
                  animation: "fadeUp 0.4s ease both",
                }}>What can I help you with?</h2>

                <p style={{
                  fontSize: 13.5, color: "rgba(255,255,255,0.35)", marginBottom: 28,
                  textAlign: "center", maxWidth: 320, lineHeight: 1.65,
                  fontStyle: "italic",
                  animation: "fadeUp 0.45s 0.05s ease both",
                }}>
                  {personaId === "coder" && "Ask me to write, debug, or explain code."}
                  {personaId === "writer" && "Let me help craft something worth reading."}
                  {personaId === "analyst" && "Share a problem — I'll break it down."}
                  {personaId === "default" && "Ask me anything, big or small."}
                </p>

                <div className="starter-grid" style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr",
                  gap: 8, maxWidth: 440, width: "100%",
                  animation: "fadeUp 0.5s 0.1s ease both",
                }}>
                  {STARTERS.map((s, i) => (
                    <button key={i} className="starter-btn" onClick={() => sendMessage(s.text)} style={{
                      padding: "10px 13px", textAlign: "left",
                      background: "rgba(255,255,255,0.035)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 11, cursor: "pointer",
                      fontSize: 13, color: "rgba(255,255,255,0.55)",
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "all 0.18s", lineHeight: 1.45,
                      display: "flex", alignItems: "flex-start", gap: 7,
                    }}>
                      <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{s.icon}</span>
                      <span>{s.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="msg-inner" style={{ maxWidth: 720, margin: "0 auto", padding: "0 18px" }}>
                {messages.map((msg, i) => (
                  <MessageBubble key={i} msg={msg} persona={persona} />
                ))}

                {loading && messages[messages.length - 1]?.role === "user" && (
                  <div style={{
                    display: "flex", gap: 10, alignItems: "flex-end",
                    padding: "4px 0", animation: "msgIn 0.2s ease both",
                  }}>
                    <Avatar persona={persona} size={32} />
                    <div style={{
                      background: "rgba(255,255,255,0.055)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      borderRadius: "5px 20px 20px 20px",
                      padding: "10px 14px",
                    }}>
                      <TypingDots color={persona.color} />
                    </div>
                  </div>
                )}

                {error && (
                  <div style={{
                    margin: "10px 0", padding: "10px 14px",
                    background: "rgba(242,109,109,0.08)",
                    border: "1px solid rgba(242,109,109,0.2)",
                    borderRadius: 10, color: "#F26D6D",
                    fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                    animation: "msgIn 0.2s ease both",
                  }}>⚠ {error}</div>
                )}
                <div ref={messagesEndRef} style={{ height: 32 }} />
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="chat-input-wrap" style={{
            padding: "10px 16px 14px",
            background: "rgba(11,9,25,0.9)",
            backdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            flexShrink: 0,
          }}>
            <div style={{
              maxWidth: 720, margin: "0 auto",
              background: "rgba(255,255,255,0.045)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              display: "flex", alignItems: "flex-end", gap: 6,
              padding: "8px 8px 8px 14px",
              transition: "border-color 0.2s",
            }}
              onFocusCapture={e => e.currentTarget.style.borderColor = "rgba(124,111,247,0.4)"}
              onBlurCapture={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={isMobile ? "Message Aura…" : "Message Aura… (Enter to send, Shift+Enter for newline)"}
                rows={1}
                disabled={loading}
                style={{
                  flex: 1, background: "transparent", border: "none",
                  color: "#DDD8FF", fontSize: 14.5, lineHeight: 1.6,
                  fontFamily: "'DM Sans', sans-serif",
                  minHeight: 26, maxHeight: 140,
                  paddingTop: 3,
                }}
              />
              <button
                className="send-btn"
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: input.trim() && !loading
                    ? "linear-gradient(135deg, #7C6FF7, #A78BFA)"
                    : "rgba(255,255,255,0.05)",
                  border: "none",
                  cursor: input.trim() && !loading ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15,
                  color: input.trim() && !loading ? "#fff" : "rgba(255,255,255,0.18)",
                  transition: "all 0.2s",
                  transform: "rotate(-45deg)",
                }}
              >➤</button>
            </div>

            <p style={{
              textAlign: "center", fontSize: 11,
              color: "rgba(255,255,255,0.15)",
              marginTop: 7, fontFamily: "'DM Sans', sans-serif",
            }}>
              Aura can make mistakes. Verify important info.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}