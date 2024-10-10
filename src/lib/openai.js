import OpenAI  from 'openai';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_GPT_KEY,
    dangerouslyAllowBrowser: true 
  });


  export const feedbackSpeaking= async (response) => {
    const responseLength = response.trim().split(/\s+/).length
    
    if(responseLength < 60){
      return JSON.stringify({
        band: "A1",
        feed: "You didn't provide sufficient response to evaluate.\n\n",
        fluency: null,
        coh: null,
        grammar: null,
        lex: null
      })
    }

    const prompt = `
    You are an IELTS examiner. Evaluate the following response:
     
    ${response}

    Provide detailed feedback based on IELTS Speaking criteria (fluency, coherence, lexical resource, grammatical range, and accuracy). Also, assign a score range between 0 and 9. 
    Your output must be a in JSON structure: 
          {
          "band": "band",
          "feed": "feedback",
          "fluency": "fluency feedback",
          "coh": "coherence&cohesion feedback",
          "grammar": "grammarRange feedback",
          "lex": "lexicalResources feedback"
        }
    `;

    try {
      const response = await openai.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        model: "gpt-4o-mini",// You can use "gpt-3.5-turbo" if you prefer
        max_tokens: 800,
        temperature: 0.8,
        response_format: { "type": "json_object" }
      });

      const feedback = response.choices[0].message.content.trim();
      console.log(feedback);
      return feedback;

    } catch (error) {
      console.error('Error generating feedback:', error);
      
      return "An error occurred while generating feedback."
    }
  }
