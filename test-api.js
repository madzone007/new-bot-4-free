// test-api.js - Using built-in fetch (no install needed)
const MAGMANODE_API_KEY = 'ptlc_qVJhkD9kXZB';
const SERVER_ID = '1f6ba1b7';

async function testEndpoints() {
  console.log('🔍 Testing MagmaNode API...\n');
  
  const endpoints = [
    `https://panel.magmanode.com/api/client/servers/${SERVER_ID}`,
    `https://panel.magmanode.com/api/client/servers/${SERVER_ID}/resources`,
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
        console.log('Server data:', JSON.stringify(data, null, 2));
      } else {
        console.log('❌ Failed:', response.status);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    console.log('---\n');
  }
}

testEndpoints();
