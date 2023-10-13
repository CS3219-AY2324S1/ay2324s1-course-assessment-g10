"use strict";
// const connectDB = require('./config/db')
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
// connectDB()
const app = (0, express_1.default)();
app.options('*', (0, cors_1.default)({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
}));
app.use((0, cors_1.default)());
//allows JSON data in request body to be parsed
app.use(express_1.default.json());
// allow URL-encoded data in request body to be parsed
app.use(express_1.default.urlencoded({ extended: false }));
// use the address router to handle requests 
// at http://localhost:8080/api/addresses
// app.use('/api/addresses', require('./routes/addressRoutes'))
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});
module.exports = app;
