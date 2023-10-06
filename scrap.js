const fs = require('fs');
const axios = require('axios');
const pdf = require('pdfjs-dist');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3030;

async function extractWordsFromPDF(pdfUrl) {
  try {
    const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
    const data = new Uint8Array(response.data);
    const pdfDocument = await pdf.getDocument(data).promise;

    const words = [];

    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();

      textContent.items.forEach(item => {
        words.push(item.str);
      });
    }

    return words;
  } catch (error) {
    throw new Error('Error downloading or processing the PDF:', error);
  }
}

app.get('/extract-words', async (req, res) => {
  const pdfUrl = req.query.pdfUrl;
  if (!pdfUrl) {
    return res.status(400).json({ error: 'Missing pdfUrl query parameter' });
  }

  try {
    const words = await extractWordsFromPDF(pdfUrl);
    res.json({ words });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing the PDF' });
  }
});

app.listen(PORT, () => {
  console.log(`API server is running on port ${PORT}`);
});