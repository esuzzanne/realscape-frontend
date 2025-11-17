import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [xp, setXp] = useState(0);
  const [playerName, setPlayerName] = useState('Hero');
  const [questLog, setQuestLog] = useState([]);

useEffect(() => {
  const loadPlayer = async () => {
    try {
      const res = await axios.get('https://realscape-brain.vercel.app/get-player');
      setPlayerName(res.data.name || 'Hero');
      setXp(res.data.xp || 0);
    } catch (err) {
      console.log('No player yet');
    }
  };

  const loadQuestLog = async () => {
    try {
      const res = await axios.get('https://realscape-brain.vercel.app/get-quest-log');
      setQuestLog(res.data);
    } catch (err) {
      console.log('Quest log error');
    }
  };

  loadPlayer();
  loadQuestLog();  // ← Now inside useEffect!
}, []);

// Fixed updateName — reloads player data after saving name
const updateName = async (newName) => {
  setPlayerName(newName);
  try {
    await axios.post('https://realscape-brain.vercel.app/update-name', { name: newName });
    // RELOAD FRESH DATA FROM BRAIN
    const res = await axios.get('https://realscape-brain.vercel.app/get-player');
    setPlayerName(res.data.name || 'Hero');
  } catch (err) {
    console.error('Name save failed', err);
  }
};



const completeQuest = async (amount, questName) => {
  try {
    // 1. Add XP on the brain
    await axios.get('https://realscape-brain.vercel.app/add-xp?amount=' + amount);
    
    // 2. Log the quest
    await axios.post('https://realscape-brain.vercel.app/log-quest', { 
      questName, 
      xp: amount 
    });

    // 3. RELOAD PLAYER DATA FROM DATABASE (THIS IS THE MISSING PIECE!)
    const playerRes = await axios.get('https://realscape-brain.vercel.app/get-player');
    setXp(playerRes.data.xp);
    setPlayerName(playerRes.data.name || 'Hero');

    // 4. Reload quest log
    const logRes = await axios.get('https://realscape-brain.vercel.app/get-quest-log');
    setQuestLog(logRes.data);

    alert(`✅ ${questName} Complete! +${amount} XP → ${playerRes.data.name} now has ${playerRes.data.xp} XP`);
  } catch (err) {
    console.error(err);
    alert('⚠️ Something went wrong — but brain is online!');
  }
};








  const updateName = async (newName) => {
    setPlayerName(newName);
    try {
      await axios.post('https://realscape-brain.vercel.app/update-name', { name: newName });
    } catch (err) {
      console.error('Name save failed', err);
    }
  };





    return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b0f 100%)',
      color: '#e6d7b3',
      fontFamily: '"Cinzel", "Georgia", serif',
      textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
      padding: '20px'
    }}>
      {/* PARCHMENT HEADER */}
      <div style={{
        background: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%25%27 height=%27100%25%27%3E%3Crect width=%27100%25%27 height=%27100%25%27 fill=%27%23f4e4bc%27/%3E%3C/svg%3E")',
        backgroundSize: 'cover',
        padding: '30px',
        border: '8px solid #8b5a2b',
        borderImage: 'linear-gradient(to bottom, #a67c52, #5c4033) 1',
        borderRadius: '15px',
        margin: '20px auto',
        maxWidth: '800px',
        boxShadow: '0 0 30px rgba(139, 90, 43, 0.5)'
      }}>
        <h1 style={{
          fontSize: '56px',
          margin: 0,
          color: '#d4af37',
          textAlign: 'center',
          fontWeight: 'bold',
          letterSpacing: '3px'
        }}>
          🏰 RealScape
        </h1>

        {/* NAME INPUT - INK & QUILL */}
        <div style={{ textAlign: 'center', margin: '25px 0' }}>
          <input
            type="text"
            value={playerName}
            onChange={(e) => updateName(e.target.value)}
            placeholder="Thy hero's name..."
            style={{
              padding: '12px 20px',
              fontSize: '20px',
              background: '#fdf6e3',
              color: '#3e2723',
              border: '3px solid #8b5a2b',
              borderRadius: '8px',
              width: '300px',
              fontFamily: 'inherit',
              textAlign: 'center'
            }}
          />
        </div>

        {/* LEVEL & XP - STONE TABLET */}
        <div style={{
          background: '#2b2b2b',
          padding: '20px',
          borderRadius: '12px',
          border: '4px solid #555',
          margin: '20px 0',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: xp >= 100 ? '#ff6b35' : '#e6d7b3'
          }}>
            ⚔️ {playerName || 'Hero'} - Level {xp >= 100 ? '2' : '1'} {xp >= 100 && '🔥'}
          </div>
          <div style={{
            background: '#444',
            padding: '12px',
            borderRadius: '8px',
            margin: '10px 0',
            fontWeight: 'bold',
            fontSize: '24px',
            color: '#ffd700'
          }}>
            XP: {xp} / 100
          </div>
        </div>

        {/* LEVEL UP BANNER */}
        {xp >= 100 && (
          <div style={{
            background: 'linear-gradient(90deg, #8b0000, #b22222)',
            color: '#ffd700',
            padding: '20px',
            borderRadius: '12px',
            margin: '20px 0',
            fontSize: '28px',
            fontWeight: 'bold',
            border: '3px solid #ffd700',
            animation: 'pulse 2s infinite'
          }}>
            ⚡ LEVEL 2 UNLOCKED! 🪓 CARPENTRY AWAITS!
          </div>
        )}
      </div>

      {/* QUEST BOARD - WOODEN SIGN */}
      <div style={{
        background: '#3e2723',
        padding: '25px',
        borderRadius: '15px',
        margin: '30px auto',
        maxWidth: '800px',
        border: '6px solid #8b5a2b',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{ color: '#ff6b35', textAlign: 'center', margin: '0 0 20px', fontSize: '36px' }}>
          📜 Real-Life Quests
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <button onClick={() => completeQuest(50, 'Clean Room')}
            style={{ padding: '18px 35px', fontSize: '22px', background: '#5d4037', color: '#d7ccc8', border: '3px solid #3e2723', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
            🧹 Clean Room (+50 XP)
          </button>
          <button onClick={() => completeQuest(20, 'Drink Water')}
            style={{ padding: '18px 35px', fontSize: '22px', background: '#1a237e', color: '#c5cae9', border: '3px solid #3e2723', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
            💧 Drink Water (+20 XP)
          </button>
          <button onClick={() => completeQuest(30, 'Make Sandwich')}
            style={{ padding: '18px 35px', fontSize: '22px', background: '#3e2723', color: '#ffcc80', border: '3px solid #5d4037', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
            🥪 Make Sandwich (+30 XP)
          </button>
        </div>
      </div>

      {/* QUEST LOG - ANCIENT TOME */}
      <div style={{
        background: '#212121',
        padding: '25px',
        borderRadius: '15px',
        margin: '30px auto',
        maxWidth: '800px',
        border: '5px solid #444',
        boxShadow: '0 0 25px rgba(255, 107, 53, 0.3)'
      }}>
        <h3 style={{ color: '#ff6b35', textAlign: 'center', margin: '0 0 15px', fontSize: '28px' }}>
          📖 Quest Log
        </h3>
        {questLog.length === 0 ? (
          <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#999' }}>No deeds recorded yet, traveler...</p>
        ) : (
          <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, maxHeight: '300px', overflowY: 'auto' }}>
            {questLog.map((q, i) => (
              <li key={i} style={{
                background: '#2b2b2b',
                margin: '8px 0',
                padding: '12px',
                borderRadius: '8px',
                borderLeft: '4px solid #ff6b35',
                color: '#e6d7b3'
              }}>
                ✅ <strong>{q.name}</strong> (+{q.xp} XP) — <em>{new Date(q.timestamp).toLocaleString()}</em>
              </li>
            ))}
          </ul>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 20px #ffd700; }
          50% { box-shadow: 0 0 40px #ff6b35; }
          100% { box-shadow: 0 0 20px #ffd700; }
        }
      `}</style>
    </div>
  );



}







export default App;