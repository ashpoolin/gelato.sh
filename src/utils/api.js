export async function sendTransactionData(signature, userAccount) {
    const url = `${process.env.REACT_APP_HNP_API}/parse-transaction`;
    const data = { signature, userAccount };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }