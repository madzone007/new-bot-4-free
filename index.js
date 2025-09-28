const mineflayer = require('mineflayer');
const MAGMANODE_API_KEY = 'ptlc_qVJhkD9kXZBh1jsac3svAV1GBeGkKag9ebFwACgkdAQ';
const SERVER_ID = '1f6ba1b7';

let bot = null;
let serverRestarting = false;
let connectionAttempts = 0;

async function restartServer() {
  try {
    console.log('🔄 Sending RESTART command to MagmaNode...');
    
    const response = await fetch(`https://panel.magmanode.com/api/client/servers/${SERVER_ID}/power`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAGMANODE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        signal: 'start' // Use 'start' instead of 'restart'
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
    username: 'KeepAliveBot', // Any name for offline mode
  });

  bot.on('spawn', () => {
    console.log('🎉 SUCCESS! Bot joined the server!');
    console.log('🤖 Bot will keep server active 24/7');
    connectionAttempts = 0;
    serverRestarting = false;
    startAntiAFK(bot);
  });

  bot.on('end', async (reason) => {
    console.log(`🔌 Disconnected: ${reason}`);
    
    // If we've tried many times and server seems dead, start it
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
        }, 120000); // Wait 2 minutes
      }
    } else if (!serverRestarting) {
      // Normal reconnection
      console.log('🔄 Reconnecting in 20 seconds...');
      setTimeout(createBot, 20000);
    }
  });

  bot.on('error', (err) => {
    console.log('❌ Connection error:', err.message);
  });
}

function startAntiAFK(bot) {
  console.log('🤖 Anti-AFK system activated!');
  
  // Various anti-AFK actions to keep server active
  const actions = [
    () => { 
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 1000);
      console.log('🤖 Anti-AFK: Jumped');
    },
    () => {
      bot.look(Math.random() * Math.PI, Math.random() * Math.PI);
      console.log('🤖 Anti-AFK: Looked around');
    },
    () => {
      bot.setControlState('sneak', true);
      setTimeout(() => bot.setControlState('sneak', false), 2000);
      console.log('🤖 Anti-AFK: Sneaked');
    },
    () => {
      // Try to send a chat message (if allowed)
      try {
        bot.chat('.'); // Simple dot to show activity
        console.log('🤖 Anti-AFK: Sent chat activity');
      } catch (e) {
        console.log('🤖 Anti-AFK: Chat not available');
      }
    }
  ];
  
  // Do anti-AFK every 1-3 minutes randomly
  setInterval(() => {
    const action = actions[Math.floor(Math.random() * actions.length)];
    action();
  }, 60000 + Math.random() * 120000);
  
  // Also move around occasionally
  setInterval(() => {
    bot.setControlState('forward', true);
    setTimeout(() => {
      bot.setControlState('forward', false);
      bot.setControlState('back', true);
      setTimeout(() => bot.setControlState('back', false), 1000);
    }, 1000);
    console.log('🤖 Anti-AFK: Moved around');
  }, 180000); // Every 3 minutes
}

// Start the bot
createBot();
