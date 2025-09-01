const app = require('./app') 
const http = require('http')

const PORT = 5000
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`)
})
