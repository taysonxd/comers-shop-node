const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
	res.json({ message: 'API up' });
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});


