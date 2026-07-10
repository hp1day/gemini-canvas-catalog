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

    // 1. Fetch files list from the GCS bucket to find the best match dynamically
    const bucket = storage.bucket(bucketName);
    
    // We fetch from both prefixes: 'plygem/' and 'Cornerstone PDFs/'
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
      .filter((token: string) => token.length > 2); // only matching tokens with length > 2

    let bestFile = null;
    let maxScore = 0;

    for (const file of allFiles) {
      const fileNameLower = file.name.toLowerCase();
      let score = 0;
      
      for (const token of searchTokens) {
        if (fileNameLower.includes(token)) {
          score += 1;
          // Reward exact folder/product brand matches
          if (fileNameLower.includes(`/${token}`)) score += 2;
        }
      }

      if (score > maxScore) {
        maxScore = score;
        bestFile = file;
      }
    }

    let pdfBuffer: Buffer | null = null;
    let groundedSource = null;

    // 3. Download the single most relevant PDF (if match exists)
    if (bestFile && maxScore > 0) {
      console.log(`Matched grounded document: ${bestFile.name} (Score: ${maxScore})`);
      const [buffer] = await bestFile.download();
      pdfBuffer = buffer;
      // Get nice display name
      groundedSource = bestFile.name.split('/').pop() || bestFile.name;
    }

    // 4. Construct content parts for Gemini Vertex AI
    const systemPrompt = `You are the expert, certified technical engineering AI assistant for Cornerstone Building Brands and Ply Gem products.
You assist builders, contractors, architects, and specifiers with 100% accurate, precise, and highly detailed technical facts.

INSTRUCTIONS:
1. Ground your answer in the attached PDF document if one is provided.
2. Rely strictly on the real tables, specifications, wind-load capacity, U-factor, snow-load calculations, warranty coverage periods, or installation sequences found within the document.
3. If no document is attached, or if the document doesn't contain the specific detail, answer using your general knowledge about Cornerstone, Ply Gem, Variform, or Simonton systems, but clearly specify what is general knowledge.
4. Format your output professionally with clean Markdown:
   - Use bold headers and subheaders.
   - Present comparative specifications or measurements in structured Markdown tables.
   - Use bold bullet points to delineate steps or parameters.
5. Do NOT make up metrics. If the document is attached, cite details with direct reference to the spec sheets.`;

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

    if (pdfBuffer) {
      // Limit file size to 15MB to prevent API payload errors
      if (pdfBuffer.length > 15 * 1024 * 1024) {
        console.warn(`Attached PDF is too large (${pdfBuffer.length} bytes), truncating or sending text...`);
        pdfBuffer = pdfBuffer.subarray(0, 15 * 1024 * 1024);
      }
      
      currentParts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: pdfBuffer.toString('base64')
        }
      });
    }

    contents.push({
      role: 'user',
      parts: currentParts
    });

    // 5. Query Gemini 2.5 Flash
    const model = vertexAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const response = await model.generateContent({ contents });
    
    const responseText = response.response?.candidates?.[0]?.content?.parts?.[0]?.text || 
                         'I encountered an issue analyzing the documents. Please try a different query.';

    return NextResponse.json({
      text: responseText,
      groundedSource,
      matchedScore: maxScore
    });

  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return NextResponse.json({ 
      error: 'Failed to process AI query',
      details: error.message 
    }, { status: 500 });
  }
}
