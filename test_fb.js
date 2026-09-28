const crypto = require('crypto');
async function test() {
  const metaPixelId = "4376073622648258";
  const metaAccessToken = "EAGBfC9ZAj7HQBSluVk5Yt6na2OrRZAAmBujrtVKGaxu34f7HQTL1aqQOE5Ro4CVZAOJg9PeTJrXgFXBH9XmxOypIHbf8rUWKPY6SFsDs7PTBkIG2z81C0xc92NvArN7ZA1mWrNTYNMqByrBDrkO7B7AqTl3mEqmYuOWeMZAZBedQAeYMuw4gt7P06fvcZCYvAZDZD";
  const metaPayload = {
    data: [
      {
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_id: crypto.randomUUID(),
        test_event_code: "TEST80864",
        user_data: {
          client_ip_address: '127.0.0.1',
          client_user_agent: 'NodeJS Script',
        }
      }
    ]
  };
  const res = await fetch(`https://graph.facebook.com/v19.0/${metaPixelId}/events?access_token=${metaAccessToken}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metaPayload)
  });
  console.log(await res.json());
}
test();
