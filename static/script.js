document.addEventListener('DOMContentLoaded', function() {
    // Fetch Books
    window.fetchBooks = async function() {
        try {
            const response = await fetch('/books');
            const books = await response.json();
            const bookListElement = document.getElementById('bookList');
            bookListElement.innerHTML = ''; // Clear previous content
            books.forEach(book => {
                const bookElement = document.createElement('div');
                bookElement.classList.add('book');
                bookElement.innerHTML = `
                    <h4>${book.title}</h4>
                    <p><strong>ID:</strong> ${book.id}</p>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Year:</strong> ${book.year}</p>
                    <p><strong>ISBN:</strong> ${book.isbn}</p>
                `;
                bookListElement.appendChild(bookElement);
            });
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    // Add Book
    document.getElementById('addBookForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const year = document.getElementById('year').value;
        const isbn = document.getElementById('isbn').value;

        try {
            const response = await fetch('/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, author, year, isbn })
            });
            const data = await response.json();
            alert(data.message);
            document.getElementById('addBookForm').reset();
            fetchBooks(); // Refresh the book list
        } catch (error) {
            console.error('Error adding book:', error);
        }
    });

    // Update Book
    document.getElementById('updateBookForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const id = document.getElementById('updateId').value;
        const title = document.getElementById('updateTitle').value || null;
        const author = document.getElementById('updateAuthor').value || null;
        const year = document.getElementById('updateYear').value || null;
        const isbn = document.getElementById('updateIsbn').value || null;

        const data = {};
        if (title) data.title = title;
        if (author) data.author = author;
        if (year) data.year = year;
        if (isbn) data.isbn = isbn;

        try {
            const response = await fetch(`/book/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const responseData = await response.json();
            alert(responseData.message);
            document.getElementById('updateBookForm').reset();
            fetchBooks(); // Refresh the book list
        } catch (error) {
            console.error('Error updating book:', error);
        }
    });

    // Delete Book
    document.getElementById('deleteBookForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const id = document.getElementById('deleteId').value;

        try {
            const response = await fetch(`/book/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.status === 404) {
                alert('Book not found');
            } else {
                const data = await response.json();
                alert(data.message);
            }
            document.getElementById('deleteBookForm').reset();
            fetchBooks(); // Refresh the book list
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    });

    // Fetch books on initial load
    fetchBooks();
});
