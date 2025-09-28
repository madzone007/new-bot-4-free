const MAGMANODE_API_KEY = 'ptic_QuuKCOMiQrrab70qm2kTOpG91BpQXfN2SKmZB1FjLcT';
const SERVER_ID = '87582fcf';

async function testEndpoints() {
  console.log('🔍 Testing NEW API Key...\n');
  
  const endpoints = [
    `https://panel.magmanode.com/api/client/servers/${SERVER_ID}`,
    `https://panel.magmanode.com/api/client/servers/${SERVER_ID}/resources`,
    `https://panel.magmanode.com/api/client/servers/${SERVER_ID}/power`,
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${MAGMANODE_API_KEY}`,
          'Accept': 'application/json',
        }
      });
      
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ SUCCESS! API is working!');
        console.log('Response data:', JSON.stringify(data, null, 2));
      } else {
        console.log('❌ Failed:', response.status);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    console.log('---\n');
  }

  // Test power command
  console.log('🚀 Testing POWER command...');
  try {
    const powerResponse = await fetch(`https://panel.magmanode.com/api/client/servers/${SERVER_ID}/power`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAGMANODE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        signal: 'start'
      })
    });
    
    console.log(`Power POST Status: ${powerResponse.status} ${powerResponse.statusText}`);
    if (powerResponse.status === 204) {
      console.log('✅ POWER command successful! Server should be starting...');
    }
  } catch (error) {
    console.log('❌ Power command error:', error.message);
  }
}

testEndpoints();
