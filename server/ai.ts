import { HfInference } from '@huggingface/inference';
import axios from 'axios';
import { generateSecurityTrendWithClaude, generateYouTubeScript } from './anthropic';

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

// Generate a response from the AI model
export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    const hfClient = getHfClient();
    
    // Use a reliable, free model from Hugging Face
    const modelId = 'gpt2';
    
    // Generate text from the model
    const result = await hfClient.textGeneration({
      model: modelId,
      inputs: prompt,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true,
      }
    });
    
    return result.generated_text;
  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Fallback response if there's an error with the API
    return "I'm sorry, I'm having trouble connecting to my AI brain at the moment. Please try again later or ask about our AI resources.";
  }
}

// Format the prompt for better AI responses
export function formatChatPrompt(messages: { role: string; content: string }[]): string {
  // Create a system prompt that defines the assistant's role
  const systemPrompt = "You are an AI resource guide at Superfishal Intelligence, a platform that helps users discover premium AI tools, get code examples, and find hosting options.";
  
  // Combine all messages into a single formatted prompt
  let formattedPrompt = `${systemPrompt}\n\n`;
  
  // Add conversation history
  for (const message of messages) {
    const roleLabel = message.role === 'user' ? 'User:' : 'Assistant:';
    formattedPrompt += `${roleLabel} ${message.content}\n`;
  }
  
  // Add a final prompt for the assistant to continue
  formattedPrompt += 'Assistant:';
  
  return formattedPrompt;
}

// Specialized function for generating cybersecurity trend content
export async function generateSecurityTrendContent(topic?: string): Promise<{
  title: string;
  summary: string;
  keyPoints: string[];
  youtubeScriptIdea: string;
}> {
  // First, try to use Claude if the API key is available
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      console.log("Using Anthropic Claude for security trend generation");
      const claudeResponse = await generateSecurityTrendWithClaude(topic);
      return {
        title: claudeResponse.title,
        summary: claudeResponse.summary,
        keyPoints: claudeResponse.keyPoints,
        youtubeScriptIdea: claudeResponse.youtubeScriptIdea
      };
    } catch (claudeError) {
      console.error("Claude API error, falling back to Hugging Face:", claudeError);
      // Continue to fallback method if Claude fails
    }
  }
  
  // Fallback to Hugging Face if Claude is not available or fails
  try {
    const hfClient = getHfClient();
    
    // Create a prompt for generating cybersecurity content
    const promptTopic = topic || "latest cybersecurity trends, threats, and mitigation strategies";
    
    const prompt = `
As a cybersecurity expert at Superfishal Intelligence, generate highly informative, accurate content about ${promptTopic}.
Structure your response as follows:
1. Title: Create an engaging, SEO-friendly title
2. Summary: Write a 2-3 sentence overview of the key insights
3. Key Points: Provide 3-4 bulletpoints highlighting the most important technical aspects
4. YouTube Script Idea: Provide a brief outline for a 5-minute educational video on this topic
`;
    
    // Generate text from the model with more tokens for detailed content
    const result = await hfClient.textGeneration({
      model: 'meta-llama/Llama-2-7b-chat-hf',
      inputs: prompt,
      parameters: {
        max_new_tokens: 600,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true,
      }
    });
    
    const response = result.generated_text;
    
    // Parse the structured response (basic parsing - could be improved with regex)
    const sections = response.split(/\d+\.\s+/);
    
    // Extract the relevant parts (this is simplified and could be more robust)
    let title = "Latest Cybersecurity Trends";
    let summary = "Insights into the latest cybersecurity developments.";
    let keyPoints = ["Emerging threat vectors", "New defense strategies", "Industry best practices"];
    let youtubeScriptIdea = "A comprehensive overview of current cybersecurity trends.";
    
    // Try to extract the title
    if (sections.length > 1 && sections[1].includes("Title:")) {
      title = sections[1].replace("Title:", "").trim();
    }
    
    // Try to extract the summary
    if (sections.length > 2 && sections[2].includes("Summary:")) {
      summary = sections[2].replace("Summary:", "").trim();
    }
    
    // Try to extract key points
    if (sections.length > 3 && sections[3].includes("Key Points:")) {
      const keyPointsText = sections[3].replace("Key Points:", "").trim();
      keyPoints = keyPointsText.split(/\n-|\n\*/).map(point => point.trim()).filter(Boolean);
    }
    
    // Try to extract YouTube script idea
    if (sections.length > 4 && sections[4].includes("YouTube Script Idea:")) {
      youtubeScriptIdea = sections[4].replace("YouTube Script Idea:", "").trim();
    }
    
    return {
      title,
      summary,
      keyPoints,
      youtubeScriptIdea
    };
  } catch (error) {
    console.error('Error generating security trend content:', error);
    
    // Return fallback content if there's an API error
    return {
      title: "Emerging Cybersecurity Trends",
      summary: "An overview of the latest developments in cybersecurity threats and defenses.",
      keyPoints: [
        "Zero-trust architecture is becoming increasingly important",
        "Ransomware continues to evolve with more sophisticated techniques",
        "AI-driven security tools are enhancing threat detection capabilities"
      ],
      youtubeScriptIdea: "A walkthrough of the most critical security practices businesses should implement."
    };
  }
}

// Function to utilize Perplexity API once the key is available
export async function generateWithPerplexity(prompt: string): Promise<string> {
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
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are an AI specialist at Superfishal Intelligence, providing accurate information on AI and cybersecurity topics.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 300
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Extract and return the content from the response
    if (response.data && 
        response.data.choices && 
        response.data.choices.length > 0 && 
        response.data.choices[0].message) {
      return response.data.choices[0].message.content;
    }
    
    throw new Error("Unexpected API response format");
  } catch (error) {
    console.error('Error using Perplexity API:', error);
    
    // Fall back to Hugging Face if Perplexity fails
    return generateAIResponse(prompt);
  }
}