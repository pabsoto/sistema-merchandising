const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/tienda_virtual', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('✅ Conectado a MongoDB');

  // Eliminar la colección llamada 'tienda_virtual' (la duplicada dentro de la base de datos)
  await mongoose.connection.db.dropCollection('tienda_virtual');
  console.log('🗑️ Colección "tienda_virtual" eliminada correctamente');

  mongoose.disconnect();
})
.catch((err) => {
  console.error('❌ Error:', err.message);
});
