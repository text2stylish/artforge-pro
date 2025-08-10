// script.js (Improved Version)
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

            // If the response is not OK, handle it as a potential server error
            if (!response.ok) {
                // Try to get text from the response, which might be the HTML error page
                const errorText = await response.text(); 
                // We throw a custom error with this text
                throw new Error(`Server error (Status: ${response.status}): ${errorText}`);
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
            console.error(error); // Log the full error to the browser console for debugging
            // Display a user-friendly error message. Check if it's a timeout error.
            let userMessage = `An error occurred: ${error.message}`;
            if (error.message.includes("504") || error.message.includes("timeout")) {
                userMessage = "The AI is taking too long to respond (server timeout). Please try again or use fewer inference steps.";
            }
            gallery.innerHTML = `<p style="color:red; font-weight:bold;">${userMessage}</p>`;
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Art';
        }
    }

    artForm.addEventListener('submit', generateImage);
});
