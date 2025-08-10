// /api/generate-image.js (Final Version)

import Replicate from "replicate";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    const { prompt, negative_prompt, guidance_scale, num_inference_steps } = req.body;

    // CORRECTED: Using the official and stable SDXL model from Stability AI.
    // This is one of the most reliable models on the platform.
    const model = "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";
    
    // This model uses all the advanced parameters from your user interface.
    const input = {
      prompt: prompt,
      negative_prompt: negative_prompt,
      num_inference_steps: parseInt(num_inference_steps, 10),
      guidance_scale: parseFloat(guidance_scale),
    };

    const output = await replicate.run(model, { input });

    if (output && output.length > 0) {
      res.status(200).json({ imageUrl: output[0] });
    } else {
      throw new Error("The AI did not return an image. Please try again.");
    }

  } catch (error) {
    console.error("Replicate API Error:", error);
    res.status(500).json({ message: 'An error occurred while generating the image.', details: error.message });
  }
}
