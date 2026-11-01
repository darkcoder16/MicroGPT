import './Chat.css';
import { useContext, useEffect, useRef } from 'react';
import { MyContext } from './MyContext.jsx';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import { FaRobot, FaUser } from 'react-icons/fa';

function Chat({ loading }) {
  const { newChat, prevChats } = useContext(MyContext);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [prevChats, loading]);

  if (newChat && prevChats.length === 0) {
    return (
      <section className="welcome-screen">
        <div className="welcome-orb"><FaRobot /></div>
        <p className="eyebrow">YOUR AI WORKSPACE</p>
        <h1>Where ideas become <span>intelligence.</span></h1>
        <p className="welcome-description">Ask questions, explore ideas, write code, or work through something complex. Let's get started.</p>
        <div className="suggestion-grid">
          <div className="suggestion-card"><span className="suggestion-emoji">✦</span><strong>Explore an idea</strong><small>Break down a topic or concept</small></div>
          <div className="suggestion-card"><span className="suggestion-emoji">⌘</span><strong>Write some code</strong><small>Build, debug, and understand</small></div>
          <div className="suggestion-card"><span className="suggestion-emoji">↗</span><strong>Get a fresh perspective</strong><small>Brainstorm your next project</small></div>
        </div>
      </section>
    );
  }

  return (
    <section className="messages-area" aria-live="polite">
      {prevChats.map((chat, index) => (
        <article className={`message-row message-row--${chat.role}`} key={`${index}-${chat.timestamp || ''}`}>
          <div className={`message-avatar ${chat.role === 'user' ? 'message-avatar--user' : ''}`}>{chat.role === 'user' ? <FaUser /> : <FaRobot />}</div>
          <div className="message-content">
            <span className="message-author">{chat.role === 'user' ? 'You' : 'MicroGPT'}</span>
            {chat.role === 'user' ? <p className="user-message-text">{chat.content}</p> : <div className="assistant-markdown"><ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content || ''}</ReactMarkdown></div>}
          </div>
        </article>
      ))}
      {loading && <article className="message-row message-row--assistant"><div className="message-avatar"><FaRobot /></div><div className="message-content"><span className="message-author">MicroGPT</span><div className="typing-indicator"><i /><i /><i /></div></div></article>}
      <div ref={bottomRef} />
    </section>
  );
}

export default Chat;
