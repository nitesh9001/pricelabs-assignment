const moment = require('moment')

const dateDiffernece = (startDate, endDate )=> {
    let days = moment(new Date(startDate)).diff(moment(new Date(endDate)), 'days');
    return  days;
}

// date range finder helper function 
const extractDatesRange = (startDate, endDate) =>{
    console.log(startDate, endDate)
    let returnArray = [];
    let currentDate = moment(startDate);
    let lastDate = moment(endDate);
    while (currentDate <= lastDate) {
        returnArray.push( moment(currentDate).format('YYYY-MM-DD'));
        currentDate = moment(currentDate).add(1, 'days');
    }

    return returnArray;
}

module.exports = { dateDiffernece, extractDatesRange } ;