import { DynamicTool } from "@langchain/core/tools";

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

export const universitySearchTool = new DynamicTool({
  name: "search_universities",
  description: "Search for universities by country name. Returns a list of universities with their details including name, country, domains, and web pages.",
  func: async (input: string) => {
    try {
      const universities = await searchUniversities(input.trim());
      
      if (universities.length === 0) {
        return `No universities found for country: ${input}`;
      }
      
      // Format the results for better readability
      const formattedResults = universities.slice(0, 10).map((uni, index) => 
        `${index + 1}. ${uni.name}
   Country: ${uni.country}
   State/Province: ${uni.state_province || 'N/A'}
   Website: ${uni.web_pages[0] || 'N/A'}
   Domains: ${uni.domains.join(', ')}`
      ).join('\n\n');
      
      const totalCount = universities.length;
      const displayCount = Math.min(10, totalCount);
      
      return `Found ${totalCount} universities in ${input}. Showing top ${displayCount}:\n\n${formattedResults}${totalCount > 10 ? `\n\n... and ${totalCount - 10} more universities.` : ''}`;
    } catch (error) {
      return `Error searching universities: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
});

