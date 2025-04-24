const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const token = process.env.APIMO_TOKEN;
  const providerId = process.env.APIMO_PROVIDER_ID;

  if (!token || !providerId) {
    return res.status(500).json({ error: "Missing API credentials" });
  }

  const url = `https://apimo.net/fr/api/webservice/?action=get_estates_list&provider=${providerId}&lang=fr`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: token
      }
    });

    if (!response.ok) {
      throw new Error("API response not ok");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};
