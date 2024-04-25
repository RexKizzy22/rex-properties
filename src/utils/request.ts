import { SavedProperty } from "./types";

const apiDomain =
  process.env.NEXT_PUBLIC_API_DOMAIN || "http://localhost:3000/api";

async function fetchProperties() {
  if (!apiDomain) {
    return [];
  }

  const res = await fetch(`${apiDomain}/properties`);

  if (!res.ok) {
    throw new Error("Error fetching properties");
  }

  return res.json();
}

async function fetchProperty([_, id]: string[]): Promise<SavedProperty | null> {
  if (!apiDomain) {
    return null;
  }

  const res = await fetch(`${apiDomain}/properties/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Error fetching properties");
  }

  return res.json();
}

export { fetchProperties, fetchProperty };
