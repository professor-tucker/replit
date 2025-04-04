import axios from 'axios';
import { GeneratedContent } from '@shared/schema';

/**
 * Client for interacting with the Perplexity API
 */
export async function callPerplexityAPI(prompt: string, systemPrompt: string = "Be precise and concise."): Promise<string> {
  try {
    // Check if we have the Perplexity API key
    const apiKey = process.env.PERPLEXITY_API_KEY;
    
    if (!apiKey) {
      throw new Error("Perplexity API key not available");
    }
    
    // Call Perplexity API
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: "llama-3.1-sonar-small-128k-online", // the newest Perplexity model
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1024,
        temperature: 0.2,
        top_p: 0.9,
        search_domain_filter: ["perplexity.ai"], // Customize domain sources as needed
        return_images: false,
        return_related_questions: false,
        search_recency_filter: "month",
        top_k: 0,
        stream: false,
        presence_penalty: 0,
        frequency_penalty: 1
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data && 
        response.data.choices && 
        response.data.choices.length > 0 && 
        response.data.choices[0].message) {
      return response.data.choices[0].message.content;
    }
    
    // Handle citations if needed
    if (response.data && response.data.citations) {
      console.log("Citations provided by Perplexity:", response.data.citations);
    }
    
    throw new Error("Unexpected API response format");
  } catch (error) {
    console.error('Error using Perplexity API:', error);
    throw error;
  }
}

/**
 * Generates security trend analysis using Perplexity
 * @param topic Optional specific topic to analyze
 * @returns Object containing structured security trend content
 */
export async function generateSecurityTrendWithPerplexity(topic?: string): Promise<{
  title: string;
  summary: string;
  keyPoints: string[];
  youtubeScriptIdea: string;
}> {
  try {
    const promptTopic = topic || "latest cybersecurity trends, threats, and mitigation strategies";
    
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

    // Call the Perplexity API
    const result = await callPerplexityAPI(prompt, systemPrompt);
    
    // Parse the JSON response
    try {
      const jsonResponse = JSON.parse(result);
      return {
        title: jsonResponse.title,
        summary: jsonResponse.summary,
        keyPoints: jsonResponse.keyPoints,
        youtubeScriptIdea: jsonResponse.youtubeScriptIdea
      };
    } catch (parseError) {
      console.error("Error parsing JSON response from Perplexity:", parseError);
      
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
    console.error('Error generating security trend content with Perplexity:', error);
    
    // Return fallback content if there's an API error
    return {
      title: "Emerging Cybersecurity Trends",
      summary: "An overview of the latest developments in cybersecurity threats and defenses.",
      keyPoints: [
        "Zero-trust architecture is becoming increasingly important",
        "Ransomware continues to evolve with more sophisticated techniques",
        "AI-driven security tools are enhancing threat detection capabilities",
        "Cloud security posture management is critical as cloud adoption accelerates"
      ],
      youtubeScriptIdea: "A walkthrough of the most critical security practices businesses should implement in today's threat landscape."
    };
  }
}

/**
 * Generates detailed content for YouTube scripts using Perplexity
 * @param topic Specific topic to create content for
 * @returns Detailed YouTube script content
 */
export async function generateYouTubeScriptWithPerplexity(topic: string): Promise<{
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

    // Call the Perplexity API
    const result = await callPerplexityAPI(prompt, systemPrompt);
    
    // Parse the response
    try {
      return JSON.parse(result);
    } catch (parseError) {
      console.error("Error parsing JSON from Perplexity:", parseError);
      
      // Provide a simplified fallback
      return {
        title: `${topic} - Essential Guide`,
        summary: `A comprehensive overview of ${topic} for cybersecurity professionals.`,
        script: "Welcome to Superfishal Intelligence. Today we're discussing " + topic + "...",
        keypoints: ["Understanding the basics", "Implementation strategies", "Common pitfalls", "Advanced techniques"],
        categories: ["Cybersecurity", "Technology"],
        tags: ["cybersecurity", "infosec", topic.toLowerCase(), "security", "technology"]
      };
    }
  } catch (error) {
    console.error('Error generating YouTube script with Perplexity:', error);
    
    // Return fallback content
    return {
      title: `${topic} - Essential Guide`,
      summary: `A comprehensive overview of ${topic} for cybersecurity professionals.`,
      script: "Welcome to Superfishal Intelligence. Today we're discussing " + topic + "...",
      keypoints: ["Understanding the basics", "Implementation strategies", "Common pitfalls", "Advanced techniques"],
      categories: ["Cybersecurity", "Technology"],
      tags: ["cybersecurity", "infosec", topic.toLowerCase(), "security", "technology"]
    };
  }
}

/**
 * Searches for and analyzes recent cybersecurity resources
 * @param query Search query for finding resources
 * @returns Analysis of found resources
 */
export async function searchSecurityResources(query: string): Promise<{
  resources: Array<{title: string, description: string, url: string}>;
  analysis: string;
}> {
  try {
    const systemPrompt = `You are a cybersecurity resource analyst who provides factual, well-researched information.`;
    
    const prompt = `
Find and analyze recent, high-quality cybersecurity resources related to "${query}".
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

    // Call the Perplexity API
    const result = await callPerplexityAPI(prompt, systemPrompt);
    
    // Parse the response
    try {
      return JSON.parse(result);
    } catch (parseError) {
      console.error("Error parsing JSON from Perplexity:", parseError);
      
      // Fallback response
      return {
        resources: [
          {
            title: "Resource not available",
            description: "Unable to retrieve resources at this time",
            url: "https://www.cisa.gov/"
          }
        ],
        analysis: `We're currently unable to provide analysis for "${query}". Please try another search term or check back later.`
      };
    }
  } catch (error) {
    console.error('Error searching security resources with Perplexity:', error);
    
    // Return fallback content
    return {
      resources: [
        {
          title: "Resource not available",
          description: "Unable to retrieve resources at this time",
          url: "https://www.cisa.gov/"
        }
      ],
      analysis: `We're currently unable to provide analysis for "${query}". Please try another search term or check back later.`
    };
  }
}