const mysql = require("mysql");
const readline = require('readline');
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: "Pikachu@2013",
	database: "bamazon",
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

connection.connect();

connection.query("SELECT * FROM products", function(err, res) {
	const items = {};
	
	if(err) throw err;
	for (let i=0; i<res.length; i++) {
		const item = res[i];
		items[String(item.item_id)] = item;
		console.log([item.item_id, item.product_name, item.department_name, item.price, item.stock_quantity]
			.join("\t"));
	}
	rl.question('What item id would you like to buy? ', (item_id) => {
  		if(!items[item_id]) {
  			console.log("item does not exist");
  			return;
  		}
	  	rl.question('How many units would you like to purchase? ', (units) => {
	  		if(items[item_id].stock_quantity < units) {
	  			console.log("insufficient quantity!");
	  			return;
	  		}

	  		connection.query(
	  			"UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
	  			[units, item_id],
	  			function() {
	  				const paid = items[item_id].price * units;
	  					console.log("Your total is $" + paid);
	  			}
	  		);

	  		rl.close();
	  	});
	  	
	});
	
});

