const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const generic = (request, response) => {
  const endpoint = request.url;
  const extension = endpoint.split('.')[1];
  const fileType = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    json: 'application/json',
    ico: 'image/x-icon',
    png: 'image/png',
    jpg: 'image/jpg',
  };

  const filePath = path.join(__dirname, '..', endpoint);
  fs.readFile(filePath, (error, file) => {
    if (error) {
      console.log(error);
    } else {
      response.writeHead(200, { 'Content-Type': fileType[extension] });
      response.end(file);
    }
  });
};

const router = (request, response) => {
  const endpoint = request.url;
  const requestMethod = request.method;
  console.log(endpoint);

  if (endpoint === '/') {
    const filePath = path.join(__dirname, '..', 'public', 'index.html');
    fs.readFile(filePath, (error, file) => {
      if (error) {
        console.log(error);
      } else {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(file);
      }
    });
  } else if (endpoint.includes('public')) {
    generic(request, response);
  } else if (endpoint === '/posts') {
    const filePath = path.join(__dirname, 'posts.json');
    fs.readFile(filePath, (error, file) => {
      if (error) {
        console.log(error);
      } else {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(file);
      }
    });
  } else if (endpoint === '/create-post' && requestMethod === 'POST') {
    let allData = '';
    request.on('data', (chunkData) => {
      allData += chunkData;
    });
    request.on('end', () => {
      const convertData = querystring.parse(allData);
      const filePath = path.join(__dirname, 'posts.json');
      fs.readFile(filePath, (error, file) => {
        if (error) {
          console.log(error);
        } else {
          const oldPosts = JSON.parse(file);
          const newPosts = {
            ...oldPosts,
            [Date.now()]: convertData.post
          };
          fs.writeFile(filePath, JSON.stringify(newPosts), (error) => {
            if (error) {
              response.writeHead(500, { 'Content-Type': 'Text/html' });
              response.write('<h1> Error 500: Internal Server Error');
              response.end();
            } else {
              response.writeHead(302, { Location: '/' });
              response.end();
            }
          });
        }
      });
    });
  } else {
    response.writeHead(404, { 'Content-Type': 'text/html' });
    response.end('<h1>Page Not Found!</h1>');
  }
};

module.exports = {router};
