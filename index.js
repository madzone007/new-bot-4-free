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
        signal: 'restart'
      })
    });

    if (response.status === 204) {
      console.log('✅ Server restart command accepted!');
      console.log('⏰ Server will take 1-3 minutes to start...');
      return true;
    } else {
      console.log('❌ Failed to restart server:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Error restarting server:', error.message);
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
    username: 'MadAFKBot',
  });

  bot.on('spawn', () => {
    console.log('🎉 SUCCESS! Bot joined the server!');
    connectionAttempts = 0;
    serverRestarting = false;
    startAntiAFK(bot);
  });

  bot.on('end', async (reason) => {
    console.log(`🔌 Disconnected: ${reason}`);
    
    // If we've tried many times and server seems dead, restart it
    if (connectionAttempts >= 3 && !serverRestarting) {
      console.log('🚨 Server seems dead after multiple attempts. Restarting...');
      serverRestarting = true;
      const restartSuccess = await restartServer();
      
      if (restartSuccess) {
        console.log('💤 Waiting 3 minutes for server to fully start...');
        connectionAttempts = 0;
        setTimeout(() => {
          serverRestarting = false;
          createBot();
        }, 180000); // Wait 3 minutes
      }
    } else if (!serverRestarting) {
      // Normal reconnection
      console.log('🔄 Reconnecting in 30 seconds...');
      setTimeout(createBot, 30000);
    }
  });

  bot.on('error', (err) => {
    console.log('❌ Connection error:', err.message);
  });
}

function startAntiAFK(bot) {
  console.log('🤖 Anti-AFK system activated!');
  setInterval(() => {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 1000);
    console.log('🤖 Anti-AFK: Jumped');
  }, 120000); // Every 2 minutes
}

// Start the bot
createBot();
