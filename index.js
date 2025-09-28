const mineflayer = require('mineflayer');
const MAGMANODE_API_KEY = 'ptlc_qVJhkD9kXZBh1jsac3svAV1GBeGkKag9ebFwACgkdAQ';
const SERVER_ID = '1f6ba1b7';

let bot = null;
let serverOfflineSince = null;

async function restartServer() {
  try {
    console.log('🔄 Attempting to restart Minecraft server...');
    
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
      console.log('✅ Server restart command sent successfully!');
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
  console.log('Connecting to Minecraft server...');
  
  bot = mineflayer.createBot({
    host: 'gold.magmanode.com',
    port: 30265,
    username: 'MadAFKBot', // ← Change to any name you want!
  });

  bot.on('spawn', () => {
    console.log('✅ Bot successfully joined the server!');
    serverOfflineSince = null;
    startAntiAFK(bot);
  });

  bot.on('end', async (reason) => {
    console.log(`🔌 Bot disconnected: ${reason}`);
    
    const now = Date.now();
    if (!serverOfflineSince) {
      serverOfflineSince = now;
    }

    // If server has been offline for 3+ minutes, restart it
    if (serverOfflineSince && (now - serverOfflineSince) > 3 * 60 * 1000) {
      console.log('🚨 Server appears to be crashed! Attempting restart...');
      const restartSuccess = await restartServer();
      
      if (restartSuccess) {
        console.log('🕒 Waiting 2 minutes for server to restart...');
        setTimeout(createBot, 120000);
      }
    } else {
      // Normal reconnection attempt
      console.log('🔄 Reconnecting in 30 seconds...');
      setTimeout(createBot, 30000);
    }
  });

  bot.on('error', (err) => {
    console.log('❌ Connection error:', err.message);
  });
}

function startAntiAFK(bot) {
  setInterval(() => {
    // Anti-AFK: Random actions
    const actions = ['jump', 'move', 'look'];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    switch(action) {
      case 'jump':
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 1000);
        console.log('🤖 Anti-AFK: Jumping');
        break;
      case 'move':
        bot.setControlState('forward', true);
        setTimeout(() => bot.setControlState('forward', false), 2000);
        console.log('🤖 Anti-AFK: Moving forward');
        break;
      case 'look':
        bot.look(Math.random() * Math.PI, Math.random() * Math.PI);
        console.log('🤖 Anti-AFK: Looking around');
        break;
    }
  }, 120000 + Math.random() * 60000); // Every 2-3 minutes
}

createBot();
