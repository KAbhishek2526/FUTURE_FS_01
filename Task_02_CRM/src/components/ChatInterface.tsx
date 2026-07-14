import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const STARTER_QUESTIONS = [
  'Give me a sales summary',
  'Who are my qualified leads?',
  'What is the total pipeline value?',
];

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          background: isUser ? 'var(--c-primary)' : 'var(--c-surface-2)',
          border: isUser ? 'none' : '1px solid var(--c-border)',
        }}
      >
        {isUser
          ? <User size={13} className="text-white" />
          : <Bot  size={13} style={{ color: 'var(--c-primary)' }} />}
      </div>

      {/* Bubble */}
      <div
        className="max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap"
        style={
          isUser
            ? { background: 'var(--c-primary)', color: '#fff', borderRadius: '12px 2px 12px 12px' }
            : { background: 'var(--c-surface-2)', color: 'var(--c-text)', border: '1px solid var(--c-border)', borderRadius: '2px 12px 12px 12px' }
        }
      >
        {msg.content}
      </div>
    </div>
  );
}

export default function ChatInterface() {
  const [open, setOpen]         = useState(false);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AyuraBlend CRM assistant powered by Gemini AI. Ask me anything about your leads, pipeline, or sales trends!',
    },
  ]);

  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const sendMessage = async (text?: string) => {
    const query = (text ?? input).trim();
    if (!query || loading) return;

    setInput('');
    const userMsg: Message = { role: 'user', content: query };
    const history = [...messages, userMsg];
    setMessages(history);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: history.slice(0, -1).slice(-10), // Last 10 for context
        }),
      });

      const data = await response.json();
      
      let reply;
      if (!response.ok) {
        if (response.status === 429) {
          reply = "Rate limit hit! Please wait a moment for the quota to reset.";
        } else {
          reply = data.message || `Backend error: ${response.statusText}`;
        }
      } else {
        reply = data.reply;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Could not reach the backend. Make sure the server is running on port 5001.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Floating action button ── */}
      <button
        id="open-chat"
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-13 h-13 rounded-full shadow-lg flex items-center justify-center transition-all duration-200"
        style={{
          width: '52px',
          height: '52px',
          background: 'var(--c-primary)',
          boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
        }}
        aria-label="Open AI assistant"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={20} className="text-white" />
              </motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <MessageSquare size={20} className="text-white" />
              </motion.div>}
        </AnimatePresence>
      </button>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 flex flex-col"
            style={{
              width: 'min(380px, calc(100vw - 2rem))',
              height: '520px',
              background: 'var(--c-surface)',
              border: '1px solid var(--c-border)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-2.5 px-4 py-3 flex-shrink-0"
              style={{
                borderBottom: '1px solid var(--c-border)',
                background: 'var(--c-primary)',
                borderRadius: '12px 12px 0 0',
              }}
            >
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">CRM AI Assistant</p>
                <p className="text-xs text-blue-100">Powered by Gemini · Live DB access</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="ml-auto text-white/70 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} />
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--c-surface-2)', border: '1px solid var(--c-border)' }}
                  >
                    <Bot size={13} style={{ color: 'var(--c-primary)' }} />
                  </div>
                  <div
                    className="px-3 py-2 rounded-xl flex items-center gap-1"
                    style={{ background: 'var(--c-surface-2)', border: '1px solid var(--c-border)' }}
                  >
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{ background: 'var(--c-muted)', animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Starter questions (shown when only greeting) */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {STARTER_QUESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-2.5 py-1.5 rounded-full transition-colors"
                    style={{
                      background: 'var(--c-primary-bg)',
                      color: 'var(--c-primary)',
                      border: '1px solid #BFDBFE',
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input bar */}
            <div
              className="flex gap-2 px-3 py-3 flex-shrink-0"
              style={{ borderTop: '1px solid var(--c-border)' }}
            >
              <input
                ref={inputRef}
                id="chat-input"
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about your leads…"
                className="crm-input flex-1 text-sm"
                disabled={loading}
              />
              <button
                id="chat-send"
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="crm-btn-primary"
                style={{ padding: '0.5rem 0.75rem' }}
              >
                {loading
                  ? <Loader2 size={15} className="animate-spin" />
                  : <Send size={15} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
