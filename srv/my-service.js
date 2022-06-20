const cds = require('@sap/cds');


module.exports = cds.service.impl(async (srv) => {
    const { PurchaseData } = srv.entities;    
    const backend = await cds.connect.to('DwcService');

    srv.on('helloWorld', async (req) => {
        return "Hello World"
    })

    srv.on('READ', 'PurchaseData', async(request) => {
        //console.log(request.query);
        const result = await backend.tx(request).run(request.query);
        const res = request.reply(result);
        console.log("amount of products retrieved: " + res.length);
        return res;
    });

    srv.on('READ', 'PurchaseDataGroupByX', async(request) => {
        //console.log(request.query);
        const result = await backend.tx(request).run(request.query);
        const res = request.reply(result);
        console.log("amount of products retrieved: " + res.length);
        return result;
    });

    srv.on('sum', async(request) => {
        /*
        const tx = srv.tx(request)
        const test = await tx.get({name1:"USSU-VSF04"})
        console.log(test);     
        return test;
        */
       //console.log("TESTETSETS")
       //const text = backend.run('SELECT * FROM MyService.PurchaseData')
       //const text = backend.get('https://port4004-workspaces-ws-tjl28.eu10.applicationstudio.cloud.sap/my/PurchaseData');
       /*
       const text = backend.run('SELECT.from(MyService.PurchaseData')
       console.log(text);     
        return text;
        */
       //return backend.tx(request).run('SELECT.from(PurchaseData');
       //const query = SELECT.from('PurchaseData').columns('land1'), tx = srv.tx(request);
       /** 
       var builder = new ODataConventionModelBuilder();
        var products = builder.EntitySet("PurchaseData");
        products.EntityType.Count().Filter().OrderBy().Expand().Select();
        //return builder.GetEdmModel();
        */
    
       
       const query = SELECT.from(PurchaseData).limit(2);
       const query4 = `SELECT * from MyService.PurchaseData`;
       const query5 = { SELECT: {
        from: {ref:['MyService.PurchaseData']},
        limit: { rows: {val:1000}, offset: {val:0} },
        orderBy: [
          {ref:[ 'ebeln' ], sort: 'asc' },
          {ref:[ 'ebelp' ], sort: 'asc' }
        ]
      }};
        const query3 = SELECT.one.from('PurchaseData').columns(c => c.get("maktx"), c => CQL.count(c.get("maktx")).as("count")).groupBy(g => g.get("maktx"));
        //const query2 = SELECT.from("PurchaseData").columns(c => c.get("maktx"), c => CQL.count(c.get("maktx")).as("count")).groupBy(g => g.get("maktx"));
        //const query2 = SELECT.from `PurchaseData` .where ('maktx =' , 'BKR-300 Frame');
        //const query2 = SELECT.from (`PurchaseData`, a => {a.land1}) .where ('land1 =' , 'DE');
        //let query6 = SELECT `bsart` .from (PurchaseData) .where `bsart = 'NB'` .groupBy `bsart` //Feature not supported: SELECT statement with .groupBy
        let query6 = SELECT `bsart` .from (PurchaseData) .where `bsart = 'NB'`

        request.query = query5;
        //console.log(request.query)

        const tx = srv.tx(request);
        const result = await backend.tx(request).run(request.query);
        const res = request.reply(result);
        console.log("amount : " + res.length);
        return "sum of products: " + res.length;

        const q = SELECT.from('PurchaseData', ['Count(maktx) as count']); 
        const results = backend.run(request.query);
        //console.log("" + results);
        return results;
       //const query = 'SELECT * from PurchaseData', tx = srv.tx(request);
      /*
        const result = tx.run (query2);
        console.log("resulto");
        console.log(result);
        return result;
        */
       //return backend.tx(request).read('PurchaseData').orderBy('bprme');

    })
}); 

