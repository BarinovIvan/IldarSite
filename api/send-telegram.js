export default async function handler(req, res) {
  // Разрешаем только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Missing environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { name, phone, contactMethod } = req.body;

    if (!name || !phone || !contactMethod) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 11) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    const message = [
      'Новая заявка с сайта ——————',
      `Имя: ${name}`,
      `Телефон: ${phone}`,
      `Способ связи: ${contactMethod}`,
      `URL: ${req.headers.origin || 'Unknown'}`
    ].join('\n');

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Telegram API error:', response.status, errorText);
      throw new Error(`Telegram API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Message sent successfully:', result);

    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
}
