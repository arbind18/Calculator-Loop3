import { NextResponse } from 'next/server';
import { getToolByIdWithContext, searchToolsWithContext } from '@/lib/ai/rag';
import { searchBlogs } from '@/lib/ai/blogSearch';
import { customKnowledge } from '@/ai-training/ai-questions-answers/customKnowledge';
import { detectLanguage, getResponseTemplate } from '@/lib/ai/languageUtils';
import { tryBuildFormulaResponse } from '@/lib/ai/formulaResponder';
import { tryBuildMathSolveResponse } from '@/lib/ai/mathSolver';

const buildNextStepSuggestion = (message: string, lang: 'en' | 'hi') => {
  const q = message.toLowerCase();
  const isHi = lang === 'hi';

  if (q.includes('emi') || q.includes('loan') || q.includes('interest') || q.includes('byaj')) {
    return isHi 
      ? "Behtar result ke liye batayein: loan amount, byaj dar (%), aur samay (mahine/saal). Main aapko sahi EMI bata sakta hoon."
      : "For best result, share: loan amount, interest rate (%), and tenure (months/years). Then I can suggest a better tenure or compare 2 options.";
  }

  if (q.includes('sip') || q.includes('mutual fund') || q.includes('investment') || q.includes('nivesh')) {
    return isHi
      ? "Batayein: mahine ka SIP amount, ummeed ki gayi return (%), aur kitne saal ke liye. Main aapko future value bata sakta hoon."
      : "Share: monthly SIP amount, expected annual return (%), and years. I can suggest a realistic return range and a target monthly SIP.";
  }

  if (q.includes('gst') || q.includes('tax')) {
    return isHi
      ? "Batayein: amount aur GST rate (%). Main aapko final amount bata sakta hoon."
      : "Share: amount and GST rate (%). I can tell you the tax and final amount.";
  }

  if (q.includes('bmi') || q.includes('calorie') || q.includes('bmr') || q.includes('wajan')) {
    return isHi
      ? "Batayein: kad (height), wajan (weight), umar (age), aur gender. Main aapko healthy range bata sakta hoon."
      : "Share: height, weight, age, and gender. I can suggest a healthy range and next steps.";
  }

  return isHi
    ? "Apna goal ya numbers batayein. Main aapko sahi calculator suggest karunga."
    : "Tell me your goal and your numbers (if any). I’ll recommend the best calculator and next steps.";
};

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const lang = detectLanguage(message);
    const templates = getResponseTemplate(lang);
    let responseContent = '';

    // 0. Check Custom Knowledge Base (Manual Training)
    const lowerMsg = message.toLowerCase();
    const knowledgeMatch = customKnowledge.find(k => 
      k.patterns.some(p => lowerMsg.includes(p))
    );

    if (knowledgeMatch) {
      responseContent += knowledgeMatch.answer[lang] + "\n\n";
      
      // If knowledge item has suggested tools, fetch them
      if (knowledgeMatch.suggestedTools) {
        const tools = knowledgeMatch.suggestedTools
          .map(id => getToolByIdWithContext(id))
          .filter(t => t !== null);
          
        if (tools.length > 0) {
          responseContent += `${templates.toolsIntro}\n\n`;
          tools.forEach((item) => {
            if (item) {
              responseContent += `- [${item.tool.title}](/calculator/${item.tool.id})\n`;
              responseContent += `  ${item.tool.description}\n`;
            }
          });
        }
      }

      // Add a short next-step suggestion (category-neutral, language-aware)
      responseContent += `\n${templates.nextStep}\n\n`;
      responseContent += `${buildNextStepSuggestion(message, lang)}\n`;
      
      return NextResponse.json({ role: 'assistant', content: responseContent });
    }

    // 0.5 Formula Knowledge (Formula + basic calculation)
    // 0.4 Math solver (expressions + equations + steps)
    const mathSolveResponse = tryBuildMathSolveResponse(message, lang);
    if (mathSolveResponse) {
      let fullResponse = mathSolveResponse;
      fullResponse += `\n\n${templates.nextStep}\n\n`;
      fullResponse += `${buildNextStepSuggestion(message, lang)}\n`;
      return NextResponse.json({ role: 'assistant', content: fullResponse });
    }

    // 0.5 Formula Knowledge (Formula + basic calculation)
    const formulaResponse = tryBuildFormulaResponse(message, lang);
    if (formulaResponse) {
      let fullResponse = formulaResponse;
      fullResponse += `\n\n${templates.nextStep}\n\n`;
      fullResponse += `${buildNextStepSuggestion(message, lang)}\n`;
      return NextResponse.json({ role: 'assistant', content: fullResponse });
    }

    // 1. Search for relevant tools (Calculators)
    let relevantTools = searchToolsWithContext(message);

    // 2. Search for relevant blog content
    const relevantBlogs = searchBlogs(message);

    // If the best-matching blog is for a specific tool, prioritize that tool in suggestions.
    const blogToolId = relevantBlogs[0]?.post?.toolId;
    if (blogToolId) {
      const blogTool = getToolByIdWithContext(blogToolId);
      if (blogTool) {
        const exists = relevantTools.some((t) => t.tool.id === blogTool.tool.id);
        if (!exists) {
          relevantTools = [blogTool, ...relevantTools];
        } else {
          // Move it to front
          relevantTools = [blogTool, ...relevantTools.filter((t) => t.tool.id !== blogTool.tool.id)];
        }
      }
    }

    // 3. Construct the response locally
    if (relevantBlogs.length > 0) {
      const topBlog = relevantBlogs[0];
      responseContent += `${templates.blogIntro}\n\n`;
      responseContent += `${topBlog.matchingParagraph}\n\n`;
    }

    if (relevantTools.length > 0) {
      responseContent += `${templates.toolsIntro}\n\n`;
      relevantTools.forEach(({ tool, subcategoryName }) => {
        // IMPORTANT: Keep links outside **bold** so our lightweight renderer keeps them clickable.
        responseContent += `- [${tool.title}](/calculator/${tool.id})\n`;
        responseContent += `  ${tool.description}\n`;
        responseContent += `  _${templates.category}: ${subcategoryName}_\n`;
      });

      responseContent += `\n${templates.nextStep}\n\n`;
      responseContent += `${buildNextStepSuggestion(message, lang)}\n`;
    }

    if (relevantBlogs.length === 0 && relevantTools.length === 0) {
      responseContent = templates.fallback;
      responseContent += `\n\n${templates.nextStep}\n\n`;
      responseContent += `${buildNextStepSuggestion(message, lang)}\n`;
    }

    return NextResponse.json({ 
      role: 'assistant', 
      content: responseContent
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
