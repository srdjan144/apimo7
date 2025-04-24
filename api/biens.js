const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const token = process.env.APIMO_TOKEN;
  const agencyId = process.env.APIMO_AGENCY_ID;

  if (!token || !agencyId) {
    return res.status(500).json({ 
      error: "Configuration manquante",
      details: "Token ou Agency ID non configuré" 
    });
  }

  try {
    const url = `https://api.apimo.pro/agencies/${agencyId}/properties`;
    
    const response = await fetch(url, {
      headers: {
        "Authorization": `Basic ${Buffer.from(`${process.env.APIMO_PROVIDER_ID}:${token}`).toString('base64')}`,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Erreur API: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    // Active le cache pour 1h (optionnel mais recommandé)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json(data);

  } catch (error) {
    console.error("Erreur API Apimo:", error);
    res.status(500).json({ 
      error: "Échec de la récupération des biens",
      details: error.message,
      conseil: "Vérifiez les logs Vercel pour plus de détails"
    });
  }
};
