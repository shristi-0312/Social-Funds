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
  if (!pdfUrl) {
    return res.status(400).json({ error: 'Missing pdfUrl query parameter' });
  }

  try {
    const words = extractWordsFromPDF(pdfUrl);

    const aiReply = '';

    // request({
    //   method: 'POST',
    //   url: 'https://api.openai.com/v1/chat/completions',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': ''
    //   },
    //   body: {
    //     model: 'gpt-3.5-turbo',
    //     messages: [
    //       { role: 'system', content: 'You are a helpful assistant.' },
    //       { role: 'user', content: 'Hello!' }
    //     ],
    //     temperature: 1,
    //     max_tokens: 50,
    //     top_p: 1,
    //     frequency_penalty: 0,
    //     presence_penalty: 0
    //   },
    //   json: true
    // }, function (error, response, body) {
    //   if (error) throw new Error(error);
    
    //   res.json({ body });
    // });

    res.json({ words });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing the PDF' });
  }
});

app.listen(PORT, () => {
  console.log(`API server is running on port ${PORT}`);
});


// async function extractWordsFromPDF(pdfUrl) {
  //   try {
  //     const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
  //     const data = new Uint8Array(response.data);
  //     const pdfDocument = await pdf.getDocument(data).promise;
  
  //     const words = [];
  
  //     for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
  //       const page = await pdfDocument.getPage(pageNum);
  //       const textContent = await page.getTextContent();
  
  //       textContent.items.forEach(item => {
  //         words.push(item.str);
  //       });
  //     }
  
  //     return words;
  //   } catch (error) {
  //     throw new Error('Error downloading or processing the PDF:', error);
  //   }
  // }


// request(options, function (error, response, body) {
//   if (error) throw new Error(error);

//   console.log(body);
// });

// const options = {
//   method: 'POST',
//   url: 'https://api.openai.com/v1/chat/completions',
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': 'Bearer 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'
//   },
//   body: {
//     model: 'gpt-3.5-turbo',
//     messages: [
//       { role: 'system', content: 'You are a helpful assistant.' },
//       { role: 'user', content: 'Hello!' }
//     ],
//     temperature: 1,
//     max_tokens: 50,
//     top_p: 1,
//     frequency_penalty: 0,
//     presence_penalty: 0
//   },
//   json: true
// };