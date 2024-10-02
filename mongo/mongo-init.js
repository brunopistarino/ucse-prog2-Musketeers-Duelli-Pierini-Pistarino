db = db.getSiblingDB("superCook");

db.foodstuffs.insertOne({ dummy: true });
db.purchases.insertOne({ dummy: true });
db.recipes.insertOne({ dummy: true });

// Remove dummy documents
db.foodstuffs.deleteOne({ dummy: true });
db.purchases.deleteOne({ dummy: true });
db.recipes.deleteOne({ dummy: true });
