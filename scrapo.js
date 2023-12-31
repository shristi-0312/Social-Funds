const fs = require('fs');
const axios = require('axios');
const pdf = require('pdfjs-dist');
const express = require('express');
const request = require('request');
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
  const compData = req.query.comp;
  if (!pdfUrl) {
    return res.status(400).json({ error: 'Missing pdfUrl query parameter' });
  }

  try {
    const words = await extractWordsFromPDF(pdfUrl);
    const prompt = 'Create a short proposal to be sent via email for ' + compData + ' to sponsor their CSR funds at our event.\n\nEvent Details - ' + words;

    request({
      method: 'POST',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ''
      },
      body: {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt,}
        ],
        temperature: 1,
        max_tokens: 1500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      },
      json: true
    }, function (error, response, body) {
      if (error) throw new Error(error);

      res.json({body});
    });

  //  res.json({prompt});

  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing the PDF' });
  }
});

const options = {
  method: 'POST',
  url: 'https://api.openai.com/v1/chat/completions',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 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'
  },
  body: {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello!' }
    ],
    temperature: 1,
    max_tokens: 50,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  },
  json: true
};

app.listen(PORT, () => {
  console.log(`API server is running on port ${PORT}`);
});