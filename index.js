const mineflayer = require('mineflayer');
const MAGMANODE_API_KEY = 'ptlc_IDuqtjbQoir6bP9NJWXoNcOjX77YkRUz6zVYFPfzpqy';
const SERVER_ID = '87582fcf';

let bot = null;
let serverRestarting = false;
let connectionAttempts = 0;
let antiAFKInterval = null;

async function restartServer() {
  try {
    console.log('🔄 Sending START command to MagmaNode...');
    
    const response = await fetch(`https://panel.magmanode.com/api/client/servers/${SERVER_ID}/power`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAGMANODE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        signal: 'start'
      })
    });

    if (response.status === 204) {
      console.log('✅ Server start command accepted!');
      console.log('⏰ Server will take 1-2 minutes to start...');
      return true;
    } else {
      console.log('❌ Failed to start server:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Error starting server:', error.message);
    return false;
  }
}

function createBot() {
  if (serverRestarting) {
    console.log('⏳ Server is still starting, waiting...');
    return;
  }
  
  connectionAttempts++;
  console.log(`🔗 Connection attempt #${connectionAttempts} to server...`);
  
  bot = mineflayer.createBot({
    host: 'gold.magmanode.com',
    port: 30265,
    username: 'KeepAliveBot',
  });

  bot.on('spawn', () => {
    console.log('🎉 SUCCESS! Bot joined the server!');
    console.log('🤖 Bot will keep server active 24/7');
    connectionAttempts = 0;
    serverRestarting = false;
    startAntiAFK();
  });

  bot.on('end', async (reason) => {
    console.log(`🔌 Disconnected: ${reason}`);
    stopAntiAFK();
    
    if (connectionAttempts >= 2 && !serverRestarting) {
      console.log('🚨 Server seems dead. Starting it...');
      serverRestarting = true;
      const startSuccess = await restartServer();
      
      if (startSuccess) {
        console.log('💤 Waiting 2 minutes for server to start...');
        connectionAttempts = 0;
        setTimeout(() => {
          serverRestarting = false;
          createBot();
        }, 120000);
      }
    } else if (!serverRestarting) {
      console.log('🔄 Reconnecting in 20 seconds...');
      setTimeout(createBot, 20000);
    }
  });

  bot.on('error', (err) => {
    console.log('❌ Connection error:', err.message);
  });
}

function startAntiAFK() {
  console.log('🤖 Anti-AFK system activated!');
  
  // Clear any existing interval
  if (antiAFKInterval) {
    clearInterval(antiAFKInterval);
  }
  
  antiAFKInterval = setInterval(() => {
    const actions = [
      () => { 
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 1000);
        console.log('🤖 Anti-AFK: Jumped');
      },
      () => {
        bot.look(Math.random() * Math.PI - 0.5, Math.random() * Math.PI - 0.5);
        console.log('🤖 Anti-AFK: Looked around');
      },
      () => {
        bot.setControlState('sneak', true);
        setTimeout(() => bot.setControlState('sneak', false), 2000);
        console.log('🤖 Anti-AFK: Sneaked');
      },
      () => {
        // Walk forward briefly
        bot.setControlState('forward', true);
        setTimeout(() => {
          bot.setControlState('forward', false);
          // Walk backward
          bot.setControlState('back', true);
          setTimeout(() => bot.setControlState('back', false), 1000);
        }, 1000);
        console.log('🤖 Anti-AFK: Walked around');
      }
    ];
    
    const action = actions[Math.floor(Math.random() * actions.length)];
    action();
  }, 45000 + Math.random() * 30000); // Every 45-75 seconds
}

function stopAntiAFK() {
  if (antiAFKInterval) {
    clearInterval(antiAFKInterval);
    antiAFKInterval = null;
    console.log('🤖 Anti-AFK stopped');
  }
}

createBot();
