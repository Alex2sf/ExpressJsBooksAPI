const express = require('express')

const app = express()

app.use(express.json())

const books = [
    {title : "Java Programming", id: 1}, 
    {title : "Java Programming", id: 2}, 
    {title : "Java Programming", id: 3}

]

app.get('/', (req,resp) =>{
    resp.send('WElcom to study automation to learn rest api')
})

app.get(('/api/books'), (req, resp)=>{
    resp.send(books)
})

app.get('/api/books/:id', (req, resp) => {
    const book = books.find(v => v.id === parseInt(req.params.id))

    if(!book) resp.status(404).send('books not found')
    resp.send(book)
})

app.post('/api/books/addBook', (req, res) => {
    // Membuat objek buku baru
    const book = {
        // Memberikan ID unik berdasarkan jumlah buku yang sudah ada
        id: books.length + 1,
        // Mengambil judul buku dari permintaan (request body)
        title: req.body.title
    };

    // Menambahkan objek buku baru ke dalam array 'books'
    books.push(book);

    // Mengirimkan respons berupa objek buku yang baru ditambahkan
    res.send(book);
});

app.put('/api/books/:id', (req, res) => {
    // Mencari buku berdasarkan ID yang diberikan dalam URL
    const book = books.find(v => v.id === parseInt(req.params.id));

    // Jika buku tidak ditemukan, kirimkan respons "not found"
    if (!book) {
        return res.status(404).send('Book not found');
    }

    // Update judul buku dengan nilai dari request body
    book.title = req.body.title;

    // Kirimkan respons berisi buku yang telah diupdate
    res.send(book);
});

app.delete('/api/books/:id', (req, res) => {
    // Mencari buku berdasarkan ID yang diberikan dalam URL
    const book = books.find(v => v.id === parseInt(req.params.id));

    // Jika buku tidak ditemukan, kirimkan respons "not found"
    if (!book) {
        return res.status(404).send('Book not found');
    }

    // Mencari indeks buku dalam array
    const index = books.indexOf(book);

    // Menghapus buku dari array
    books.splice(index, 1);

    // Kirimkan respons (perhatikan, ini seharusnya mengirimkan pesan sukses, bukan buku yang sudah dihapus)
    res.send('Book deleted successfully');
});
app.listen(8080)