import { HfInference } from '@huggingface/inference';
import { GeneratedContent } from '@shared/schema';

// Initialize the Hugging Face client
let hf: HfInference | null = null;

// Get or initialize the Hugging Face client
export function getHfClient(): HfInference {
  if (!hf) {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    hf = new HfInference(apiKey);
  }
  return hf;
}

/**
 * Advanced implementation for generating responses from larger Hugging Face models
 * @param prompt The prompt to send to the model
 * @param systemPrompt Optional system prompt that defines the assistant's behavior
 * @returns The generated text response
 */
export async function generateAdvancedResponse(prompt: string, systemPrompt: string = "You are an AI cybersecurity expert providing accurate information."): Promise<string> {
  try {
    const hfClient = getHfClient();
    
    // Combine system prompt and user prompt
    const fullPrompt = `${systemPrompt}\n\nUser: ${prompt}\n\nAssistant:`;
    
    // Use a more powerful model for advanced responses
    // Try to use one of the larger and more capable models
    const models = [
      'meta-llama/Llama-2-70b-chat-hf',
      'tiiuae/falcon-180B',
      'bigscience/bloom',
      'google/gemma-7b',
      'mistralai/Mistral-7B-Instruct-v0.2',
      'meta-llama/Llama-2-7b-chat-hf'
    ];
    
    // Try models in order until one works
    let result;
    let error;
    
    for (const model of models) {
      try {
        result = await hfClient.textGeneration({
          model: model,
          inputs: fullPrompt,
          parameters: {
            max_new_tokens: 1024,
            temperature: 0.5,
            top_p: 0.95,
            do_sample: true,
            return_full_text: false
          }
        });
        
        if (result && result.generated_text) {
          break; // Success, exit the loop
        }
      } catch (e) {
        error = e;
        console.warn(`Failed to use model ${model}:`, e);
        // Continue to next model
      }
    }
    
    if (!result || !result.generated_text) {
      throw error || new Error("Failed to generate text with any available model");
    }
    
    return result.generated_text.trim();
  } catch (error) {
    console.error('Error in advanced Hugging Face response generation:', error);
    throw error;
  }
}

/**
 * Generates detailed cybersecurity trend analysis using Hugging Face models
 * @param topic Optional specific topic to analyze
 * @returns Object containing structured security trend content
 */
export async function generateSecurityTrendWithHF(topic?: string): Promise<{
  title: string;
  summary: string;
  keyPoints: string[];
  youtubeScriptIdea: string;
}> {
  try {
    const promptTopic = topic || "latest cybersecurity threats and defense strategies";
    
    const systemPrompt = `You are a world-class cybersecurity expert at Superfishal Intelligence, providing detailed analysis on cybersecurity topics.`;
    
    const prompt = `
Generate a comprehensive analysis on ${promptTopic}. Focus on information that would be valuable to cybersecurity professionals.

Structure your response in the following JSON format:
{
  "title": "An SEO-optimized, engaging title",
  "summary": "A concise 2-3 sentence summary of the main insights",
  "keyPoints": ["Point 1 about a critical security issue", "Point 2 about another important aspect", "Point 3 with actionable advice", "Point 4 with relevant statistics or examples"],
  "youtubeScriptIdea": "A brief outline for a 5-minute educational YouTube video on this topic that would be engaging and informative"
}
`;

    // Call the advanced Hugging Face generation function
    const result = await generateAdvancedResponse(prompt, systemPrompt);
    
    // Parse the JSON response
    try {
      // Extract the JSON part if there's extra text
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : result;
      
      const jsonResponse = JSON.parse(jsonString);
      return {
        title: jsonResponse.title,
        summary: jsonResponse.summary,
        keyPoints: jsonResponse.keyPoints,
        youtubeScriptIdea: jsonResponse.youtubeScriptIdea
      };
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      
      // Attempt to extract the structured data from text
      const titleMatch = result.match(/(?:"title"|title):\s*"([^"]+)"/);
      const summaryMatch = result.match(/(?:"summary"|summary):\s*"([^"]+)"/);
      const keyPointsMatch = result.match(/(?:"keyPoints"|keyPoints):\s*\[(.*?)\]/s);
      const youtubeMatch = result.match(/(?:"youtubeScriptIdea"|youtubeScriptIdea):\s*"([^"]+)"/);
      
      return {
        title: titleMatch ? titleMatch[1] : "Latest Cybersecurity Trends Analysis",
        summary: summaryMatch ? summaryMatch[1] : "Analysis of current cybersecurity landscape and emerging threats.",
        keyPoints: keyPointsMatch 
          ? keyPointsMatch[1].split(/,(?=\s*"|\s*')/).map(point => 
              point.trim().replace(/^["']|["']$/g, '')
            )
          : ["Advanced persistent threats continue to evolve", "Zero-trust architecture is becoming standard", "AI-powered security tools are increasingly important"],
        youtubeScriptIdea: youtubeMatch ? youtubeMatch[1] : "A comprehensive overview of emerging cybersecurity threats and defense strategies."
      };
    }
  } catch (error) {
    console.error('Error generating security trend content with HF:', error);
    throw error;
  }
}

/**
 * Generates detailed content for YouTube scripts using Hugging Face
 * @param topic Specific topic to create content for
 * @returns Detailed YouTube script content
 */
export async function generateYouTubeScriptWithHF(topic: string): Promise<{
  title: string;
  summary: string;
  script: string;
  keypoints: string[];
  categories: string[];
  tags: string[];
}> {
  try {
    const systemPrompt = `You are a professional content creator specializing in cybersecurity education.`;
    
    const prompt = `
Create a detailed YouTube script about "${topic}" for our cybersecurity channel. 
Make it engaging, informative, and professionally structured.

Return the response in this JSON format:
{
  "title": "An engaging, SEO-optimized title",
  "summary": "A compelling 30-word description for the video",
  "script": "The complete 5-minute script including intro, main points, and conclusion",
  "keypoints": ["Main point 1", "Main point 2", "Main point 3", "Main point 4"],
  "categories": ["Primary category", "Secondary category"],
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}
`;

    // Call the Hugging Face generation function
    const result = await generateAdvancedResponse(prompt, systemPrompt);
    
    // Parse the response
    try {
      // Extract the JSON part if there's extra text
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : result;
      
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Error parsing JSON from response:", parseError);
      
      // Provide a simplified fallback by extracting data from the text
      const titleMatch = result.match(/(?:"title"|title):\s*"([^"]+)"/);
      const summaryMatch = result.match(/(?:"summary"|summary):\s*"([^"]+)"/);
      const scriptMatch = result.match(/(?:"script"|script):\s*"([^"]+)"/);
      const keypointsMatch = result.match(/(?:"keypoints"|keypoints):\s*\[(.*?)\]/s);
      const categoriesMatch = result.match(/(?:"categories"|categories):\s*\[(.*?)\]/s);
      const tagsMatch = result.match(/(?:"tags"|tags):\s*\[(.*?)\]/s);
      
      return {
        title: titleMatch ? titleMatch[1] : `${topic} - Essential Guide`,
        summary: summaryMatch ? summaryMatch[1] : `A comprehensive overview of ${topic} for cybersecurity professionals.`,
        script: scriptMatch ? scriptMatch[1] : `Welcome to Superfishal Intelligence. Today we're discussing ${topic}...`,
        keypoints: keypointsMatch 
          ? keypointsMatch[1].split(/,(?=\s*"|\s*')/).map(point => point.trim().replace(/^["']|["']$/g, ''))
          : ["Understanding the basics", "Implementation strategies", "Common pitfalls", "Advanced techniques"],
        categories: categoriesMatch
          ? categoriesMatch[1].split(/,(?=\s*"|\s*')/).map(cat => cat.trim().replace(/^["']|["']$/g, ''))
          : ["Cybersecurity", "Technology"],
        tags: tagsMatch
          ? tagsMatch[1].split(/,(?=\s*"|\s*')/).map(tag => tag.trim().replace(/^["']|["']$/g, ''))
          : ["cybersecurity", "infosec", topic.toLowerCase(), "security", "technology"]
      };
    }
  } catch (error) {
    console.error('Error generating YouTube script with HF:', error);
    throw error;
  }
}

/**
 * Searches for and analyzes cybersecurity resources using HF models
 * @param query Search query for finding resources
 * @returns Analysis of resources
 */
export async function searchSecurityResourcesWithHF(query: string): Promise<{
  resources: Array<{title: string, description: string, url: string}>;
  analysis: string;
}> {
  try {
    const systemPrompt = `You are a cybersecurity resource analyst who provides factual, well-researched information.`;
    
    const prompt = `
Find and analyze high-quality cybersecurity resources related to "${query}".
Focus on authoritative sources, tools, and informational resources.

Return your response in this JSON format:
{
  "resources": [
    {
      "title": "Resource name",
      "description": "Brief description of what this resource offers",
      "url": "Full URL to the resource"
    },
    // Include 3-5 resources
  ],
  "analysis": "A 2-3 paragraph analysis of these resources, their strengths, and how they relate to the query"
}
`;

    // Call the Hugging Face generation function
    const result = await generateAdvancedResponse(prompt, systemPrompt);
    
    // Parse the response
    try {
      // Extract the JSON part if there's extra text
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : result;
      
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Error parsing JSON from response:", parseError);
      
      // Extract resources and analysis if possible
      const resourcesMatch = result.match(/(?:"resources"|resources):\s*\[(.*?)\]/s);
      const analysisMatch = result.match(/(?:"analysis"|analysis):\s*"([^"]+)"/);
      
      let resources = [];
      if (resourcesMatch) {
        const resourcesText = resourcesMatch[1];
        const resourceObjects = resourcesText.split(/\},/).map(r => r.trim() + (r.endsWith('}') ? '' : '}'));
        
        resources = resourceObjects.map(resourceObj => {
          try {
            const parsedResource = JSON.parse(resourceObj);
            return {
              title: parsedResource.title || "Unknown resource",
              description: parsedResource.description || "No description available",
              url: parsedResource.url || "https://www.cisa.gov/"
            };
          } catch (e) {
            return null;
          }
        }).filter(r => r !== null);
      }
      
      if (resources.length === 0) {
        resources = [
          {
            title: "CISA Cybersecurity Resources",
            description: "Official cybersecurity guidance and tools from the Cybersecurity & Infrastructure Security Agency",
            url: "https://www.cisa.gov/resources-tools"
          }
        ];
      }
      
      return {
        resources,
        analysis: analysisMatch ? analysisMatch[1] : `These resources provide valuable information about ${query} for cybersecurity professionals.`
      };
    }
  } catch (error) {
    console.error('Error searching security resources with HF:', error);
    throw error;
  }
}