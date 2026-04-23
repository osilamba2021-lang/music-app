// Service to interact with our Netlify Functions (which proxy the Suno API)

export const generateMusic = async (prompt, model, instrumental) => {
  try {
    // Determine customMode based on instrumental
    // If instrumental is true, we must use customMode: true, provide a style and title.
    // Wait, the docs say:
    // "If instrumental is true: style and title are required" (Custom Mode)
    // Actually, "In Non-custom Mode (customMode: false): Only prompt is required regardless of instrumental setting"
    // Wait, let's use customMode: false for simplicity, as it allows generating lyrics based on a prompt.
    // Wait, the docs say: "Only prompt is required regardless of instrumental setting. Lyrics will be auto-generated if instrumental is false."
    // Let's use customMode: false so we don't need to force the user to input a style and title.
    
    const payload = {
      prompt: prompt,
      model: model,
      instrumental: instrumental,
      customMode: false
    };

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    // Some APIs return HTTP 200 but include an error code in the JSON body
    // We need to check if response is not ok, OR if the data.code is not 200, OR if data.data is missing
    if (!response.ok || data.code !== 200 || !data.data) {
      throw new Error(data.msg || data.message || 'Failed to generate music. Check your API key and credits.');
    }

    // Return the taskId
    return data.data.taskId;
  } catch (error) {
    console.error('Error generating music:', error);
    throw error;
  }
};

export const getTaskDetails = async (taskId) => {
  try {
    const response = await fetch(`/api/status?taskId=${taskId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.msg || 'Failed to fetch task status');
    }

    return data.data; // Includes status, response.sunoData, etc.
  } catch (error) {
    console.error('Error fetching task details:', error);
    throw error;
  }
};
