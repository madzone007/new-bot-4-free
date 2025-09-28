// 1. KEEP-AWAKE WEBSERVER - This must create a server on port 3000
require("./keep_alive");

// 2. LOAD MINEFLATER LIBRARY
const mineflayer = require("mineflayer");

// 3. YOUR JAVA SERVER DETAILS
const botOptions = {
  host: "gold.magmanode.com",
  port: 30265,
  username: "madbot",
  auth: "offline",
};

// 4. CREATE THE BOT
console.log(
  "Connecting to Java server at " + botOptions.host + ":" + botOptions.port,
);
const bot = mineflayer.createBot(botOptions);

// Anti-AFK variables
let afkInterval;
let isSneaking = false;

// Anti-AFK function
function startAntiAFK() {
  console.log("Starting anti-AFK system...");

  afkInterval = setInterval(
    () => {
      if (!bot.player) return;

      // Random action selection
      const action = Math.floor(Math.random() * 3);

      switch (action) {
        case 0:
          // Jump
          console.log("Anti-AFK: Jumping");
          bot.setControlState("jump", true);
          setTimeout(() => {
            bot.setControlState("jump", false);
          }, 500);
          break;

        case 1:
          // Sneak toggle
          console.log("Anti-AFK: Toggling sneak");
          isSneaking = !isSneaking;
          bot.setControlState("sneak", isSneaking);
          // Auto-unsneak after 2-4 seconds
          setTimeout(
            () => {
              if (isSneaking) {
                bot.setControlState("sneak", false);
                isSneaking = false;
              }
            },
            2000 + Math.random() * 2000,
          );
          break;

        case 2:
          // Look around randomly
          console.log("Anti-AFK: Looking around");
          const yaw = Math.random() * Math.PI * 2;
          const pitch = Math.random() * Math.PI - Math.PI / 2;
          bot.look(yaw, pitch, false);
          break;
      }
    },
    8000 + Math.random() * 7000,
  ); // Random interval between 8-15 seconds
}

// Stop anti-AFK function
function stopAntiAFK() {
  if (afkInterval) {
    clearInterval(afkInterval);
    console.log("Anti-AFK system stopped");
  }
  // Make sure we're not stuck sneaking
  bot.setControlState("sneak", false);
  isSneaking = false;
}

// 5. ENHANCED EVENT HANDLING
bot.on("login", () => {
  console.log("Login successful! Server accepted our connection.");
});

bot.on("spawn", () => {
  console.log("Bot spawned in the world! It should be visible now.");
  bot.chat("Hello everyone! I am a bot from Replit with anti-AFK!");

  // Start anti-AFK after a short delay
  setTimeout(() => {
    startAntiAFK();
  }, 3000);
});

bot.on("spawnReset", () => {
  console.log("Bot got stuck and is being respawned...");
  stopAntiAFK();
});

// 6. ERROR HANDLING
bot.on("error", (err) => {
  console.log("Error:", err.message);
  stopAntiAFK();
});

bot.on("end", (reason) => {
  console.log("Disconnected from server. Reason:", reason);
  stopAntiAFK();

  // Optional: Add logic to automatically reconnect after a delay
  console.log("Attempting to reconnect in 5 seconds...");
  setTimeout(() => {
    console.log("Reconnecting...");
    mineflayer.createBot(botOptions);
  }, 5000);
});

// 7. DEBUGGING
bot.on("message", (message) => {
  console.log("Server message:", message.toString());
});

// Handle process exit to clean up
process.on("SIGINT", () => {
  console.log("Shutting down bot...");
  stopAntiAFK();
  bot.quit();
  process.exit();
});

// Check if bot is actually connected
setTimeout(() => {
  if (bot.player) {
    console.log("Bot entity exists at position:", bot.player.position);
  } else {
    console.log("Bot entity does not exist yet...");
  }
}, 5000);
