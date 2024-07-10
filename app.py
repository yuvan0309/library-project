from flask import Flask, request, jsonify, render_template
import mysql.connector

app = Flask(__name__)

# Function to establish a database connection
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="bookhavenuser",
        password="1234",
        database="book_haven", 
        auth_plugin='mysql_native_password'
    )

# Route for the homepage
@app.route('/') 
def index():
    return render_template('index.html')

# Route to get all books
@app.route('/books', methods=['GET'])
def get_books():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)  # Fetch results as dictionaries
    cursor.execute("SELECT * FROM books")
    books = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(books)

# Route to add a new book
@app.route('/book', methods=['POST'])
def add_book():
    new_book = request.get_json()
    title = new_book['title']
    author = new_book['author']
    year = new_book['year']
    isbn = new_book['isbn']

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO books (title, author, year, isbn) VALUES (%s, %s, %s, %s)",
                   (title, author, year, isbn))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Book added successfully'}), 201

# Route to update a book
@app.route('/book/<int:id>', methods=['PUT'])
def update_book(id):
    update_data = request.get_json()
    title = update_data.get('title')
    author = update_data.get('author')
    year = update_data.get('year')
    isbn = update_data.get('isbn')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM books WHERE id = %s", (id,))
    book = cursor.fetchone()
    
    if not book:
        cursor.close()
        conn.close()
        return jsonify({'message': 'Book not found'}), 404

    updates = []
    if title:
        updates.append(f"title = '{title}'")
    if author:
        updates.append(f"author = '{author}'")
    if year:
        updates.append(f"year = {year}")
    if isbn:
        updates.append(f"isbn = '{isbn}'")
    updates_str = ', '.join(updates)
    cursor.execute(f"UPDATE books SET {updates_str} WHERE id = %s", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Book updated successfully'})

# Route to delete a book
@app.route('/book/<int:id>', methods=['DELETE'])
def delete_book(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM books WHERE id = %s", (id,))
    book = cursor.fetchone()
    
    if not book:
        cursor.close()
        conn.close()
        return jsonify({'message': 'Book not found'}), 404

    cursor.execute("DELETE FROM books WHERE id = %s", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Book deleted successfully'})

if __name__ == '__main__':
    app.run(debug=True)
