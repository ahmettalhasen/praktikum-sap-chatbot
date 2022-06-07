const cds = require('@sap/cds');

module.exports = cds.service.impl(async (srv) => {
    const backend = await cds.connect.to('DwcService');
    srv.on('READ', 'PurchaseData', request => {
        console.log(request.query);     
        return backend.tx(request).run(request.query);
    });
}); 

