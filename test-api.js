// test-api.js
const MAGMANODE_API_KEY = 'ptlc_IDuqtjbQoir6bP9NJWXoNcOjX77YkRUz6zVYFPfzpqy';
const SERVER_ID = '87582fcf';

async function testNewKey() {
  console.log('🔍 Testing NEW API Key...\n');
  
  try {
    console.log('🚀 Testing POWER command...');
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
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 204) {
      console.log('✅ SUCCESS! New API key works!');
      console.log('🎯 Server start command sent successfully!');
      console.log('⏰ Server should be starting now...');
    } else {
      console.log('❌ Failed with status:', response.status);
      const errorText = await response.text();
      console.log('Error details:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testNewKey();
