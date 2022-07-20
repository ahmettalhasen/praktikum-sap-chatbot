// Function to apply given aggregation methods
function calculateAggregation(array, aggregate) {
    var aggregateResult = null
    if (aggregate == "max") {
        aggregateResult = Math.max(...array)
    }
    else if (aggregate == "min") {
        aggregateResult = Math.min(...array)
    }
    else if (aggregate == "sum") {
        aggregateResult = sum(array)
    }
    else {
        aggregateResult = mean(array)
    }
    return aggregateResult
}

// Function to calculate average of a list
function mean(array) {
    return array.reduce((a, b) => a + b, 0) / array.length;
}

// Function to calculate sum of a list
function sum(array) {
    return array.reduce((a, b) => a + b, 0);
}

// Function to filter data points by limitNumber many and top or bottom 
function filterLimit(data, limitNumber, limitType, sortedElement, selectAttribute) {
    let entries = sortByKey(data, sortedElement, selectAttribute)
    if (limitType == "bottom") {
        return entries.slice(0, limitNumber)
    }
    else {
        return entries.slice(-limitNumber);
    }
}

// Function to sort a list of jsons based on a given key
function sortByKey(array, key, selectAttribute) {
    return array.sort(function (a, b) {
        var x = a[selectAttribute];
        var y = b[selectAttribute];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

module.exports = {
    calculateAggregation,
    filterLimit
}