const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

async function fetchProperties() {
  if (!apiDomain) {
    return [];
  }

  try {
    const res = await fetch(`${apiDomain}/properties`);

    if (!res.ok) {
      throw new Error("Error fetching properties");
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchProperty(id: string) {
  if (!apiDomain) {
    return;
  }

  try {
    const res = await fetch(`${apiDomain}/properties/${id}`);

    if (!res.ok) {
      throw new Error("Error fetching properties");
    }

    return res.json();
  } catch (error) {
    console.error(error);
  }
}

export { fetchProperties, fetchProperty };
