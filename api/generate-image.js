// /api/generate-image.js

// Using the official Replicate Node.js client for convenience
import Replicate from "replicate";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  // Use your new, secret API key from environment variables
  // The user will set this in their hosting provider (e.g., Vercel)
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    const { prompt, negative_prompt, num_inference_steps, guidance_scale } = req.body;

    // The model we will use from Replicate's library
    const model = "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";
    
    // The input parameters for the model
    const input = {
      prompt: prompt,
      negative_prompt: negative_prompt,
      num_inference_steps: parseInt(num_inference_steps, 10),
      guidance_scale: parseFloat(guidance_scale),
    };

    // Run the model and wait for the output
    const output = await replicate.run(model, { input });

    // Replicate returns an array of image URLs, we'll take the first one
    if (output && output.length > 0) {
      res.status(200).json({ imageUrl: output[0] });
    } else {
      throw new Error("Failed to get image from Replicate.");
    }

  } catch (error) {
    console.error("Replicate API Error:", error);
    res.status(500).json({ message: 'An error occurred while generating the image.', details: error.message });
  }
}
