const cds = require('@sap/cds');

const dl = require('datalib');


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

    srv.on('aggregate', async (request) => {
        const purchaseData = await getPurchaseDataAll(request);
        var groupBy = dl.groupby('maktl').summarize({'menge': ['mean']}).execute(purchaseData);
        var diagram = "https://quickchart.io/chart?c=";
        var labels = [];
        var data = [];
        groupBy.forEach( entry => {
            labels.push(entry.maktl);
            data.push(entry.mean_menge);
        })          
        diagram += "{type:'bar', data:{labels:" + formatArrayAsString(labels) + ", datasets:[{label:'Products',data:" + formatArrayAsString(data) + "}]}}"
        return diagram;
    })

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
        var groupBy = dl.groupby(groupAttribute).summarize({[selectAttribute]: [aggregate]}).execute(purchaseData);
        var diagram = "https://quickchart.io/chart?c=";
        var labels = [];
        var data = [];
        groupBy.forEach( entry => {
            labels.push(Object.values(entry)[0]);
            data.push(Object.values(entry)[1]);
        })          
        diagram += "{type:'" + type + "', data:{labels:" + formatArrayAsString(labels) + ", datasets:[{label:'Products',data:" + formatArrayAsString(data) + "}]}}"
        //console.log(diagram);
        return diagram;
    })

    

    srv.on('getData', async (request) => {
        // fecth data
        const purchaseData = await getPurchaseDataAll(request);

        // organize and check parameters
        const params = request.req.query;
        var selectAttribute = null;
        if (params.selectAttribute != null && params.selectAttribute != '') {
            selectAttribute = params.selectAttribute;
        }
        var groupAttribute = null;  
        if (params.groupAttribute != null && params.groupAttribute != '') {
            if (params.groupAttribute == ";") {
                groupAttribute = null;
            }
            else {
                groupAttribute = params.groupAttribute;
                var groupAttributes = groupAttribute.split(";").filter(element => element);
            }
        }
        var aggregate = "mean";
        if (params.aggregate != null && params.aggregate != '') {
            aggregate = params.aggregate;
        }
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
    
        if (groupAttribute == null || filterValue != null) {
            // no group by no filter
            if (groupAttribute == null && filterValue == null) {
                var filteredData = [];
                purchaseData.forEach(entry => {
                    filteredData.push({aggVal: entry[selectAttribute]});
                });
                if (limitNumber != null && limitNumber != '' && limitType != null && limitType != '') {
                    filteredData = filterLimit(filteredData, limitNumber, limitType, 0)
                    // console.log(filteredData)
                }
                var filteredDataSingleAtt = [];
                filteredData.forEach(entry => {
                    filteredDataSingleAtt.push(entry.aggVal);
                })
                aggregateResult = calculateAggregation(filteredDataSingleAtt, aggregate);
                return aggregateResult.toFixed(2);
            }
            // no group by but filter
            else {
                var aggregateResult = null
                var filteredData = [];
                purchaseData.forEach(entry => {
                    if (entry[filterAttribute] != null && entry[filterAttribute].toUpperCase() == filterValue.toUpperCase()) {
                        filteredData.push({aggVal: entry[selectAttribute]});
                    }
                })
                if (limitNumber != null && limitNumber != '' && limitType != null && limitType != '') {
                    filteredData = filterLimit(filteredData, limitNumber, limitType, groupAttributes.length-1)
                    // console.log(filteredData)
                }
                var filteredDataSingleAtt = [];
                filteredData.forEach(entry => {
                    filteredDataSingleAtt.push(entry.aggVal);
                })
                console.log(filteredDataSingleAtt)
                aggregateResult = calculateAggregation(filteredDataSingleAtt, aggregate);
                return aggregateResult.toFixed(2); 
            }
        }
        
        var labels = [];
        var data = [];
        // console.log(purchaseData)
        var groupBy = dl.groupby(groupAttributes).summarize({[selectAttribute]: [aggregate]}).execute(purchaseData);
        // console.log(groupBy)
    
        if (limitNumber != null && limitNumber != '' && limitType != null && limitType != '') {
            groupBy = filterLimit(groupBy, limitNumber, limitType, groupAttributes.length)
        }
        // console.log(groupBy)
        var diagram = "https://quickchart.io/chart?c=";
    
        if (groupAttributes.length > 1) {
            let res = formatMultipleGroupBy(groupBy);
            // console.log(res);
            diagram += "{type:'" + type + "', data:{labels:" + formatArrayAsString(res.atts) + ", datasets:["
            for (const [key, value] of Object.entries(res.data)) {
                diagram += "{label:'" + key + "',data:" + formatArrayAsString(value) + "},";
            }
            diagram += "]}}"
    
        } else {
            groupBy.forEach( entry => {
                labels.push(Object.values(entry)[0]);
                data.push(Object.values(entry)[1]);
            })
            diagram += "{type:'" + type + "', data:{labels:" + formatArrayAsString(labels) + ", datasets:[{label:'Products',data:" + formatArrayAsString(data) + "}]}}"
        }
        
        // console.log(diagram);
        return diagram;
    })

    async function getPurchaseDataAll(request) {
        var data = [];
        var offSet = 0;
        for (let i = 0; i < 6; i++) {
            var query5 = { SELECT: {
                from: {ref:['MyService.PurchaseData']},
                limit: { rows: {val:1000}, offset: {val:offSet} },
                orderBy: [
                    {ref:[ 'ebeln' ], sort: 'asc' },
                    {ref:[ 'ebelp' ], sort: 'asc' }
                ]
            }};
            offSet = offSet + 1000;
            request.query = query5;
            var tx = srv.tx(request);
            var result = await backend.tx(request).run(request.query);
            var res = request.reply(result);
            data = data.concat(res);
        }
        return data
    }

    function formatArrayAsString(array) {
        var result = "[";
        array.forEach( entry => {
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

    function formatMultipleGroupBy(data) {
        let result = {};
        const attr1Values = new Set();
        const attr2Values = new Set();
        data.forEach( entry => {
            let att1 = Object.values(entry)[0]
            let att2 = Object.values(entry)[1];
            // if (att1 === null) {
            //     att1 = "Unknown"
            // }
            // if (att2 === null) {
            //     att2 = "Unknown"
            // }
            attr1Values.add(att1);
            attr2Values.add(att2);
        })
        const attr1List = Array.from(attr1Values);
        attr1List.sort();
        const attr2List = Array.from(attr2Values);
        attr2List.sort();
    
        attr1List.forEach( att1 => {
            let values = [];
            attr2List.forEach( att2 => {
                let value = null;
                data.forEach( entry => {
                    if (Object.values(entry)[0] == att1 && Object.values(entry)[1] == att2) {
                        value = Object.values(entry)[2];
                    }
                })
                values.push(value);
            })
            result[att1] = values;
        })
        return {
            atts: attr2List,
            data: result
        };
    }

    function filterLimit(data, limitNumber, limitType, sortedElement) {
        let entries = sortByKey(data, sortedElement)
        console.log(limitType)
        if (limitType == "min") {
            return entries.slice(0, limitNumber)
        }
        else {
            return entries.slice(-limitNumber);
        }
    }
    
    function sortByKey(array, key) {
        return array.sort( function(a, b) {
            var x = Object.values(a)[key];
            var y = Object.values(b)[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    function calculateAggregation(array, aggregate) {
        var aggregateResult = null
        if (aggregate == "max") {
            aggregateResult = Math.max(...array)
        }
        else if (aggregate == "min") {
            aggregateResult = Math.min(...array)
        }
        else if (aggregate == "sum") {
            // console.log(array)
            aggregateResult = sum(array)
        }
        else {
            // console.log(array)
            aggregateResult = mean(array)
        }
        return aggregateResult
    }

    function mean(array) {
        return array.reduce((a, b) => a + b, 0) / array.length;
    }

    function sum(array) {
        return array.reduce((a, b) => a + b, 0);
    }
    
}); 

