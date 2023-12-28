const polka = require('polka');
const path = require('path');
const fs = require('fs');
const serve = require('serve-static');
const cors = require('cors')({ origin: true });

let data = [];
const inventory = [];

const categories = [
    //'conditions',
    //'damage-deck-core-tfa',
    //'damage-deck-core',
    //'damage-deck-rebel-transport',
    'pilots',
    //'reference-cards',
    'ships',
    //'sources',
    'upgrades',
];

categories.forEach((category) => {
    console.log(`Loading ${category} data`);
    data[category] = loadData(category);
});

function loadData(category) {
    const fileContent = fs.readFileSync(path.join(__dirname, 'xwing-data/data/' + category + '.js'));
    const jsonData = JSON.parse(fileContent);
    return jsonData;
}

function categoriesHandler(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(categories));
}

/*
function dataHandler(req, res) {
    const { category } = req.params;
    let categoryData = data[category] ?? [];

    let result = [];
    for (let i = 0; i < categoryData.length; i++) {
        const item = categoryData[i];
        if (category == 'ships') {
            imageUrl = `xwing-ship-images/images/${item.image}`;
        } else {
            imageUrl = `images/${item.image}`;
        }
        result.push({ name: item.name, cardId: item.xws, image: imageUrl });
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
}
*/

function allDataHander(req, res) {
    let result = []; 

    for (const category in data) {
        const categoryData = data[category];
        for (let i = 0; i < categoryData.length; i++) {
            const item = categoryData[i];
            
            let imageUrl;
            if (category == 'ships') {
                imageUrl = `xwing-ship-images/images/${item.image}`;
            } else {
                imageUrl = `images/${item.image}`;
            }

            result.push({ 
                name: item.name, 
                cardId: item.xws, 
                image: imageUrl,
                category: category, 
            });
        };
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
}

function cardHandler(req, res) {
    const { cardId } = req.params;
    let result = {}; 

    for (const category in data) {
        const categoryData = data[category];
        for (let i = 0; i < categoryData.length; i++) {
            const item = categoryData[i];
            if (item.xws === cardId) {
                result = item;
                break;    
            } 
        };
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
}

function inventoryHandler(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(inventory));
}

function inventoryAddHandler(req, res) {
    const { cardId } = req.params;

    const existingCard = inventory.find((item) => item.cardId === cardId);
    let result;
    if (existingCard) {
        existingCard.quantity++;
        result = existingCard;
    } else {
        result = { cardId: cardId, quantity: 1 };
        inventory.push(result);
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
}

function inventoryDeleteHandler(req, res) {
    const { cardId } = req.params;

    const index = inventory.findIndex((item) => item.cardId === cardId);
    let result;
    if (index !== -1) {
        inventory[index].quantity--;
        if (inventory[index].quantity > 1) {
            result = inventory[index];
        } else {
            result = inventory.splice(index, 1);
        }
    }
  
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
}

polka()
    .use(serve(path.join(__dirname, 'public')), cors)
    .get('/data', categoriesHandler)
    .get('/data/all', allDataHander)
    //.get('/data/:category', dataHandler)
    .get('/card/:cardId', cardHandler)
    .get('/inventory', inventoryHandler)
    .put('/inventory/:cardId', inventoryAddHandler)
    .delete('/inventory/:cardId', inventoryDeleteHandler)
    .listen(3000, (err) => {
        if (err) throw err;
        console.log('Server is running on http://localhost:3000');
    });
