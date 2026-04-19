// readify/backend/seedBooks.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Book = require('./models/Book');
const Category = require('./models/Category');

const loremIpsum = `
  "A beginning is the time for taking the most delicate care that the balances are correct." The old man sighed, closing the book. His grandson, who had been sitting patiently by his side, looked up with curiosity. "Grandpa, what did that mean?" The old man smiled, his eyes twinkling. "It means, my dear, that every story, every life, and every journey starts with a single, crucial step. And you must be very careful with that first step." He pointed to the cover of the book: "Dune." The boy's eyes widened. "Is this a new story for me?" "No," the old man said, a little sadly. "It's the oldest story of all."

  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

  Curabitur pretium tincidunt lacus. Nulla facilisi. Aenean sit amet nisl vitae magna semper consectetur. Sed eu sem in nibh consequat mollis. In hac habitasse platea dictumst. Curabitur vel quam a sem interdum tempus. Donec euismod sapien non sapien mollis, sed euismod sapien non sapien mollis.
`;

const books = [
  {
    title: 'Dune',
    author: 'Frank Herbert',
    price: 12.50,
    description: 'A science fiction epic set in a feudal interstellar society on the desert planet Arrakis.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/71Y7y6Q-WjL._AC_UF1000,1000_QL80_.jpg',
    stock: 30,
    category: 'Science Fiction',
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    price: 11.25,
    description: 'The prelude to The Lord of the Rings, following Bilbo Baggins on his quest.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/71P4q0H86LL._AC_UF1000,1000_QL80_.jpg',
    stock: 40,
    category: 'Fantasy',
  },
  {
    title: 'Circe',
    author: 'Madeline Miller',
    price: 13.50,
    description: 'A novel that retells the story of the mythological sorceress Circe.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/81P7oD76xIL._AC_UF1000,1000_QL80_.jpg',
    stock: 40,
    category: 'Fantasy',
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    price: 15.75,
    description: 'A memoir of a young woman who, kept out of school, leaves her family to pursue education.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/81nC4y57AIL._AC_UF1000,1000_QL80_.jpg',
    stock: 35,
    category: 'Memoir',
  },
  {
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    price: 10.50,
    description: 'A gripping psychological thriller about a psychotherapist and his seemingly perfect patient.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/8157V-MizJL._AC_UF1000,1000_QL80_.jpg',
    stock: 20,
    category: 'Thriller',
  },
  {
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    price: 14.00,
    description: 'A young woman who has raised herself in the marshes of the deep South becomes a suspect in a murder.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/81xU-Bv5HqL._AC_UF1000,1000_QL80_.jpg',
    stock: 25,
    category: 'Mystery',
  },
  {
    title: 'The Giver',
    author: 'Lois Lowry',
    price: 8.99,
    description: 'A dystopian novel about a boy who is selected to inherit the memories of his community.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/71wLp0I3LCL._AC_UF1000,1000_QL80_.jpg',
    stock: 55,
    category: 'Dystopian',
  },
  {
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    price: 9.50,
    description: 'A dystopian novel in which a fireman burns books rather than putting out fires.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/61b-9fK44pL._AC_UF1000,1000_QL80_.jpg',
    stock: 50,
    category: 'Science Fiction',
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    price: 7.25,
    description: 'A novel about the enigmatic millionaire Jay Gatsby and his unrequited love for Daisy Buchanan.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/71+0K3jTf7L._AC_UF1000,1000_QL80_.jpg',
    stock: 30,
    category: 'Classic',
  },
  {
    title: 'The Four Agreements',
    author: 'Don Miguel Ruiz',
    price: 11.50,
    description: 'A practical guide to personal freedom based on ancient Toltec wisdom.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/51rR5gV5N6L._AC_UF1000,1000_QL80_.jpg',
    stock: 20,
    category: 'Self-Help',
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    price: 10.99,
    description: 'A novel about the issues of race and prejudice in the deep South.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/71t2jj68CXL._UF1000,1000_QL80_.jpg',
    stock: 45,
    category: 'Classic',
  },
  {
    title: 'The Bell Jar',
    author: 'Sylvia Plath',
    price: 12.00,
    description: 'A semi-autobiographical novel about a young woman\'s descent into mental illness.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/812nGlXCWwL.jpg',
    stock: 35,
    category: 'Classic',
  },
  {
    title: 'It Ends with Us',
    author: 'Colleen Hoover',
    price: 15.00,
    description: 'A poignant novel about a woman caught between a new love and her troubled past.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/817vqET828L._UF1000,1000_QL80_.jpg',
    stock: 50,
    category: 'Romance',
  },
  {
    title: 'The Stand',
    author: 'Stephen King',
    price: 18.00,
    description: 'An epic novel of good versus evil in a post-apocalyptic world.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/81LTcWSIgkL._UF1000,1000_QL80_.jpg',
    stock: 25,
    category: 'Horror',
  },
  {
    title: 'Frankenstein',
    author: 'Mary Shelley',
    price: 8.50,
    description: 'A timeless tale of ambition, creation, and the consequences of playing God.',
    content: loremIpsum,
    coverImage: 'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781982146177/frankenstein-9781982146177_hr.jpg',
    stock: 60,
    category: 'Classic',
  },
  {
    title: 'A Little Life',
    author: 'Hanya Yanagihara',
    price: 16.50,
    description: 'A heartbreaking story of four college friends and their complex lives in New York City.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/71If19m2RXL._UF1000,1000_QL80_.jpg',
    stock: 20,
    category: 'Fiction',
  },
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    price: 13.99,
    description: 'A story that explores the choices that make up a life.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/81J6APjwxlL._UF1000,1000_QL80_.jpg',
    stock: 40,
    category: 'Fantasy',
  },
  {
    title: 'Before the Coffee Gets Cold',
    author: 'Toshikazu Kawaguchi',
    price: 12.00,
    description: 'A charming story set in a cafe that allows customers to travel through time.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/71uUY42uNsL.jpg',
    stock: 30,
    category: 'Fiction',
  },
  {
    title: 'Verity',
    author: 'Colleen Hoover',
    price: 11.00,
    description: 'A psychological thriller that will keep you guessing until the very end.',
    content: loremIpsum,
    coverImage: 'https://img3.od-cdn.com/ImageType-100/0017-1/%7B8A1707C6-9FC9-43B4-B4B1-0492E651145A%7DIMG100.JPG',
    stock: 55,
    category: 'Thriller',
  },
  {
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    price: 14.50,
    description: 'A beautiful retelling of the Trojan War and the love between Achilles and Patroclus.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/81msb6gUBTL.jpg',
    stock: 25,
    category: 'Fantasy',
  },
  {
    title: 'Outliers',
    author: 'Malcolm Gladwell',
    price: 17.00,
    description: 'An exploration of what makes high-achievers successful.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/61sDFu75vAS._UF1000,1000_QL80_.jpg',
    stock: 35,
    category: 'Non-Fiction',
  },
  {
    title: 'The Da Vinci Code',
    author: 'Dan Brown',
    price: 10.00,
    description: 'A conspiracy thriller novel filled with historical and religious puzzles.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/71y4X5150dL.jpg',
    stock: 45,
    category: 'Thriller',
  },
  {
    title: 'The Hunger Games',
    author: 'Suzanne Collins',
    price: 9.99,
    description: 'In a dystopian future, a young girl volunteers to take her sister\'s place in a deadly televised game.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/71WSzS6zvCL._UF1000,1000_QL80_.jpg',
    stock: 60,
    category: 'Dystopian',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 16.00,
    description: 'An easy and proven way to build good habits and break bad ones.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/81F90H7hnML.jpg',
    stock: 50,
    category: 'Self-Help',
  },
  {
    title: 'The Kite Runner',
    author: 'Khaled Hosseini',
    price: 13.00,
    description: 'The story of a young boy in Afghanistan and a powerful tale of friendship and betrayal.',
    content: loremIpsum,
    coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1541428344i/17165596.jpg',
    stock: 30,
    category: 'Fiction',
  },
  {
    title: 'Harry Potter',
    author: 'J.K. Rowling',
    price: 19.99,
    description: 'The first book in the series, introducing the world of wizardry and magic.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/81q77Q39nEL._UF350,350_QL50_.jpg',
    stock: 35,
    category: 'Fantasy',
  },
  {
    title: 'Think and Grow Rich',
    author: 'Napoleon Hill',
    price: 9.00,
    description: 'One of the best-selling self-help books of all time, focusing on the power of thought.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/61bfj+-wArL._UF1000,1000_QL80_.jpg',
    stock: 40,
    category: 'Self-Help',
  },
  {
    title: 'The Road',
    author: 'Cormac McCarthy',
    price: 11.00,
    description: 'A post-apocalyptic tale of a father and his son trying to survive.',
    content: loremIpsum,
    coverImage: 'https://ik.imagekit.io/panmac/india/tr:f-auto,di-placeholder_portrait_aMjPtD9YZ.jpg,w-270/edition/9781035003792.jpg',
    stock: 25,
    category: 'Dystopian',
  },
  {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    price: 24.99,
    description: 'An epic high fantasy novel by English author and scholar J. R. R. Tolkien.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/81j4C6j3dRL._UF1000,1000_QL80_.jpg',
    stock: 15,
    category: 'Fantasy',
  },
  {
    title: 'The Secret History',
    author: 'Donna Tartt',
    price: 14.50,
    description: 'A story of a group of classics students at an elite New England college and the murder that unfolds.',
    content: loremIpsum,
    coverImage: 'https://m.media-amazon.com/images/I/81YhQfeiynL.jpg',
    stock: 20,
    category: 'Fiction',
  }
];

const seedBooks = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding.');

    await Book.deleteMany({});
    await Category.deleteMany({});

    const categories = [...new Set(books.map(b => b.category))];
    const categoryDocs = await Promise.all(
      categories.map(name => Category.create({ name }))
    );

    const booksToInsert = books.map(book => {
      const cat = categoryDocs.find(c => c.name === book.category);
      const randomRating = (Math.random() * 1.5 + 3.5).toFixed(1);
      const randomReviews = Math.floor(Math.random() * 10000 + 1000);
      return { 
        ...book, 
        category: cat?._id,
        rating: randomRating,
        numReviews: randomReviews
      };
    });

    await Book.insertMany(booksToInsert);

    console.log('Database seeded successfully with sample books.');
    process.exit(0);

  } catch (err) {
    console.error('Error seeding books:', err);
    process.exit(1);
  }
};

seedBooks();
