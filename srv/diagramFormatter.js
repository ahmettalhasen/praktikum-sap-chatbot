function formatMultipleGroupBy(data) {
    let result = {};
    const attr1Values = new Set();
    const attr2Values = new Set();
    data.forEach( entry => {
        let att1 = Object.values(entry)[0]
        let att2 = Object.values(entry)[1];
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

function prepareDiagram(size, groupBy, type) {
    var labels = [];
    var data = [];
    var diagram = "https://quickchart.io/chart?c=";
    if (size > 1) {
        let res = formatMultipleGroupBy(groupBy);
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
    return diagram;
}

module.exports = {
    prepareDiagram,
}