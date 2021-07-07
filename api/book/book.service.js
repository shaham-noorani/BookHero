const axios = require('axios');

module.exports.getBookByVolumeId = async (volumeId) => {
  const url = `https://www.googleapis.com/books/v1/volumes/${volumeId}?country=US`;

  return await axios.get(url);
};

module.exports.getBooksByTitle = async (searchTerm) => {
  const url = `https://www.googleapis.com/books/v1/volumes?country=US&q=${searchTerm}`;

  return await axios.get(url);
};
