// script.js
document.addEventListener('DOMContentLoaded', () => {
    const artForm = document.getElementById('artForm');
    const resultsSection = document.getElementById('results');
    const gallery = document.getElementById('gallery');
    const generateBtn = document.getElementById('generateBtn');

    // Slider value displays
    const guidanceScale = document.getElementById('guidance_scale');
    const guidanceScaleValue = document.getElementById('guidance_scale_value');
    const steps = document.getElementById('num_inference_steps');
    const stepsValue = document.getElementById('num_inference_steps_value');

    guidanceScale.addEventListener('input', () => guidanceScaleValue.textContent = guidanceScale.value);
    steps.addEventListener('input', () => stepsValue.textContent = steps.value);

    async function generateImage(e) {
        e.preventDefault();
        
        const prompt = document.getElementById('prompt').value.trim();
        if (!prompt) {
            alert('Please enter a prompt.');
            return;
        }

        resultsSection.style.display = 'block';
        gallery.innerHTML = '<div class="loader"></div>';
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating... Please wait...';

        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                    negative_prompt: document.getElementById('negative_prompt').value.trim(),
                    guidance_scale: guidanceScale.value,
                    num_inference_steps: steps.value
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to generate image from the server.');
            }

            const data = await response.json();
            gallery.innerHTML = ''; // Clear loader
            
            const imgPanel = document.createElement('div');
            imgPanel.className = 'art-panel';
            imgPanel.style.backgroundImage = `url(${data.imageUrl})`;
            imgPanel.title = 'Click to view full image';
            imgPanel.onclick = () => window.open(data.imageUrl, '_blank');
            gallery.appendChild(imgPanel);

        } catch (error) {
            console.error(error);
            gallery.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Art';
        }
    }

    artForm.addEventListener('submit', generateImage);
});
              
