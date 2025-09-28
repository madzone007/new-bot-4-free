// test-new-key-simple.js
const MAGMANODE_API_KEY = 'ptic_QuuKCOMiQrrab70qm2kTOpG91BpQXfN2SKmZB1FjLcT';
const SERVER_ID = '87582fcf';

async function testConnection() {
  console.log('🔍 Testing if we can access ANY server info...\n');
  
  // First, try to list all servers (if possible)
  try {
    console.log('1. Testing general API access...');
    const serversResponse = await fetch('https://panel.magmanode.com/api/client', {
      headers: {
        'Authorization': `Bearer ${MAGMANODE_API_KEY}`,
        'Accept': 'application/json',
      }
    });
    console.log(`General API Status: ${serversResponse.status}`);
    
    if (serversResponse.ok) {
      const data = await serversResponse.json();
      console.log('✅ Can access API! Available servers:', data);
    }
  } catch (error) {
    console.log('❌ Cannot access general API');
  }

  // Try the specific server with different endpoints
  console.log('\n2. Testing specific server endpoints...');
  const endpoints = [
    '/',
    '/resources', 
    '/websocket'
  ];

  for (const endpoint of endpoints) {
    try {
      const url = `https://panel.magmanode.com/api/client/servers/${SERVER_ID}${endpoint}`;
      console.log(`Testing: ${endpoint}`);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${MAGMANODE_API_KEY}`,
          'Accept': 'application/json',
        }
      });
      
      console.log(`Status: ${response.status}`);
      
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }
}

testConnection();
