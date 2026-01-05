import { toolsData, Tool } from '../toolsData';

// Simple Levenshtein distance for fuzzy matching
const levenshtein = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
      }
    }
  }
  return matrix[b.length][a.length];
};

export interface SearchResult {
  tool: Tool;
  score: number;
}

export interface ToolWithContext {
  tool: Tool;
  categoryId: string;
  subcategoryKey: string;
  subcategoryName: string;
}

export const getToolByIdWithContext = (id: string): ToolWithContext | null => {
  for (const [categoryId, category] of Object.entries(toolsData)) {
    for (const [subcategoryKey, subcategory] of Object.entries(category.subcategories)) {
      const found = subcategory.calculators.find((t) => t.id === id);
      if (found) {
        return {
          tool: found,
          categoryId,
          subcategoryKey,
          subcategoryName: subcategory.name,
        };
      }
    }
  }
  return null;
};

// Flatten the tools data for easier searching
const getAllTools = (): Tool[] => {
  const allTools: Tool[] = [];
  Object.values(toolsData).forEach((category) => {
    Object.values(category.subcategories).forEach((subcategory) => {
      allTools.push(...subcategory.calculators);
    });
  });
  return allTools;
};

const getAllToolsWithContext = (): ToolWithContext[] => {
  const allTools: ToolWithContext[] = [];
  Object.entries(toolsData).forEach(([categoryId, category]) => {
    Object.entries(category.subcategories).forEach(([subcategoryKey, subcategory]) => {
      subcategory.calculators.forEach((tool) => {
        allTools.push({
          tool,
          categoryId,
          subcategoryKey,
          subcategoryName: subcategory.name,
        });
      });
    });
  });
  return allTools;
};

export const searchTools = (query: string): Tool[] => {
  const tools = getAllTools();
  const lowerQuery = query.toLowerCase();
  const queryTerms = lowerQuery.split(' ').filter(t => t.length > 2); // Filter out small words

  const results: SearchResult[] = tools.map((tool) => {
    let score = 0;
    const title = tool.title.toLowerCase();
    const description = tool.description.toLowerCase();
    const titleWords = title.split(/\s+/);

    // Exact match bonus
    if (title.includes(lowerQuery)) score += 10;
    if (description.includes(lowerQuery)) score += 5;

    // Term match
    queryTerms.forEach(term => {
      if (title.includes(term)) {
        score += 3;
      } else {
        // Fuzzy match
        for (const word of titleWords) {
          if (Math.abs(word.length - term.length) <= 2) {
            const dist = levenshtein(term, word);
            if (dist <= 1) { score += 2; break; }
            if (dist <= 2 && term.length > 4) { score += 1; break; }
          }
        }
      }
      if (description.includes(term)) score += 1;
    });

    return { tool, score };
  });

  // Return top 5 results with score > 0
  return results
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(r => r.tool);
};

export const searchToolsWithContext = (query: string): ToolWithContext[] => {
  const tools = getAllToolsWithContext();
  const lowerQuery = query.toLowerCase();
  const queryTerms = lowerQuery.split(' ').filter((t) => t.length > 2);

  const results = tools
    .map((item) => {
      let score = 0;
      const title = item.tool.title.toLowerCase();
      const description = item.tool.description.toLowerCase();
      const titleWords = title.split(/\s+/);

      if (title.includes(lowerQuery)) score += 10;
      if (description.includes(lowerQuery)) score += 5;

      queryTerms.forEach((term) => {
        if (title.includes(term)) {
          score += 3;
        } else {
          // Fuzzy match against title words
          for (const word of titleWords) {
            if (Math.abs(word.length - term.length) <= 2) {
              const dist = levenshtein(term, word);
              if (dist <= 1) { score += 2; break; }
              if (dist <= 2 && term.length > 4) { score += 1; break; }
            }
          }
        }
        if (description.includes(term)) score += 1;
      });

      return { item, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((r) => r.item);

  return results;
};

export const generateSystemPrompt = (contextTools: Tool[]): string => {
  const toolsContext = contextTools.map(t => 
    `- ${t.title}: ${t.description} (ID: ${t.id})`
  ).join('\n');

  return `You are a helpful AI assistant for a Financial Calculator website. 
Your goal is to help users find the right calculator for their needs and answer financial questions.

Here are some relevant calculators based on the user's query:
${toolsContext}

If the user asks for a specific calculation, guide them to the appropriate calculator ID.
If the user asks a general financial question, answer it briefly and suggest relevant calculators.
Always be polite and professional.
Do not make up calculators that do not exist in the list above.`;
};
