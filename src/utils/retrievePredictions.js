export const retrievePredictions = async (brackets) => {
    const endpoint = 'https://predict-bracket-198844576431.us-east4.run.app';
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({starting_bracket: brackets}),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const updatedBrackets = await response.json();
      console.log(updatedBrackets.results)
      return updatedBrackets.results;
      
    } catch (error) {
      console.error('Error predicting winner:', error);
      throw error;
    }
  };
  