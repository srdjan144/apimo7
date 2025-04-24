const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const providerId = process.env.APIMO_PROVIDER_ID;
  const token = process.env.APIMO_TOKEN;

  if (!providerId || !token) {
    return res.status(500).json({ 
      error: "Configuration manquante",
      details: "Provider ID ou Token non configuré" 
    });
  }

  try {
    // URL corrigée selon la documentation Apimo
    const url = `https://api.apimo.pro/properties`;
    
    const response = await fetch(url, {
      headers: {
        "Authorization": `Basic ${Buffer.from(`${providerId}:${token}`).toString('base64')}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Erreur API: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    // Active le cache pour 1 heure
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json(data);
    
  } catch (error) {
    console.error("Erreur détaillée:", error);
    res.status(500).json({ 
      error: "Échec de la récupération des propriétés",
      details: error.message 
    });
  }
};
