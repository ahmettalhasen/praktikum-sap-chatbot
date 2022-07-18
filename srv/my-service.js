const cds = require('@sap/cds');
const dl = require('datalib');
const dataAggregation = require('./dataAggregation.js')
const diagramFormatter = require('./diagramFormatter.js')


module.exports = cds.service.impl(async (srv) => {
    const { PurchaseData } = srv.entities;
    const backend = await cds.connect.to('DwcService');

    // GET endpoint to fecth aggregated data
    srv.on('getData', async (request) => {
        // fecth data
        const purchaseData = await getPurchaseDataAll(request);

        // organize and check parameters
        const params = request.req.query;
        var selectAttribute = null;

        // Let user know that select attribute is required
        if (params.selectAttribute != null && params.selectAttribute != '') {
            selectAttribute = params.selectAttribute;
        } else {
            return "selectAttribute is not defined - please specify one."
        }

        // Let user know that aggregate attribute is required
        var aggregate = "mean";
        if (params.aggregate != null && params.aggregate != '') {
            aggregate = params.aggregate;
        } else {
            return "aggregation method is not defined - please specify one."
        }

        // Check if group attribute exists
        var groupAttribute = null;
        var groupBy;
        var groupAttributes = null;
        if (params.groupAttribute != null && params.groupAttribute != '') {
            if (params.groupAttribute == ";") {
                groupAttribute = null;
            }
            else {
                // Format group attributes as a list
                groupAttribute = params.groupAttribute;
                groupAttributes = groupAttribute.split(";").filter(element => element);
                console.log(groupAttributes);
                if (groupAttributes.length > 1 && groupAttributes[0] === groupAttributes[1]) {
                    groupAttributes = [...new Set(groupAttributes)]
                    console.log(groupAttributes);

                }
            }
        }

        // Check parameters for limit and filter options
        var limitNumber = null;
        if (params.limitNumber != null && params.limitNumber != '') {
            limitNumber = params.limitNumber;
        }
        var limitType = "max";
        if (params.limitType != null && params.limitType != '') {
            limitType = params.limitType;
        }
        var filterAttribute = null;
        if (params.filterAttribute != null && params.filterAttribute != '') {
            filterAttribute = params.filterAttribute;
        }
        var filterValue = null;
        if (params.filterValue != null && params.filterValue != '') {
            filterValue = params.filterValue;
        }
        var type = "bar";
        if (params.diagramType != null && params.diagramType != '') {
            type = params.diagramType;
        }

        // Filter data
        var filteredData = [];
        purchaseData.forEach(entry => {
            if (filterValue != null) {
                // Case insensitive
                if (entry[filterAttribute] == null || entry[filterAttribute].toUpperCase() != filterValue.toUpperCase()) {
                    return;
                }
            }
            filteredData.push(entry);
        });

        // Apply limit if specified
        // With only one group-by with filter it returns one single number
        if (groupAttributes == null) {
            var filteredDataSingleAtt = [];
            filteredData.forEach(entry => {
                filteredDataSingleAtt.push(entry[selectAttribute]);
            });
            aggregateResult = dataAggregation.calculateAggregation(filteredDataSingleAtt, aggregate);
            return aggregateResult.toFixed(2); //text response
        } else {
            // With two group-by with filter it returns a plot
            groupBy = dl.groupby(groupAttributes).summarize({ [selectAttribute]: [aggregate] }).execute(filteredData);
            if (limitNumber != null && limitNumber != '' && limitType != null && limitType != '') {
                groupBy = dataAggregation.filterLimit(groupBy, limitNumber, limitType, 0, aggregate + "_" + selectAttribute)
            }

        }

        if (type === "raw") {
            let myString = JSON.stringify(groupBy, null, 4); // 4 space indentations
            //console.log(myString);
            return myString;
        }
        return diagramFormatter.prepareDiagram(groupAttributes.length, groupBy, type);
    })

    // Function to fetch all data from Data Warehouse
    async function getPurchaseDataAll(request) {
        var data = [];
        var offSet = 0;
        for (let i = 0; i < 6; i++) {
            var query5 = {
                SELECT: {
                    from: { ref: ['MyService.PurchaseData'] },
                    limit: { rows: { val: 1000 }, offset: { val: offSet } },
                    orderBy: [
                        { ref: ['ebeln'], sort: 'asc' },
                        { ref: ['ebelp'], sort: 'asc' }
                    ]
                }
            };
            offSet = offSet + 1000;
            request.query = query5;
            var tx = srv.tx(request);
            var result = await backend.tx(request).run(request.query);
            var res = request.reply(result);
            data = data.concat(res);
        }
        return data
    }


    /*  DEPREACTED CODE !
    but mentioned in documentation, therefore still in
    code is working, but outdate functionality
    */

    srv.on('helloWorld', async (req) => {
        return "Hello World"
    })

    srv.on('READ', 'PurchaseData', async (request) => {
        //console.log(request.query);
        const result = await backend.tx(request).run(request.query);
        const res = request.reply(result);
        console.log("amount of products retrieved: " + res.length);
        return res;
    });

    srv.on('READ', 'PurchaseDataGroupByX', async (request) => {
        //console.log(request.query);
        const result = await backend.tx(request).run(request.query);
        const res = request.reply(result);
        console.log("amount of products retrieved: " + res.length);
        return result;
    });

    srv.on('sum', async (request) => {
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
        const query5 = {
            SELECT: {
                from: { ref: ['MyService.PurchaseData'] },
                limit: { rows: { val: 1000 }, offset: { val: 0 } },
                orderBy: [
                    { ref: ['ebeln'], sort: 'asc' },
                    { ref: ['ebelp'], sort: 'asc' }
                ]
            }
        };
        const query3 = SELECT.one.from('PurchaseData').columns(c => c.get("maktx"), c => CQL.count(c.get("maktx")).as("count")).groupBy(g => g.get("maktx"));
        //const query2 = SELECT.from("PurchaseData").columns(c => c.get("maktx"), c => CQL.count(c.get("maktx")).as("count")).groupBy(g => g.get("maktx"));
        //const query2 = SELECT.from `PurchaseData` .where ('maktx =' , 'BKR-300 Frame');
        //const query2 = SELECT.from (`PurchaseData`, a => {a.land1}) .where ('land1 =' , 'DE');
        //let query6 = SELECT `bsart` .from (PurchaseData) .where `bsart = 'NB'` .groupBy `bsart` //Feature not supported: SELECT statement with .groupBy
        let query6 = SELECT`bsart`.from(PurchaseData).where`bsart = 'NB'`

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

    // GET endpoint to fecth aggregated data
    srv.on('aggregate', async (request) => {
        const purchaseData = await getPurchaseDataAll(request);
        var groupBy = dl.groupby('maktl').summarize({ 'menge': ['mean'] }).execute(purchaseData);
        var diagram = "https://quickchart.io/chart?c=";
        var labels = [];
        var data = [];
        groupBy.forEach(entry => {
            labels.push(entry.maktl);
            data.push(entry.mean_menge);
        })
        diagram += "{type:'bar', data:{labels:" + formatArrayAsString(labels) + ", datasets:[{label:'Products',data:" + formatArrayAsString(data) + "}]}}"
        return diagram;
    })

    // GET endpoint to fecth aggregated data
    srv.on('selectgroup', async (request) => {
        const params = request.req.query;
        const selectAttribute = params.selectAttribute;
        const groupAttribute = params.groupAttribute;
        const aggregate = params.aggregate;
        var type = "bar";
        if (params.diagramtype != null && params.diagramtype != '') {
            type = params.diagramtype;
        }
        const purchaseData = await getPurchaseDataAll(request);
        var groupBy = dl.groupby(groupAttribute).summarize({ [selectAttribute]: [aggregate] }).execute(purchaseData);
        var diagram = "https://quickchart.io/chart?c=";
        var labels = [];
        var data = [];
        groupBy.forEach(entry => {
            labels.push(Object.values(entry)[0]);
            data.push(Object.values(entry)[1]);
        })
        diagram += "{type:'" + type + "', data:{labels:" + formatArrayAsString(labels) + ", datasets:[{label:'Products',data:" + formatArrayAsString(data) + "}]}}"
        //console.log(diagram);
        return diagram;
    })

    function formatArrayAsString(array) {
        var result = "[";
        array.forEach(entry => {
            if (!isNaN(entry) && entry !== null) {
                entry = +entry;
                entry = entry.toFixed(2);
            }
            result += "'" + entry + "',";
        })
        result.slice(0, -1);
        result += "]";
        return result;
    }



});
