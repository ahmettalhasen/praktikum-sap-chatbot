const cds = require('@sap/cds')

module.exports = class BookshopService extends cds.Service {
    getStock(Books,id) {
        return id+1
    }
}

/*
module.exports = function BookshopService(){
    
    this.on ('submitOrder', (req)=>{

    }) //> custom actions
    
    
    this.on ('CREATE',`Books`, (req)=>{...})
    this.before ('UPDATE',`*`, (req)=>{...})
    this.after ('READ',`Books`, (each)=>{...})
    
   this.before('READ', 'Books', (each)=> {

   })

   this.on('getData', 'Books')
   
  }
*/