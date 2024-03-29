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

function filterLimit(data, limitNumber, limitType, sortedElement, selectAttribute) {
    let entries = sortByKey(data, sortedElement, selectAttribute)
    if (limitType == "bottom") {
        return entries.slice(0, limitNumber)
    }
    else {
        return entries.slice(-limitNumber);
    }
}

function sortByKey(array, key, selectAttribute) {
    return array.sort( function(a, b) {
        var x = a[selectAttribute];
        var y = b[selectAttribute];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

module.exports = {
    calculateAggregation,
    filterLimit
}