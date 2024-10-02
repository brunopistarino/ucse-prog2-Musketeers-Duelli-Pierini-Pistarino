db = db.getSiblingDB("superCook"); // Switch to superCook database

// Create 'foodstuffs' collection with a dummy document
db.foodstuffs.insertOne({ dummy: true });

// Create 'purchases' collection with a dummy document
db.purchases.insertOne({ dummy: true });

// Create 'recipes' collection with a dummy document
db.recipes.insertOne({ dummy: true });

// Optionally, remove the dummy documents after the collections are created
db.foodstuffs.deleteOne({ dummy: true });
db.purchases.deleteOne({ dummy: true });
db.recipes.deleteOne({ dummy: true });
