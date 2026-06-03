const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/tienda_virtual', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('✅ Conectado a MongoDB');

  const collections = await mongoose.connection.db.listCollections().toArray();
  for (const col of collections) {
    if (col.name.startsWith('tienda_virtual.')) {
      await mongoose.connection.db.dropCollection(col.name);
      console.log(`🗑️ Colección "${col.name}" eliminada`);
    }
  }

  mongoose.disconnect();
})
.catch((err) => {
  console.error('❌ Error:', err.message);
});
