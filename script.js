const https = require('https');
const NodeCache = require('node-cache');

const apiKey = '842fdcd04948ec11f1a2d3818c093f77d0f718ddf1405d4c7a7010beac58f59a';
const url = 'https://open.spotify.com/intl-pt'; 

const apiUrl = `https://www.virustotal.com/vtapi/v2/url/report?apikey=${apiKey}&resource=${url}`;

const cache = new NodeCache({ stdTTL: 300 }); 

function verificarURL(url) {
  return new Promise((resolve, reject) => {
    const cachedResult = cache.get(url);
    if (cachedResult) {
      console.log('Obtendo resultado do cache...');
      resolve(cachedResult);
    } else {
      https.get(apiUrl, (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          const report = JSON.parse(data);
          cache.set(url, report);
          resolve(report);
        });
      }).on('error', (error) => {
        reject(error);
      });
    }
  });
}

verificarURL(apiUrl)
  .then((report) => {
    console.log('Relatório de Análise:');
    console.log(report);
  })
  .catch((error) => {
    console.error('Erro ao enviar a solicitação:', error.message);
  });
