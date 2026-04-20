export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  const { image, mediaType } = req.body;
  if (!image) {
    return res.status(400).json({ error: 'No image provided' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType || 'image/jpeg',
                  data: image,
                },
              },
              {
                type: 'text',
                text: `Analyse ce ticket de caisse / reçu. Extrais les informations suivantes et retourne UNIQUEMENT un objet JSON valide, sans texte autour :

{
  "amount": <montant total TTC en nombre>,
  "note": "<nom du commerce / enseigne>",
  "date": "<date au format YYYY-MM-DD si visible, sinon null>",
  "items": ["<liste courte des articles principaux si lisibles>"]
}

Règles :
- "amount" doit être le TOTAL TTC (le montant final payé)
- Si plusieurs montants sont visibles, prends le total final (souvent le plus grand, marqué "TOTAL", "A PAYER", etc.)
- "note" = le nom du magasin/commerce
- "date" = la date du ticket si lisible
- "items" = résumé court des articles (max 5), ou tableau vide si illisible
- Retourne UNIQUEMENT le JSON, rien d'autre`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(502).json({ error: 'Claude API error', details: err });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    // Extraire le JSON de la réponse
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(422).json({ error: 'Could not parse receipt', raw: text });
    }

    const result = JSON.parse(jsonMatch[0]);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
