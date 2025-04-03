import Anthropic from '@anthropic-ai/sdk';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Generates advanced security trend analysis using Claude
 * @param topic Optional specific topic to analyze
 * @returns Object containing structured security trend content
 */
export async function generateSecurityTrendWithClaude(topic?: string): Promise<{
  title: string;
  summary: string;
  keyPoints: string[];
  youtubeScriptIdea: string;
  fullContent: string;
}> {
  try {
    // Check if the API key is available
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("Anthropic API key not configured");
    }

    // Create a detailed prompt for Claude
    const defaultTopic = "latest cybersecurity threats, vulnerabilities, and mitigation strategies in 2025";
    const promptTopic = topic || defaultTopic;
    
    const systemPrompt = `You are a world-class cybersecurity expert at Superfishal Intelligence. 
Create detailed, technical, and accurate content about the ${promptTopic}. 
Be technical but make it understandable for IT professionals. 
Include specific threat actor names, CVEs, and real-world examples where appropriate.
Use the latest 2025 data and trends in your analysis.`;

    // Call Claude's API
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1500,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Generate comprehensive cybersecurity trend content with the following structure:
1. Title: Create an engaging, SEO-friendly title that captures the essence of ${promptTopic}
2. Summary: Write a concise 2-3 sentence overview that highlights the key insights
3. Key Points: Provide 5 detailed technical bulletpoints with specific examples, real CVEs, and actionable advice
4. YouTube Script Idea: Outline a compelling 5-7 minute script for an educational cybersecurity video on this topic
5. Full Content: Expand on the key points with a detailed 500-word technical analysis

Format your response as a JSON object with these keys: title, summary, keyPoints (array), youtubeScriptIdea, and fullContent.`
        }
      ],
    });

    // Extract the content from the response
    const contentBlock = response.content[0];
    const content = 'text' in contentBlock ? contentBlock.text : JSON.stringify({
      title: "Advanced Cybersecurity Analysis",
      summary: "A detailed examination of cybersecurity trends.",
      keyPoints: ["Zero-day vulnerabilities", "APT groups", "AI defenses"],
      youtubeScriptIdea: "Create an educational video on emerging threats",
      fullContent: "Placeholder for detailed content"
    });
    
    // Parse JSON response from Claude
    try {
      const parsed = JSON.parse(content);
      return {
        title: parsed.title || "Advanced Cybersecurity Threat Analysis",
        summary: parsed.summary || "A comprehensive review of current cybersecurity threats and mitigation strategies.",
        keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : 
          ["Zero-day vulnerabilities in critical infrastructure", "Advanced persistent threats targeting financial sectors", 
           "AI-powered defense mechanisms", "Supply chain security concerns", "Quantum-resistant encryption adoption"],
        youtubeScriptIdea: parsed.youtubeScriptIdea || "A deep dive into emerging cybersecurity threats with practical mitigation strategies.",
        fullContent: parsed.fullContent || "Comprehensive analysis of the current cybersecurity landscape."
      };
    } catch (parseError) {
      console.error("Failed to parse Claude response as JSON:", parseError);
      
      // If JSON parsing fails, try to extract content using regex patterns
      const titleMatch = content.match(/Title:?\s*([^\n]+)/i);
      const summaryMatch = content.match(/Summary:?\s*([^\n]+(?:\n[^\n#]+)*)/i);
      const keyPointsMatch = content.match(/Key Points:?\s*((?:[-*•]\s*[^\n]+\n?)+)/i);
      const scriptMatch = content.match(/YouTube Script Idea:?\s*([^\n]+(?:\n[^\n#]+)*)/i);
      const fullContentMatch = content.match(/Full Content:?\s*([^\n]+(?:\n[^\n#]+)*)/i);
      
      // Extract key points as an array
      let keyPoints = ["Security strategy must be continuously updated", "Zero-trust architecture is increasingly essential"];
      if (keyPointsMatch && keyPointsMatch[1]) {
        keyPoints = keyPointsMatch[1]
          .split(/[-*•]\s*/)
          .map((point: string) => point.trim())
          .filter((point: string) => point.length > 0);
      }
      
      return {
        title: titleMatch && titleMatch[1] ? titleMatch[1].trim() : "Advanced Cybersecurity Analysis",
        summary: summaryMatch && summaryMatch[1] ? summaryMatch[1].trim() : "A detailed examination of current cybersecurity trends.",
        keyPoints,
        youtubeScriptIdea: scriptMatch && scriptMatch[1] ? scriptMatch[1].trim() : "Exploring modern cybersecurity challenges and solutions.",
        fullContent: fullContentMatch && fullContentMatch[1] ? fullContentMatch[1].trim() : content
      };
    }
  } catch (error) {
    console.error('Error generating content with Claude:', error);
    
    // Return fallback content if the API call fails
    return {
      title: "Critical Cybersecurity Trends for 2025",
      summary: "An analysis of the most significant cybersecurity developments affecting organizations today.",
      keyPoints: [
        "Rise in sophisticated supply chain attacks targeting software dependencies",
        "Increased nation-state sponsored attacks on critical infrastructure",
        "AI-enhanced threat detection becoming standard for enterprise security",
        "Zero-trust architecture adoption accelerating across industries",
        "Quantum computing threats driving cryptographic agility initiatives"
      ],
      youtubeScriptIdea: "A comprehensive breakdown of the 5 most critical cybersecurity threats and practical mitigation strategies for organizations of all sizes.",
      fullContent: "The cybersecurity landscape continues to evolve rapidly with threats becoming more sophisticated and targeted. Organizations must adopt proactive security postures and leverage advanced technologies to defend against modern attacks."
    };
  }
}

/**
 * Generate SEO-optimized blog content for YouTube scripts
 */
export async function generateYouTubeScript(topic: string): Promise<{
  title: string;
  script: string;
  thumbnail: string;
  description: string;
  tags: string[];
}> {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("Anthropic API key not configured");
    }
    
    const response = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 2000,
      temperature: 0.7,
      system: "You are a expert YouTube content creator specializing in cybersecurity and AI topics.",
      messages: [
        {
          role: 'user',
          content: `Create a complete YouTube video package about "${topic}" with the following:

1. Title: Attention-grabbing, SEO-friendly title (60 chars max)
2. Script: 500-word script with intro, main points, and call-to-action
3. Thumbnail Description: Description of an ideal thumbnail image that would attract clicks
4. Video Description: 150-word description with keywords and timestamps
5. Tags: 10 relevant SEO tags as an array

Format as JSON with these keys: title, script, thumbnail, description, tags`
        }
      ],
    });

    const contentBlock = response.content[0];
    const content = 'text' in contentBlock ? contentBlock.text : '';
    
    try {
      const parsed = JSON.parse(content);
      return {
        title: parsed.title || `Cybersecurity Insights: ${topic}`,
        script: parsed.script || "Script content unavailable",
        thumbnail: parsed.thumbnail || "Thumbnail description unavailable",
        description: parsed.description || "Video description unavailable",
        tags: Array.isArray(parsed.tags) ? parsed.tags : ["cybersecurity", "tutorial", "AI", "security"]
      };
    } catch (parseError) {
      console.error("Failed to parse YouTube script response:", parseError);
      return {
        title: `Advanced Guide to ${topic}`,
        script: content,
        thumbnail: "Security expert pointing to digital threat visualization on screen",
        description: `Learn everything you need to know about ${topic} in this comprehensive guide from Superfishal Intelligence.`,
        tags: ["cybersecurity", "tutorial", "threats", "security", topic.toLowerCase()]
      };
    }
  } catch (error) {
    console.error('Error generating YouTube script:', error);
    return {
      title: `Essential Guide to ${topic}`,
      script: "Script generation failed. Please try again later.",
      thumbnail: "Cybersecurity expert at computer with lock icon",
      description: `A comprehensive guide to understanding ${topic} and implementing effective security measures.`,
      tags: ["cybersecurity", "tutorial", "security", "guide", "howto"]
    };
  }
}