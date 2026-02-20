require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/Book');
const User = require('./models/User');
const { adminOnly } = require('./middleware/auth');

const books = [
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', publicationDate: '1960-07-11', description: 'A story of racial injustice and moral growth in the American South, seen through the eyes of young Scout Finch.', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg', rating: 4.8, totalRatings: 5200, readCount: 1205, pages: 324, publisher: 'J.B. Lippincott' },
  { title: '1984', author: 'George Orwell', genre: 'Science Fiction', publicationDate: '1949-06-08', description: 'A dystopian novel about totalitarianism, surveillance, and the manipulation of truth in a terrifying future society.', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657781256i/61439040.jpg', rating: 4.7, totalRatings: 6700, readCount: 2341, pages: 328, publisher: 'Secker & Warburg' },
  { title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance', publicationDate: '1813-01-28', description: 'A witty exploration of love, marriage, and society through the Bennet family in Georgian-era England.', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg', rating: 4.6, totalRatings: 4500, readCount: 987, pages: 432, publisher: 'T. Egerton' },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction', publicationDate: '1925-04-10', description: 'A portrait of the Jazz Age that explores wealth, obsession, and the elusive American Dream.', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg', rating: 4.5, totalRatings: 5400, readCount: 1543, pages: 180, publisher: "Scribner's" },
  { title: "Harry Potter and the Sorcerer's Stone", author: 'J.K. Rowling', genre: 'Fantasy', publicationDate: '1997-06-26', description: 'The beloved first adventure of young wizard Harry Potter at Hogwarts School of Witchcraft and Wizardry.', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1598823299i/42844155.jpg', rating: 4.9, totalRatings: 8800, readCount: 3456, pages: 309, publisher: 'Bloomsbury' },
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', publicationDate: '1937-09-21', description: "Bilbo Baggins's unexpected journey with a company of dwarves to reclaim a dragon's hoard.", coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg', rating: 4.7, totalRatings: 7600, readCount: 2234, pages: 310, publisher: 'George Allen & Unwin' },
  { title: 'The Catcher in the Rye', author: 'J.D. Salinger', genre: 'Fiction', publicationDate: '1951-07-16', description: "Holden Caulfield's cynical journey through New York after being expelled from prep school.", coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg', rating: 4.3, totalRatings: 3400, readCount: 876, pages: 234, publisher: 'Little, Brown' },
  { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', genre: 'Fantasy', publicationDate: '1954-07-29', description: 'An epic quest to destroy the One Ring and save Middle-earth from the dark lord Sauron.', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1566425108i/33.jpg', rating: 4.8, totalRatings: 9900, readCount: 2987, pages: 1178, publisher: 'George Allen & Unwin' },
  { title: 'The Book Thief', author: 'Markus Zusak', genre: 'Historical Fiction', publicationDate: '2005-09-01', description: 'Narrated by Death, a story of a young girl stealing books in Nazi Germany.', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1522157426i/19063.jpg', rating: 4.6, totalRatings: 5600, readCount: 1432, pages: 552, publisher: 'Picador' },
  { title: 'Brave New World', author: 'Aldous Huxley', genre: 'Science Fiction', publicationDate: '1932-01-01', description: 'A chilling vision of a future where humans are engineered and conditioned for social stability.', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1575509280i/5129.jpg', rating: 4.4, totalRatings: 4300, readCount: 1654, pages: 311, publisher: 'Chatto & Windus' },
  { title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Fiction', publicationDate: '1988-01-01', description: "A shepherd's magical journey across Egypt in search of treasure and his Personal Legend.", coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1483412266i/865.jpg', rating: 4.5, totalRatings: 6500, readCount: 1876, pages: 208, publisher: 'HarperCollins' },
  { title: 'The Hunger Games', author: 'Suzanne Collins', genre: 'Young Adult', publicationDate: '2008-09-14', description: 'In a dystopian future, Katniss Everdeen must fight for her life in a televised death match.', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1586722975i/2767052.jpg', rating: 4.8, totalRatings: 7900, readCount: 2456, pages: 374, publisher: 'Scholastic Press' },
  { title: 'Gone Girl', author: 'Gillian Flynn', genre: 'Mystery', publicationDate: '2012-06-05', description: 'On their fifth wedding anniversary, Amy Dunne disappears and her husband becomes the prime suspect.', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1554086139i/19288043.jpg', rating: 4.6, totalRatings: 5700, readCount: 1876, pages: 415, publisher: 'Crown Publishing' },
  { title: 'The Kite Runner', author: 'Khaled Hosseini', genre: 'Historical Fiction', publicationDate: '2003-05-29', description: 'A story of friendship, betrayal, and redemption set against the backdrop of Afghanistan.', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1579036753i/77203.jpg', rating: 4.7, totalRatings: 5400, readCount: 1543, pages: 371, publisher: 'Riverhead Books' },
  { title: 'The Handmaid\'s Tale', author: 'Margaret Atwood', genre: 'Science Fiction', publicationDate: '1985-01-01', description: 'In a totalitarian theocracy, a woman struggles to maintain her identity as a child-bearing slave.', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1578028274i/38447.jpg', rating: 4.6, totalRatings: 5400, readCount: 1654, pages: 311, publisher: 'McClelland and Stewart' },
  { title: 'Jane Eyre', author: 'Charlotte Brontë', genre: 'Romance', publicationDate: '1847-10-16', description: 'Orphaned Jane Eyre grows into a strong-willed woman who falls for the brooding Mr. Rochester.', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1557343311i/10210.jpg', rating: 4.7, totalRatings: 5700, readCount: 1098, pages: 507, publisher: 'Smith, Elder & Co.' },
  { title: 'Fahrenheit 451', author: 'Ray Bradbury', genre: 'Science Fiction', publicationDate: '1953-10-19', description: 'In a future where books are banned, a fireman whose job is to burn them begins to question everything.', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1383718290i/13079982.jpg', rating: 4.6, totalRatings: 4600, readCount: 1234, pages: 249, publisher: 'Ballantine Books' },
  { title: 'Little Women', author: 'Louisa May Alcott', genre: 'Fiction', publicationDate: '1868-01-01', description: 'Four sisters navigate love, loss, and ambition in Civil War-era New England.', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1562690475i/1934.jpg', rating: 4.5, totalRatings: 3400, readCount: 765, pages: 449, publisher: 'Roberts Brothers' },
  { title: 'Life of Pi', author: 'Yann Martel', genre: 'Adventure', publicationDate: '2001-09-11', description: 'A boy and a Bengal tiger adrift on the Pacific Ocean after a shipwreck.', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1631251689i/4214.jpg', rating: 4.5, totalRatings: 4300, readCount: 1234, pages: 319, publisher: 'Knopf Canada' },
  { title: 'The Da Vinci Code', author: 'Dan Brown', genre: 'Mystery', publicationDate: '2003-03-18', description: 'Robert Langdon races across Europe to unravel a conspiracy hidden in famous works of art.', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1579126898i/968.jpg', rating: 4.3, totalRatings: 6500, readCount: 1765, pages: 454, publisher: 'Doubleday' },
  { title: 'The Chronicles of Narnia', author: 'C.S. Lewis', genre: 'Fantasy', publicationDate: '1950-10-16', description: 'Seven children discover a magical wardrobe that leads to the wondrous land of Narnia.', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1449868701i/11127.jpg', rating: 4.7, totalRatings: 5400, readCount: 1987, pages: 767, publisher: 'Geoffrey Bles' },
  { title: 'Wuthering Heights', author: 'Emily Brontë', genre: 'Romance', publicationDate: '1847-12-01', description: 'The passionate and destructive love between Heathcliff and Catherine on the Yorkshire moors.', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1587772643i/6185.jpg', rating: 4.4, totalRatings: 3200, readCount: 654, pages: 416, publisher: 'Thomas Cautley Newby' },
  { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', genre: 'Mystery', publicationDate: '2005-08-01', description: 'A disgraced journalist and a hacker investigate a decades-old disappearance in a wealthy Swedish family.', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327868566i/2429135.jpg', rating: 4.5, totalRatings: 6800, readCount: 1987, pages: 465, publisher: 'Norstedts' },
  { title: 'The Road', author: 'Cormac McCarthy', genre: 'Science Fiction', publicationDate: '2006-09-26', description: 'A father and son journey through a post-apocalyptic America, clinging to survival and love.', coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1600241424i/6288.jpg', rating: 4.4, totalRatings: 3400, readCount: 876, pages: 287, publisher: 'Alfred A. Knopf' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookhub');
    console.log('Connected to MongoDB');

    await Book.deleteMany({});
    await User.deleteMany({});

    await Book.insertMany(books);
    console.log(`  Inserted ${books.length} books`);

    await User.create({ username: 'mariam', email: 'mariam@bookhub.com', password: 'admin123', role: 'admin' });
    await User.create({ username: 'reader', email: 'reader@bookhub.com', password: 'reader123', role: 'user' });
    console.log('  Created test users');
    console.log('   Admin  → admin@bookhub.com  / admin123');
    console.log('   Reader → reader@bookhub.com / reader123');

    process.exit(0);
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
