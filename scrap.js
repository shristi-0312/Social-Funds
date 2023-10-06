const fs = require('fs');
const axios = require('axios');
const pdf = require('pdfjs-dist');

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

const pdfUrl = 'https://www.africau.edu/images/default/sample.pdf';
extractWordsFromPDF(pdfUrl)
  .then(words => {
    console.log(words);
  })
  .catch(err => {
    console.error(err.message);
  });