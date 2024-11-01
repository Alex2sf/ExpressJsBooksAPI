const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

let database;

// Menghubungkan ke MongoDB saat server dijalankan
MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        database = client.db('mydatabase');
        console.log("Connection Successful");
    })
    .catch(error => console.error("Connection failed:", error));

// Route untuk halaman utama
app.get('/', (req, res) => {
    res.send('Welcome to MongoDB API');
});

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

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
