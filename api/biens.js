const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const providerId = process.env.APIMO_PROVIDER_ID;
  const token = process.env.APIMO_TOKEN;
  const agencyId = process.env.APIMO_AGENCY_ID;

  if (!providerId || !token) {
    return res.status(500).json({ 
      error: "Configuration manquante",
      details: "Provider ID ou Token non configuré" 
    });
  }

  try {
    // 3 endpoints possibles selon la documentation Apimo
    const endpoints = [
      `https://api.apimo.pro/agencies/${agencyId}/properties`, // 1. Endpoint agency
      `https://api.apimo.pro/providers/${providerId}/properties`, // 2. Endpoint provider
      `https://api.apimo.pro/properties` // 3. Endpoint global
    ];

    let lastError = null;
    
    // Teste successivement les différents endpoints
    for (const url of endpoints) {
      try {
        const response = await fetch(url, {
          headers: {
            "Authorization": `Basic ${Buffer.from(`${providerId}:${token}`).toString('base64')}`,
            "Accept": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
          res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
          return res.status(200).json(data);
        }
        
        lastError = await response.json();
      } catch (error) {
        lastError = error.message;
      }
    }

    throw new Error(`Tous les endpoints ont échoué. Dernière erreur: ${JSON.stringify(lastError)}`);

  } catch (error) {
    console.error("Erreur API Apimo:", error);
    res.status(500).json({ 
      error: "Impossible de récupérer les biens immobiliers",
      details: error.message,
      conseil: "Vérifiez les identifiants et l'URL dans la documentation Apimo"
    });
  }
};
