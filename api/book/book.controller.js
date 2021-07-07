const { getBooksByVolumeId, getBooksByTitle } = require('../book/book.service');

module.exports.getBookById = async (req, res) => {
  if (req.params.volumeId) {
    const book = await getBooksByVolumeId(req.params.volumeId);

    res.json(book.data);
  }
};

module.exports.searchForBooks = async (req, res) => {
  if (req.query.title) {
    const books = await getBooksByTitle(req.query.title);

    res.json(books.data.items.slice(0, 100));
  }
};
