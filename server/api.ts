import express, { Router } from 'express';
import cors from 'cors';
import { db } from './server.ts';
import axios from 'axios';


const app = express();
const port = 9000;  // You can choose any port that's not in use
const router = Router();

app.use(cors()); // Allow CORS for all routes
app.use('/', router); // Use the router for routes prefixed with /, this is the root of the server API
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


interface Ingredient {
  name: string;
  measurement: number;
}

interface DrinkRequest {
  drinkName: string;
  drinkPrice: string;  // Assuming these are strings based on your log
  drinkCalories: string;
  drinkCategory: string;
  hasCaffeine: boolean;
  ingredients: Ingredient[];
}


/**
 * @api {get} / Request root
 * @apiName GetRoot
 * @apiGroup Root
 *
 * @apiSuccess {String} message Welcome message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Hello from Express!"
 *     }
 */
app.get('/', (_req, res) => {
  res.send('Hello from Express!');
});

//employees
/**
 * @api {get} /employees Get all employee information
 * @apiName GetEmployees
 * @apiGroup Employees
 */
app.get('/employees', async (_req, res) => { // To get all employee info
  try {
    const result = await db('SELECT * FROM employees');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});



// menu items
/**
 * @api {get} /menuitems Get all menu items
 * @apiName GetMenuItems
 * @apiGroup Menu
 */
app.get('/menuitems', async (_req, res) => { // To get all menu items
  try {
    const result = await db('SELECT * FROM menuitems');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu item data' });
  }
});

/**
 * @route GET /menuitems/:menuitemname
 * @description Get a specific menu item by name
 * @param {string} menuitemname - The name of the menu item
 */
app.get('/menuitems/:menuitemname', async (req, res) => { // To get a specific menu item
  try {
    const result = await db('SELECT * FROM menuitems WHERE menuitemname = $1', [req.params.menuitemname]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});

/**
 * @api {get} /category/:series Get all menu items in a specific category
 * @apiName GetMenuItemsInCategory
 * @apiGroup Category
 *
 * @apiParam {String} series The category of menu items.
 */
app.get('/category/:series', async (req, res) => { // To get all menu items in a specific category
  try {
    const result = await db('SELECT * FROM menuitems WHERE menuitemcategory = $1', [req.params.series]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch series data' });
  }
});



// Sales
/**
 * @api {get} /sales Get all sales
 * @apiName GetSales
 * @apiGroup Sales
 */
app.get('/sales', async (req, res) => { // To get all sales
  try {
    const result = await db('SELECT * FROM sales');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales data' });
  }
});

/**
 * @api {get} /salesReport Get sales report based on menu item, start date, and end date
 * @apiName GetSalesReport
 * @apiGroup SalesReport
 *
 * @apiParam {String} menuItem The name of the menu item.
 * @apiParam {String} startDate The start date for the report.
 * @apiParam {String} endDate The end date for the report.
 */
app.get('/salesReport', async (req, res) => {
  const { menuItem, startDate, endDate } = req.query as {
    menuItem: string;
    startDate: string;
    endDate: string;
  };

  // Ensure all required parameters are provided
  if (!menuItem || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  const menuItemId = await getMenuItemID(menuItem);

  // console.log(startDate, endDate, menuItemId);

  try {
    const query = `
      SELECT * FROM sales 
      WHERE menuitemid = $1 
      AND saledate BETWEEN $2 AND $3
    `;
    const result = await db(query, [menuItemId, startDate, endDate]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
  }
});

/**
 * @api {post} /sales Add a sale into the database
 * @apiName AddSale
 * @apiGroup Sales
 *
 * @apiParam {String} employeeId The ID of the employee making the sale.
 * @apiParam {Array} drinks An array of drinks in the sale.
 */
app.post('/sales', async (req, res) => { // To add a sale into the database (with auto-incremented orderID) ))
  try {
    let newOrderId; // INCREMENT ORDER ID
    let newOrderNo; // stay static
    const currentDate = new Date();

    // Format the date as YYYY-MM-DD in local timezone
    const formattedDate = currentDate.getFullYear() + '-' +
      (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' +
      currentDate.getDate().toString().padStart(2, '0');

    // Format the time as HH:MI:SS in local timezone
    const formattedTime = currentDate.getHours().toString().padStart(2, '0') + ':' +
      currentDate.getMinutes().toString().padStart(2, '0') + ':' +
      currentDate.getSeconds().toString().padStart(2, '0');

    const result = await db('SELECT MAX(orderid) as maxorderid, MAX(orderno) as maxorderno FROM sales');
    if (result.rows[0]) {
      newOrderId = result.rows[0].maxorderid + 1;
      newOrderNo = result.rows[0].maxorderno + 1;
      console.log("newOrderId: " + newOrderId);
      console.log("newOrderNo: " + newOrderNo);
    } else {
      newOrderId = -1;
      newOrderNo = -1;
    }

    const { employeeId, drinks } = req.body;
    let employeeIdInt = parseInt(employeeId);
    console.log("employeeId: " + employeeIdInt);
    console.log("drinks: " + drinks);

    for (const drink of drinks) {
      // add to sales
      await db('INSERT INTO sales (orderid, orderno, saledate, saletime, employeeid, saleprice, islarge, menuitemid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [newOrderId, newOrderNo, formattedDate, formattedTime, employeeIdInt, drink.quantity * drink.price, drink.size === "Large", drink.id]);


      // find corresponding ingredients and their respective quantities
      const measurementSet = await db('SELECT * FROM menuItems_inventory WHERE menuitemid = $1', [drink.id]);

      for (const mr of measurementSet.rows) {
        var quantity = mr.measurement;
        var id = mr.inventoryid;

        if (drink.size === "Large") {
          quantity = quantity * 1.5;
        }

        await db('UPDATE inventory SET inventoryquantity = inventoryquantity - $1 WHERE inventoryid = $2', [parseInt(quantity), id]);


        // check if stock is exceeded
        const inventoryCheckSet = await db('SELECT inventoryQuantity FROM inventory WHERE inventoryid = $1', [id]);
        var remaining = inventoryCheckSet.rows[0].inventoryquantity;
        //console.log(remaining)

        // should just be 1 value: SELECT inventoryQuantity
        if (remaining <= 50) {
          await db('UPDATE inventory SET inventoryinstock = $1 WHERE inventoryid = $2', [false, id]);
        }

        if (remaining <= 11) {
          // Retrieve all menu items that use this inventory item
          const menuItemsUsingInventory = await db('SELECT menuitemid FROM menuItems_inventory WHERE inventoryid = $1', [id]);

          for (const menuItem of menuItemsUsingInventory.rows) {
            // Set each menu item to not in stock
            await db('UPDATE menuitems SET menuiteminstock = $1 WHERE menuitemid = $2', [false, menuItem.menuitemid]);
          }
        }
      }

      newOrderId++;
    }


    res.json({ success: true, message: 'Data inserted successfully' });
  } catch (error) {

    console.log("THE SQL NO WORK BUT AT THIS LINE");
  }
});


//inventory
/**
 * @api {get} /inventory Get all inventory items
 * @apiName GetInventory
 * @apiGroup Inventory
 */
app.get('/inventory', async (_req, res) => {
  try {
    const result = await db('SELECT * FROM inventory');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory data' });
  }
});

/**
 * @api {post} /inventory Add a new inventory item
 * @apiName AddInventory
 * @apiGroup Inventory
 *
 * @apiParam {String} inventoryName The name of the inventory item.
 * @apiParam {Number} quantity The quantity of the inventory item.
 * @apiParam {String} receivedDate The date when the inventory item was received.
 * @apiParam {String} expirationDate The expiration date of the inventory item.
 * @apiParam {Boolean} inStock Whether the inventory item is in stock or not.
 * @apiParam {String} supplier The supplier of the inventory item.
 */
app.post('/inventory', async (req, res) => { // add inventory
  try {
    const { inventoryName, quantity, receivedDate, expirationDate, inStock, supplier } = req.body;
    const maxIdResult = await db('SELECT MAX(inventoryid) as maxid FROM inventory');
    const inventoryId = maxIdResult.rows[0].maxid + 1;
    // Add a query to insert a new inventory item
    const query = 'INSERT INTO inventory (inventoryid, inventoryname, inventoryquantity, inventoryreceiveddate, inventoryexpirationdate, inventoryinstock, inventorysupplier) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    const values = [inventoryId, inventoryName, quantity, receivedDate, expirationDate, inStock, supplier];

    await db(query, values);

    res.status(201).json({ message: 'Inventory item created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create new inventory item' });
    console.log(error);
  }
});

/**
 * @api {put} /inventory/:inventoryName Update an existing inventory item
 * @apiName UpdateInventory
 * @apiGroup Inventory
 *
 * @apiParam {String} inventoryName The name of the inventory item to be updated.
 */
app.put('/inventory/:inventoryName', async (req, res) => { //upadate inventory
  try {
    console.log('Updating inventory');
    
    const inventoryName = req.params.inventoryName;
    const { quantity, receivedDate, expirationDate, inStock, supplier } = req.body;

    // Add a query to update the inventory item
    const query = 'UPDATE inventory SET inventoryquantity = $1, inventoryreceiveddate = $2, inventoryexpirationdate = $3, inventoryinstock = $4, inventorysupplier = $5 WHERE inventoryname = $6';
    const values = [quantity, receivedDate, expirationDate, inStock, supplier, inventoryName];

    const result = await db(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    console.log('Got to update the drinks!');

    if (inStock) {
      console.log('Checking if any drinks can be restocked');
      var id = await db('SELECT inventoryid FROM inventory WHERE inventoryname = $1', [inventoryName]);
      console.log("Checking inventoryid ", id.rows[0].inventoryid);

      const drinks = await db('SELECT menuitemid FROM menuitems_inventory WHERE inventoryid = $1', [id.rows[0].inventoryid]);
      console.log("Checking drinks ", drinks);

      for (const drink of drinks.rows) {
        const ingredientsToCheck = await db('SELECT inventoryid FROM menuitems_inventory WHERE menuitemid = $1', [drink.menuitemid])
        console.log("Checking ingredients for drink ", drink.menuitemid, ") ", ingredientsToCheck);

        var isAllInStock = true;

        for (const ingredient of ingredientsToCheck.rows) {
          var isInStock = await db('SELECT inventoryinstock FROM inventory WHERE inventoryid = $1', [ingredient.inventoryid]);

          if (!isInStock) {
            isAllInStock = false;
            break;
          }
        }

        if (isAllInStock) {
          await db('UPDATE menuitems SET menuiteminstock = $1 WHERE menuitemid = $2', [true, drink.menuitemid]);
        }
      }
    }

    res.json({ message: 'Inventory item updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inventory item' });
  }
});

/**
 * @api {get} /inventory/:itemName Get information about a specific inventory item by name
 * @apiName GetInventoryItem
 * @apiGroup Inventory
 *
 * @apiParam {String} itemName The name of the inventory item.
 */
app.get('/inventory/:itemName', async (req, res) => {
  const itemName = req.params.itemName;

  try {
    const query = 'SELECT * FROM inventory WHERE inventoryname = $1';
    const result = await db(query, [itemName]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory data' });
    console.log(error);
  }
});

/**
 * @api {post} /addOrUpdateDrink Add a new drink or update an existing one
 * @apiName AddOrUpdateDrink
 * @apiGroup Drinks
 *
 * @apiParam {String} drinkName The name of the drink.
 * @apiParam {String} drinkPrice The price of the drink.
 * @apiParam {String} drinkCalories The calories in the drink.
 * @apiParam {String} drinkCategory The category of the drink.
 * @apiParam {Boolean} hasCaffeine Whether the drink contains caffeine or not.
 * @apiParam {Array} ingredients An array of ingredients in the drink.
 */
//addOrUpdateDrink
app.post('/addOrUpdateDrink', async (req, res) => {
  const { drinkName, drinkPrice, drinkCalories, drinkCategory, hasCaffeine, ingredients }: DrinkRequest = req.body;


  const price = parseFloat(drinkPrice);
  const calories = parseInt(drinkCalories);

  try {
    // Check if the drink exists
    const checkQuery = 'SELECT menuitemid FROM menuItems WHERE menuItemName = $1';
    const existingDrink = await db(checkQuery, [drinkName]);
    let menuItemID

    if (existingDrink.rows.length > 0) {
      // Drink exists, update it
      menuItemID = existingDrink.rows[0].menuitemid;
      const updateQuery = 'UPDATE menuItems SET menuItemPrice = $1, menuItemCalories = $2, hasCaffeine = $3 WHERE menuItemID = $4';
      await db(updateQuery, [drinkPrice, drinkCalories, hasCaffeine, menuItemID]);
    } else {
      // Drink does not exist, insert it

      const randomColor = getRandomColor();
      const maxIdResult = await db('SELECT MAX(menuitemid) as maxid FROM menuitems');
      menuItemID = maxIdResult.rows[0].maxid + 1;
      const insertQuery = 'INSERT INTO menuItems (menuItemID, menuItemName, menuItemPrice, menuItemCalories, menuItemCategory, hasCaffeine, color) VALUES ($1, $2, $3, $4, $5, $6, $7)';
      await db(insertQuery, [menuItemID, drinkName, drinkPrice, drinkCalories, drinkCategory, hasCaffeine, randomColor]);
    }

    // Update ingredients in the junction table
    for (const ingredient of ingredients) {
      /// Assuming getInventoryID is a function that returns the inventoryID for a given ingredient name
      const inventoryID = await getInventoryID(ingredient.name);
      const ingredientUpdateQuery = 'INSERT INTO menuItems_Inventory (menuItemID, inventoryID, measurement) VALUES ($1, $2, $3) ON CONFLICT (menuItemID, inventoryID) DO UPDATE SET measurement = $4';
      await db(ingredientUpdateQuery, [menuItemID, inventoryID, ingredient.measurement, ingredient.measurement]);
    }

  } catch (error) {
    console.error(error);
  }
});

/**
 * @api {get} /pairProducts Get paired products based on sales within a date range
 * @apiName GetPairProducts
 * @apiGroup Products
 *
 * @apiParam {String} startDate The start date for the analysis (YYYY-MM-DD format).
 * @apiParam {String} endDate The end date for the analysis (YYYY-MM-DD format).
 *
 * @apiSuccess {Object[]} products An array of paired products with their frequency of being sold together.
 */
app.get('/pairProducts', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = "SELECT "
      + "CASE WHEN menuItem1.menuItemName < menuItem2.menuItemName THEN menuItem1.menuItemName ELSE menuItem2.menuItemName END AS item1, "
      + "CASE WHEN menuItem1.menuItemName < menuItem2.menuItemName THEN menuItem2.menuItemName ELSE menuItem1.menuItemName END AS item2, "
      + "COUNT(*) AS frequency "
      + "FROM Sales AS sale1 "
      + "INNER JOIN Sales AS sale2 ON sale1.orderNo = sale2.orderNo AND sale1.menuItemID <> sale2.menuItemID "
      + "INNER JOIN menuItems AS menuItem1 ON sale1.menuItemID = menuItem1.menuItemID "
      + "INNER JOIN menuItems AS menuItem2 ON sale2.menuItemID = menuItem2.menuItemID "
      + "WHERE sale1.saleDate BETWEEN $1 AND $2 "
      + "GROUP BY item1, item2 "
      + "ORDER BY frequency DESC;"

    const result = await db(query, [startDate, endDate]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
  }
});

/**
 * @api {get} /excessReport Get a report of excess inventory items based on sales and inventory data
 * @apiName GetExcessReport
 * @apiGroup Reports
 *
 * @apiParam {String} targetDate The target date for the excess report (YYYY-MM-DD format).
 *
 * @apiSuccess {Object[]} items An array of excess inventory items.
 */
app.get('/excessReport', async (req, res) => {
  try {
    const targetDate = req.query.targetDate as string;
    if (!targetDate) {
      return res.status(400).send('Target date is required');
    }

    // Step 1: Iterate through all the sales after the targetDate
    const salesSql = `
      SELECT mi.menuItemID, mi.menuItemName, mi.menuItemPrice, mi.menuItemCalories, 
             mi.menuItemCategory, mi.hasCaffeine, m.inventoryID, m.measurement
      FROM Sales s
      JOIN menuItems mi ON s.menuItemID = mi.menuItemID
      JOIN menuItems_Inventory m ON mi.menuItemID = m.menuItemID
      WHERE s.saleDate >= $1;
    `;

    const salesResult = await db(salesSql, [targetDate]);
    const ingredientUsedQuantity = new Map<number, number>();

    for (const row of salesResult.rows) {
      const inventoryID = row.inventoryid;
      const measurement = row.measurement;
      const saleQuantity = 1.0;

      const usedQuantity = saleQuantity * measurement;
      ingredientUsedQuantity.set(inventoryID, (ingredientUsedQuantity.get(inventoryID) || 0) + usedQuantity);
    }

    // Step 2: Iterate through the inventory
    const inventorySql = `SELECT * FROM Inventory;`;
    const inventoryResult = await db(inventorySql);

    const excessData = [];

    for (const row of inventoryResult.rows) {
      const inventoryID = row.inventoryid;
      const stockedQuantity = row.inventoryquantity;
      const usedQuantity = ingredientUsedQuantity.get(inventoryID) || 0;
      const receivedDate = new Date(row.inventoryreceiveddate);

      if (receivedDate > new Date(targetDate)) {
        continue;
      }

      if (usedQuantity < (stockedQuantity * 0.1)) {
        // Prepare data for excess report
        excessData.push(row);
      }
    }

    res.json(excessData);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating excess report');
  }
});

/**
 * @api {get} /inventory/:inventoryName/id Get the inventory ID for a given inventory item name
 * @apiName GetInventoryID
 * @apiGroup Inventory
 *
 * @apiParam {String} inventoryName The name of the inventory item.
 *
 * @apiSuccess {Number} id The inventory ID.
 * @apiError {Null} null The inventory ID is not found.
 */
async function getInventoryID(inventoryName: string): Promise<number> {
  const query = 'SELECT inventoryid FROM Inventory WHERE inventoryname = $1';
  const results = await db(query, [inventoryName]);
  return results.rows.length > 0 ? results.rows[0].inventoryid : null;
}

/**
 * @api {get} /menu/:menuItemName/id Get the menu item ID for a given menu item name
 * @apiName GetMenuItemID
 * @apiGroup Menu
 *
 * @apiParam {String} menuItemName The name of the menu item.
 *
 * @apiSuccess {Number} id The menu item ID.
 * @apiError {Null} null The menu item ID is not found.
 */
async function getMenuItemID(menuItemName: string): Promise<number> {
  const query = 'SELECT menuItemid FROM menuItems WHERE menuitemname = $1';
  const results = await db(query, [menuItemName]);
  return results.rows.length > 0 ? results.rows[0].menuitemid : null;
}

/**
 * @api {get} /randomColor Generate a random hexadecimal color
 * @apiName GetRandomColor
 * @apiGroup Colors
 *
 * @apiSuccess {String} color A random color in hexadecimal format.
 */
function getRandomColor(): string {
  // Generate a random hexadecimal color
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Weather API
/**
 * @api {get} /weather/forecast Get the current weather forecast for a specific location
 * @apiName GetWeatherForecast
 * @apiGroup Weather
 *
 * @apiSuccess {Object} forecast Object containing temperature range, weather description, and location information.
 */
app.get('/weather/forecast', async (req, res) => {
  try {
    const response = await axios.get(
      `http://pro.openweathermap.org/data/2.5/forecast/daily?APPID=3bae41e3c0a26fd66b67c191f065532a&units=imperial&id=4682464&cnt=1`
    );

    const dailyForecast = response.data.list[0];

    // Extract temperature range and weather description data for the current day
    const temperatureMin = dailyForecast.temp.min;
    const temperatureMax = dailyForecast.temp.max;
    const weatherDescription = dailyForecast.weather[0].description;
    const weatherIcon = dailyForecast.weather[0].icon;

    const cityName = response.data.city.name;
    const countryName = response.data.city.country;

    // Send the temperature range and weather description for the current day in the response
    res.json({ temperatureMin, temperatureMax, weatherDescription, weatherIcon, cityName, countryName });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Error fetching weather data' });
  }
})

/**
 * @api {get} /weather/current Get the current weather for a specific location
 * @apiName GetCurrentWeather
 * @apiGroup Weather
 *
 * @apiSuccess {Object} weather Object containing current temperature, feels-like temperature, and location information.
 */
app.get('/weather/current', async (req, res) => { //
  try {
    const response = await axios.get(
      `http://pro.openweathermap.org/data/2.5/weather?APPID=3bae41e3c0a26fd66b67c191f065532a&units=imperial&id=4682464`
    );

    const currentData = response.data;

    // Extract temperature range and weather description data for the current day
    const currentTemperature = currentData.main.temp;
    const feelsLike = currentData.main.feels_like;

    // Send the temperature range and weather description for the current day in the response
    res.json({ currentTemperature, feelsLike });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Error fetching weather data' });
  }
})

/**
 * @api {post} /startServer Start the server on the specified port and log the server's URL
 * @apiName StartServer
 * @apiGroup Server
 *
 * @apiParam {Number} port The port number on which the server will listen.
 */
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
