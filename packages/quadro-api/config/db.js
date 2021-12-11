const mongoose = require('mongoose');

const connectToDatabase = async () => {
  const { connection } = await mongoose.connect(process.env.NODE_ENV === 'production' ? process.env.DB_URI : process.env.DEV_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  // eslint-disable-next-line no-console
  console.log(`✬ | Mongoose connected successfully to`.cyan.bold, connection.name.green.italic.bold, `database on`.cyan.bold, connection.host.green.italic.bold);
}

module.exports = connectToDatabase;