// /api/generate-image.js (Updated with a faster model)

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

    // NEW: Using a faster "Turbo" model designed for speed
    const model = "stability-ai/sd-turbo:a3615176b5354922f51f5436814316124578f14a601662a48841b539a243463c";
    
    // Turbo models use fewer steps and different guidance settings
    const input = {
      prompt: prompt,
      // NOTE: This turbo model does not use negative_prompt, steps, or guidance.
      // We still get them from the UI but don't pass them to this specific model.
    };

    const output = await replicate.run(model, { input });

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
