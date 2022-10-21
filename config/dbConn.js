const mongoose = require('mongoose');
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
    } catch (error) {
        console.error(error)
    }
}

module.exports = connectDB;