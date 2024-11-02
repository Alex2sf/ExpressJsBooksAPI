const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
app.use(cors())
app.use(express.json());


let database;


const options ={
    definition : {
        openapi :'3.0.0',
        info : {
            title : 'Node JS API Project for Mongodb',
            version : '1.0.0'

        },
        servers : [
            {
              url : 'http://localhost:8080/'
            }
        ]
    },
    apis : ['./mongodb.js']
}

const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
// Menghubungkan ke MongoDB saat server dijalankan
MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        database = client.db('mydatabase');
        console.log("Connection Successful");
    })
    .catch(error => console.error("Connection failed:", error));


    /**
 * @swagger
 * /:
 *   get:
 *     summary: This api is used to check if get method is working or not
 *     description: This api is used to check if get method is working or not
 *     responses:
 *       200:
 *         description: To test Get method
 */
// Route untuk halaman utama
app.get('/', (req, res) => {
    res.send('Welcome to MongoDB API');
});


/**
 * @swagger
 * components:
 *   schema:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 */


/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: To get all books from mongodb
 *     description: this api is used to fetch data from mongodb
 *     responses:
 *       200:
 *         description: this api is used to fetch data from mongodb
 *         content:
 *           application/json:
 *                  schema :
 *                      type : array    
 *                      items :
 *                            $ref : '#components/schema/Book'    
 */
// Mendapatkan semua buku
app.get('/api/books', async (req, res) => {
    try {
        const books = await database.collection('books').find({}).toArray();
        res.send(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).send("Error fetching books");
    }
});


/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: To get all books from mongodb
 *     description: this api is used to fetch data from mongodb
 *     parameters:
 *           - in: path
 *             name: id
 *             required: true
 *             description: Numeric ID required
 *             schema:
 *                       type: integer 
 *     responses:
 *       200:
 *         description: this api is used to fetch data from mongodb
 *         content:
 *           application/json:
 *                  schema :
 *                      type : array    
 *                      items :
 *                            $ref : '#components/schema/Book'    
 */
// Mendapatkan buku berdasarkan ID
app.get('/api/books/:id', async (req, res) => {
    try {
        const book = await database.collection('books').findOne({ id: parseInt(req.params.id) });
        if (book) res.send(book);
        else res.status(404).send("Book not found");
    } catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).send("Error fetching book");
    }
});


/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: To update a book by ID in MongoDB
 *     description: This API is used to update a book's title in MongoDB by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the book to update
 *         schema:
 *           type: integer
 *       - in: body
 *         name: title
 *         required: true
 *         description: The new title for the book
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Book updated successfully"
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Book not found"
 *       500:
 *         description: Error updating book
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Error updating book"
 */

// Mengupdate buku berdasarkan ID
app.put('/api/books/:id', async (req, resp) => {
    const query = { id: parseInt(req.params.id) };
    const update = { $set: { title: req.body.title } };

    try {
        const result = await database.collection('books').updateOne(query, update);
        if (result.matchedCount > 0) resp.send("Book updated successfully");
        else resp.status(404).send("Book not found");
    } catch (error) {
        console.error("Error updating book:", error);
        resp.status(500).send("Error updating book");
    }
});
/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book by ID from MongoDB
 *     description: This API is used to delete a book from MongoDB using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the book to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Book is deleted"
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Book not found"
 *       500:
 *         description: Error deleting book
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Error deleting book"
 */

// Menghapus buku berdasarkan ID
app.delete('/api/books/:id', async (req, resp) => {
    try {
        const result = await database.collection('books').deleteOne({ id: parseInt(req.params.id) });
        if (result.deletedCount > 0) resp.send('Book is deleted');
        else resp.status(404).send("Book not found");
    } catch (error) {
        console.error("Error deleting book:", error);
        resp.status(500).send("Error deleting book");
    }
});

/**
 * @swagger
 * /api/books/addBook:
 *   post:
 *     summary: Add a new book to MongoDB
 *     description: This API is used to add a new book to MongoDB. The book ID is auto-generated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the book
 *                 example: "New Book Title"
 *     responses:
 *       200:
 *         description: Book added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Added Successfully"
 *       500:
 *         description: Error adding book
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Error adding book"
 */
// Menambahkan buku baru
app.post('/api/books/addBook', async (req, resp) => {
    try {
        const lastBook = await database.collection('books').find({}).sort({ id: -1 }).limit(1).toArray();
        const newId = lastBook.length > 0 ? lastBook[0].id + 1 : 1;
        const book = { id: newId, title: req.body.title };
        
        await database.collection('books').insertOne(book);
        resp.send("Added Successfully");
    } catch (error) {
        console.error("Error adding book:", error);
        resp.status(500).send("Error adding book");
    }
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
