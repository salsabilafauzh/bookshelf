const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  try {
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;
    if (!name) {
      throw new Error('Gagal menambahkan buku. Mohon isi nama buku');
    }

    if (readPage > pageCount) {
      throw new Error(
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      );
    }

    const id = nanoid(15);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const finished = pageCount === readPage;
    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (!isSuccess) {
      throw new Error('Buku gagal ditambahkan');
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(400);
    return response;
  }
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  const notEmpty = books.filter((book) => Object.keys(book).length > 0);

  if (name) {
    const query = name.toLowerCase();
    filteredBooks = notEmpty.filter((book) => {
      const data = book.name.toLowerCase().split(' ');
      return data.includes(query);
    });
  } else if (reading === '1' || reading === '0') {
    const isRead = reading === '1';
    filteredBooks = notEmpty.filter((book) => book.reading === isRead);
  } else if (finished === '1' || finished === '0') {
    const isfinish = finished === '1';
    filteredBooks = notEmpty.filter((book) => book.finished === isfinish);
  } else {
    filteredBooks = notEmpty.splice(
      (obj, index, self) => self.findIndex((item) => item.name === obj.name) === index,
    );
  }

  const booksResult = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  const response = h.response({
    status: 'success',
    data: {
      books: booksResult,
    },
  });

  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  try {
    const { bookId } = request.params;
    const book = books.filter((n) => n.id === bookId)[0];
    if (!book) {
      throw new Error('Buku tidak ditemukan');
    }
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(404);
    return response;
  }
};

const editBookByIdHandler = (request, h) => {
  try {
    const { bookId } = request.params;
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;

    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;

    const index = books.findIndex((book) => book.id === bookId);

    if (index === -1) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      });
      response.code(404);
      return response;
    }

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(500);
    return response;
  }
};

const deleteBookByIdHandler = (request, h) => {
  try {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);
    if (index === -1) {
      const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      });
      response.code(404);
      return response;
    }
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(500);
    return response;
  }
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
