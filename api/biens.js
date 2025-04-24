const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const token = process.env.APIMO_TOKEN;
  const providerId = process.env.APIMO_PROVIDER_ID;
  const agencyId = process.env.APIMO_AGENCY_ID;

  if (!token || !providerId) {
    return res.status(500).json({ error: "Missing API credentials" });
  }

  try {
    const url = `https://api.apimo.pro/providers/${providerId}/properties`;
    // Ou peut-être: `https://api.apimo.pro/agencies/${agencyId}/properties` selon la doc
    
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Apimo API error:", error);
    res.status(500).json({ 
      error: "Failed to fetch properties",
      details: error.message 
    });
  }
};
