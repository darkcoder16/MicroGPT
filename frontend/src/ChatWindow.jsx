import { useContext, useEffect, useRef, useState } from 'react';
import './ChatWindow.css';
import Chat from './Chat.jsx';
import { MyContext } from './MyContext.jsx';
import { FaBars, FaPaperPlane, FaChevronDown, FaRegLightbulb, FaExclamationCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function ChatWindow() {
  const { prompt, setPrompt, currThreadId, setNewChat, setPrevChats, setAllThreads, setSidebarOpen } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('Text');
  const [modeOpen, setModeOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(Boolean(localStorage.getItem('token')));
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => { setIsLogin(Boolean(localStorage.getItem('token'))); }, []);

  const getReply = async () => {
    const message = prompt.trim();
    if (!message || loading) return;
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please sign in to send messages and save your conversations.');
      return;
    }

    setError('');
    setLoading(true);
    setNewChat(false);
    setPrompt('');
    setPrevChats((messages) => [...messages, { role: 'user', content: message, timestamp: new Date().toISOString() }]);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message, threadId: currThreadId }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          setIsLogin(false);
        }
        throw new Error(data.error || data.message || `Request failed (${response.status})`);
      }
      setPrevChats((messages) => [...messages, { role: 'assistant', content: data.reply, timestamp: new Date().toISOString() }]);
      const threadResponse = await fetch(`${API_URL}/api/thread`);
      if (threadResponse.ok) {
        const threads = await threadResponse.json();
        setAllThreads(Array.isArray(threads) ? threads.map(({ threadId, title, updatedAt }) => ({ threadId, title, updatedAt })) : []);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setPrevChats((messages) => messages.filter((item, index) => !(index === messages.length - 1 && item.role === 'user' && item.content === message)));
      setPrompt(message);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      getReply();
    }
  };

  return (
    <main className="chat-window">
      <header className="topbar">
        <div className="topbar-left">
          <button className="topbar-menu" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><FaBars /></button>
          <div className="model-selector"><span className="model-dot" /> <strong>MicroGPT</strong><span className="model-label">AI Assistant</span><FaChevronDown className="model-chevron" /></div>
        </div>
        <div className="topbar-right">
          <span className="status-indicator"><i /> {isLogin ? 'Workspace ready' : 'Guest mode'}</span>
          <button className="topbar-avatar" onClick={() => navigate(isLogin ? '/' : '/login')} aria-label="Account">{isLogin ? 'B' : 'G'}</button>
        </div>
      </header>

      <div className="chat-body"><Chat loading={loading} /></div>

      <footer className="composer-footer">
        {error && <div className="chat-error"><FaExclamationCircle /><span>{error}</span>{!isLogin && <button onClick={() => navigate('/login')}>Sign in</button>}</div>}
        <div className="composer-wrap">
          <div className="composer-toolbar">
            <div className="mode-wrap">
              <button className="mode-button" onClick={() => setModeOpen((value) => !value)}><span className="mode-symbol">◉</span>{mode}<FaChevronDown /></button>
              {modeOpen && <div className="mode-menu"><button onClick={() => { setMode('Text'); setModeOpen(false); }}>Text <small>Chat with MicroGPT</small></button><button onClick={() => { setMode('Text'); setModeOpen(false); }}>Code <small>Ask programming questions</small></button></div>}
            </div>
            <textarea ref={inputRef} value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={handleKeyDown} placeholder="Ask MicroGPT anything..." rows={1} aria-label="Message MicroGPT" />
            <button className="send-button" onClick={getReply} disabled={!prompt.trim() || loading} aria-label="Send message">{loading ? <span className="send-spinner" /> : <FaPaperPlane />}</button>
          </div>
        </div>
        <div className="composer-note"><FaRegLightbulb /> MicroGPT can make mistakes. Check important information.</div>
      </footer>
    </main>
  );
}

export default ChatWindow;
