import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { VertexAI } from '@google-cloud/vertexai';

// Initialize Cloud Storage client (Application Default Credentials)
const storage = new Storage();
const bucketName = 'conerstonepartlib';

// Initialize Vertex AI client with target region
const vertexAI = new VertexAI({ 
  project: 'proddb-332000', 
  location: 'us-central1' 
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, history } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required.' }, { status: 400 });
    }

    // 1. Fetch files list from the GCS bucket dynamically
    const bucket = storage.bucket(bucketName);
    
    // Fetch from both prefixes: 'plygem/' and 'Cornerstone PDFs/'
    const [plygemFiles] = await bucket.getFiles({ prefix: 'plygem/' });
    const [cornerstoneFiles] = await bucket.getFiles({ prefix: 'Cornerstone PDFs/' });
    
    const allFiles = [...plygemFiles, ...cornerstoneFiles].filter(file => 
      file.name.toLowerCase().endsWith('.pdf')
    );

    // 2. Score files based on query keyword matches
    const searchTokens = query
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((token: string) => token.length > 2); // only match tokens with length > 2

    const scoredFiles = allFiles.map(file => {
      const fileNameLower = file.name.toLowerCase();
      let score = 0;
      
      for (const token of searchTokens) {
        if (fileNameLower.includes(token)) {
          score += 1;
          // Bonus score for matching whole words or brands
          if (fileNameLower.includes(`/${token}`)) score += 2;
        }
      }

      return {
        file,
        score,
        displayName: file.name.split('/').pop() || file.name,
        fullPath: file.name
      };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

    // Get the top 2 matching files to attach
    const topMatches = scoredFiles.slice(0, 2);

    // Prepare buffers and display names of matched files
    const matchedSources: string[] = [];
    const attachments: { data: string; mimeType: string }[] = [];

    for (const match of topMatches) {
      console.log(`Matched grounded document: ${match.fullPath} (Score: ${match.score})`);
      const [buffer] = await match.file.download();
      
      // Safety limit: Keep individual file size under 12MB to fit overall Vertex request budget
      let attachmentBuffer = buffer;
      if (buffer.length > 12 * 1024 * 1024) {
        console.warn(`Attached PDF ${match.displayName} is too large, truncating...`);
        attachmentBuffer = buffer.subarray(0, 12 * 1024 * 1024);
      }

      attachments.push({
        mimeType: 'application/pdf',
        data: attachmentBuffer.toString('base64')
      });
      matchedSources.push(match.displayName);
    }

    // 3. Generate a comprehensive catalog directory of the GCS bucket to inform Gemini
    const catalogSamples = allFiles
      .map(file => file.name.split('/').pop())
      .filter((name): name is string => typeof name === 'string' && name.endsWith('.pdf'))
      .slice(0, 80) // list first 80 documents to stay within system prompt limits
      .join(', ');

    // 4. Construct content parts for Gemini Vertex AI
    const systemPrompt = `You are the expert, certified technical engineering AI assistant for Cornerstone Building Brands and Ply Gem products.
You assist builders, contractors, architects, and specifiers with 100% accurate, precise, and highly detailed technical facts.

YOUR DATA SOURCE:
You are directly integrated with a Google Cloud Storage bucket (gs://${bucketName}) containing hundreds of technical brochures, catalogs, spec sheets, warranties, and installation manuals.

Below is a catalog index of some available documents in your storage bucket:
${catalogSamples}

INSTRUCTIONS:
1. Ground your answer in the attached PDF documents if any are provided.
2. Rely strictly on the real tables, specifications, wind-load capacity, U-factor, snow-load calculations, warranty coverage periods, or installation sequences found within the documents.
3. If no documents are attached, or if the attached documents don't contain the specific detail, use your expert knowledge about Cornerstone, Ply Gem, Variform, or Simonton systems, but clearly specify that it is general knowledge. Refer to the catalog above to suggest specific documents they can ask you to read!
4. Format your output professionally with clean Markdown:
   - Use bold headers and subheaders.
   - Present comparative specifications or measurements in structured Markdown tables.
   - Use bold bullet points to delineate steps or parameters.
5. Do NOT make up metrics. Cite details with direct reference to the spec sheets.`;

    const contents: any[] = [];

    // Map conversation history to Vertex AI format
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        contents.push({
          role: turn.sender === 'user' ? 'user' : 'model',
          parts: [{ text: turn.text }]
        });
      }
    }

    // Append current user prompt and PDF inline data
    const currentParts: any[] = [
      { text: `${systemPrompt}\n\nUser Question: ${query}` }
    ];

    // Add multiple PDF attachments if matched
    for (const attachment of attachments) {
      currentParts.push({
        inlineData: attachment
      });
    }

    contents.push({
      role: 'user',
      parts: currentParts
    });

    // 5. Query Gemini 2.5 Pro
    const model = vertexAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    const response = await model.generateContent({ contents });
    
    const responseText = response.response?.candidates?.[0]?.content?.parts?.[0]?.text || 
                         'I encountered an issue analyzing the documents. Please try a different query.';

    return NextResponse.json({
      text: responseText,
      groundedSource: matchedSources.length > 0 ? matchedSources.join(', ') : null,
      matchedScore: topMatches.length > 0 ? topMatches[0].score : 0
    });

  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return NextResponse.json({ 
      error: 'Failed to process AI query',
      details: error.message 
    }, { status: 500 });
  }
}
