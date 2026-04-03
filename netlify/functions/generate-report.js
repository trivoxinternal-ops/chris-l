const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  console.log('Function started, calling Anthropic...');

  try {
    const { system, messages } = JSON.parse(event.body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system,
        messages
      })
    });

    console.log('Anthropic response status:', response.status);

    const data = await response.json();

    if (!response.ok) {
      console.log('Anthropic error:', JSON.stringify(data));
      return { statusCode: response.status, body: JSON.stringify(data) };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.log('Function error:', err.message);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

module.exports = { handler };
