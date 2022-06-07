/*const cds = require('@sap/cds')

class DataService extends cds.ApplicationService {
    init() {
    this.on('getData', async (req) => {
        return "Hello World"
    })

    
    const {Purchase} = cds.entities;
    this.on('READ','Purchase', (each)=> {
        each.name += "test"
    }) 
    

    }
}

module.exports = {DataService}
*/

const cds = require('@sap/cds');

module.exports = cds.service.impl(async (srv) => {
    /*
    srv.on('getData', async (req) => {
            return "Hello World"
        })
    srv.on('sum', ({data:{x,y}}) => x+y)

    const {Purchase} = cds.entities;
    */
    /*
    srv.on('aggregate', async(req) => {
        const res = 0;
        srv.after('READ', 'Purchase', (each) => {
            res += each.menge;
            each.name += "test"
        })
        return res;
    })
    */
   /*
   srv.on('READ', 'Purchase', (purchases, req) => {
        var res = 0;
        purchases.map((purchase) => {
            res += purchase.menge;
        })
        return res;
   })
   */

});