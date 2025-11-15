# 📚 Bertie’s Books

A Node.js, Express, EJS and MySQL web application created for **Dynamic Web Applications. Lab 6abcde plus 6f**.  
The project demonstrates full stack development using server-side templates, database queries and deployment to the Goldsmiths VM.

---

## ⚙️ Features

| Task | Description | Key Files |
|------|-------------|-----------|
| Add Book Form | Users can add new books using a form that inserts into MySQL. | `addbook.ejs`, `books.js` |
| List Books | Displays all books from the database in a table. | `list.ejs`, `books.js` |
| Bargain Books | Lists books cheaper than £20 using SQL filtering. | `bargainbooks.ejs`, `books.js` |
| Search Function | Users can search by exact or partial match using SQL LIKE. | `search.ejs`, `searchresults.ejs`, `books.js` |
| MySQL User Setup | Dedicated restricted MySQL user for the application. | `create_db.sql` |
| VM Deployment | App deployed to the Goldsmiths VM with MySQL installed. | VM |
| Forever Process | App kept running on the VM using `forever`. | `index.js` |
| links.txt | Contains the live URL required for marking. | `links.txt` |

---

## 🚀 Running Locally

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node index.js
```

Visit the app:
```bash
http://localhost:8000
```

Available routes:
- /books/list
- /books/addbook
- /books/bargainbooks
- /books/search