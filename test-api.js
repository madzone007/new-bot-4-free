const MAGMANODE_API_KEY = 'ptic_QuuKCOMiQrrab70qm2kTOpG91BpQXfN2SKmZB1FjLcT';
const SERVER_ID = '1f6ba1b7';

async function testPowerEndpoint() {
  console.log('🔍 Testing Power Commands...\n');
  
  const powerEndpoint = `https://panel.magmanode.com/api/client/servers/${SERVER_ID}/power`;
  
  try {
    console.log(`Testing power endpoint: ${powerEndpoint}`);
    
    // Try a POST request to start the server
    console.log('🚀 Attempting to START server...');
    const startResponse = await fetch(powerEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAGMANODE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        signal: 'start'
      })
    });
    
    console.log(`POST Status: ${startResponse.status} ${startResponse.statusText}`);
    
    if (startResponse.ok) {
      console.log('✅ Server start command sent successfully!');
      console.log('Your server should be starting now!');
    } else {
      const error = await startResponse.text();
      console.log('❌ Failed to start server:', error);
      
      // Try other signals
      const signals = ['restart', 'kill', 'stop'];
      for (const signal of signals) {
        console.log(`\nTrying signal: ${signal}`);
        const response = await fetch(powerEndpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${MAGMANODE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ signal })
        });
        console.log(`${signal} Status: ${response.status}`);
      }
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

testPowerEndpoint();
