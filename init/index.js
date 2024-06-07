const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// Function to connect to the MongoDB database
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Connected to database");
}

// Function to initialize the database
const initDB = async () => {
    try {
        // Delete all documents from the Listing collection
        await Listing.deleteMany({});

        // Update the owner field for each object in initData.data
        initData.data = initData.data.map((obj) => ({
            ...obj,
            owner: "66598b0b4b9999a35bbc962d"
        }));

        // Insert the modified data into the Listing collection
        await Listing.insertMany(initData.data);

        // Log a message indicating that the data has been initialized
        console.log("Data was initialized");
    } catch (error) {
        console.error("Error initializing data:", error);
    }
};

// Main function to connect to the database and initialize the data
main()
    .then(() => initDB())
    .catch(err => console.log(err));
