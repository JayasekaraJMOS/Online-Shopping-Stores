const fetch = require('node-fetch');
(async () => {
  try {
    const r = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'kminchelle', password: '0lelplR' })
    });
    console.log('status', r.status);
    console.log(await r.text());
  } catch (e) {
    console.error(e);
  }
})();
