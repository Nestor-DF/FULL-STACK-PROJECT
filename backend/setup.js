const mongoose = require('mongoose')
const initDatabase = require('./data/init-database')

initDatabase(process.env.MONGODB_URI)