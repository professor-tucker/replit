import { HfInference } from '@huggingface/inference';

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
    
    // Use a more capable open-source model from Hugging Face
    // This is a Llama-2 based model that's optimized for chat
    const modelId = 'meta-llama/Llama-2-7b-chat-hf';
    
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
  const systemPrompt = "You are an AI resource guide at Superfishal Intelligence, a platform that helps users discover free AI tools, get code examples, and find hosting options.";
  
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