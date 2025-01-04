import { useEffect, useState } from 'react';
import { getDatabase, ref, push, set, remove, onChildAdded } from "firebase/database";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import './App.css';

function App() {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const googleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setUser({ name: user.displayName, email: user.email });
      }).catch((error) => {
        console.error(error);
      });
  };

  const [user, setUser] = useState('');
  const [chats, setChats] = useState([]);
  const [msg, setMsg] = useState('');
  const [newUsername, setNewUsername] = useState('');

  const db = getDatabase(); 
  const chatListRef = ref(db, 'chats');

  const updateHeight = () => {
    const el = document.getElementById('chat');
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };

  useEffect(() => {
    const unsubscribe = onChildAdded(chatListRef, (data) => {
      setChats(chats => [...chats, { id: data.key, ...data.val() }]);
      setTimeout(() => {
        updateHeight();
      }, 100);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const sendChat = () => {
    const chatRef = push(chatListRef);
    set(chatRef, {
      user,
      message: msg
    });
    setMsg('');
  };

  const deleteChat = (chatId) => {
    const chatRef = ref(db, `chats/${chatId}`);
    remove(chatRef)
      .then(() => {
        setChats(chats.filter(chat => chat.id !== chatId));
      })
      .catch((error) => {
        console.error("Error removing chat: ", error);
      });
  };

  const updateUsername = () => {
    setUser(prev => ({ ...prev, name: newUsername }));
  };

  return (
    <div>
      {!user.email ? (
        <div>
          <button onClick={googleLogin}>Google SignIn</button>
        </div>
      ) : (
        <div>
          <h3>User: {user.name}</h3>
          <div>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter new username"
            />
            <button onClick={updateUsername}>Update Username</button>
          </div>
          <div id="chat" className="chat-container">
            {chats.map((c, i) => (
              <div key={i} className={`container ${c.user.email === user.email ? 'me' : ''}`}>
                <div className="chatbox-container">
                  <p className="chatbox">
                    <strong>{c.user.name}: </strong>
                    <span>{c.message}</span>
                  </p>
                  {c.user.email === user.email && (
                    <button onClick={() => deleteChat(c.id)}>🗑️</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="btm">
            <input
              type="text"
              onInput={(e) => setMsg(e.target.value)}
              value={msg}
              placeholder="Enter your chat"
            />
            <button onClick={sendChat}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
