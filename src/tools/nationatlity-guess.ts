interface University {
  alpha_two_code: string;
  country: string;
  domains: string[];
  name: string;
  state_province: string | null;
  web_pages: string[];
}

export async function searchUniversities(
  country: string
): Promise<University[]> {
  const response = await fetch(
    `http://universities.hipolabs.com/search?country=${encodeURIComponent(
      country
    )}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch universities data: ${response.status}`);
  }

  const data = await response.json();
  return data as University[];
}
