import './Sidebar.css';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaRegCommentDots, FaTrashAlt, FaBars, FaTimes, FaRegImages, FaGem, FaSun, FaMoon, FaUserCircle, FaSignOutAlt, FaRobot } from 'react-icons/fa';
import { MyContext } from './MyContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function Sidebar() {
  const {
    allThreads, setAllThreads, setPrompt, setReply, currThreadId,
    setCurrThreadId, setNewChat, setPrevChats, sidebarOpen, setSidebarOpen,
  } = useContext(MyContext);
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const getAllThreads = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/thread`);
      if (!response.ok) return;
      const data = await response.json();
      setAllThreads(Array.isArray(data) ? data.map(({ threadId, title, updatedAt }) => ({ threadId, title, updatedAt })) : []);
    } catch (error) {
      console.error('Unable to load chat history:', error);
    }
  }, [setAllThreads]);

  useEffect(() => { getAllThreads(); }, [getAllThreads]);
  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  const filteredThreads = useMemo(() => allThreads.filter((thread) =>
    (thread.title || 'New conversation').toLowerCase().includes(search.toLowerCase())
  ), [allThreads, search]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt('');
    setReply(null);
    setCurrThreadId(crypto.randomUUID());
    setPrevChats([]);
    setSidebarOpen(false);
  };

  const changeThread = async (threadId) => {
    setCurrThreadId(threadId);
    try {
      const response = await fetch(`${API_URL}/api/thread/${threadId}`);
      if (!response.ok) throw new Error('Could not load this conversation.');
      const messages = await response.json();
      setPrevChats(Array.isArray(messages) ? messages : []);
      setNewChat(false);
      setReply(null);
      setSidebarOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteThread = async (event, threadId) => {
    event.stopPropagation();
    try {
      const response = await fetch(`${API_URL}/api/thread/${threadId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Unable to delete conversation.');
      setAllThreads((threads) => threads.filter((thread) => thread.threadId !== threadId));
      if (threadId === currThreadId) createNewChat();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {sidebarOpen && <button className="sidebar-scrim" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-top">
          <div className="brand-row">
            <div className="brand-mark"><FaRobot /></div>
            <div className="brand-copy"><strong>MicroGPT</strong><span>AI Assistant</span></div>
            <button className="icon-button mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"><FaTimes /></button>
          </div>

          <button className="new-chat-button" onClick={createNewChat}>
            <FaPlus /><span>New Chat</span>
          </button>

          <label className="history-search">
            <FaSearch />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search conversations..." />
            {search && <button onClick={() => setSearch('')} aria-label="Clear search"><FaTimes /></button>}
          </label>

          <div className="history-heading"><span>Recent chats</span><span className="history-count">{filteredThreads.length}</span></div>
          <div className="history-list">
            {filteredThreads.length ? filteredThreads.map((thread) => (
              <button className={`history-item ${thread.threadId === currThreadId ? 'history-item--active' : ''}`} key={thread.threadId} onClick={() => changeThread(thread.threadId)}>
                <FaRegCommentDots className="history-icon" />
                <span className="history-title">{thread.title || 'New conversation'}</span>
                <span className="history-actions" onClick={(event) => deleteThread(event, thread.threadId)} role="button" tabIndex={0} aria-label="Delete conversation"><FaTrashAlt /></span>
              </button>
            )) : <div className="empty-history">{search ? 'No matching conversations' : 'Your conversations will appear here.'}</div>}
          </div>
        </div>

        <div className="sidebar-bottom">
          <button className="sidebar-feature" onClick={() => window.open('https://openai.com/', '_blank', 'noopener,noreferrer')}>
            <span className="feature-icon feature-icon--pink"><FaRegImages /></span><span><strong>Explore AI</strong><small>Discover what you can create</small></span>
          </button>
          <div className="credits-card"><span className="feature-icon feature-icon--gold"><FaGem /></span><span><strong>AI workspace</strong><small>Ready for your next idea</small></span><span className="credits-spark">✦</span></div>
          <button className="theme-row" onClick={() => setDarkMode((value) => !value)}>
            <span className="theme-icon">{darkMode ? <FaMoon /> : <FaSun />}</span>
            <span><strong>Theme</strong><small>{darkMode ? 'Dark mode' : 'Light mode'}</small></span>
            <span className={`theme-switch ${darkMode ? 'theme-switch--on' : ''}`}><i /></span>
          </button>
          <div className="account-wrap">
            <button className="account-row" onClick={() => setProfileOpen((value) => !value)}>
              <span className="account-avatar"><FaUserCircle /></span>
              <span className="account-copy"><strong>{token ? 'My account' : 'Guest user'}</strong><small>{token ? 'Signed in' : 'Sign in to save chats'}</small></span>
              <span className="account-more">•••</span>
            </button>
            {profileOpen && <div className="profile-menu">
              {token ? <button onClick={() => { localStorage.removeItem('token'); setProfileOpen(false); navigate('/login'); }}><FaSignOutAlt /> Sign out</button> : <><button onClick={() => navigate('/login')}>Sign in</button><button onClick={() => navigate('/signup')}>Create account</button></>}
            </div>}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
