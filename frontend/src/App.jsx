import './App.css';
import { useMemo, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MyContext } from './MyContext.jsx';
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';
import Login from './SignIn.jsx';
import Signup from './SignUp.jsx';

function ChatApp() {
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv4());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const providerValues = useMemo(() => ({
    prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId,
    newChat, setNewChat, prevChats, setPrevChats, allThreads, setAllThreads,
    sidebarOpen, setSidebarOpen,
  }), [prompt, reply, currThreadId, newChat, prevChats, allThreads, sidebarOpen]);

  return (
    <MyContext.Provider value={providerValues}>
      <div className="app-shell">
        <Sidebar />
        <ChatWindow />
      </div>
    </MyContext.Provider>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatApp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}
