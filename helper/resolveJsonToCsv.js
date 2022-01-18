const fs = require('fs');
const moment = require('moment');
const { extractDatesRange, dateDiffernece } = require('./generic');

const resolveJsonToCsv = async(listings) =>{

    const fileName = 'HotelPrice.csv';
    let todayDate = moment().format("YYYY-MM-DD");
    let dayDiff = dateDiffernece(todayDate, listings[0]?.rateSummary?.beginDate);
    let lengthOfListings  = listings?.length;
    let dateHeaderArray = extractDatesRange(todayDate, listings[0]?.rateSummary?.endDate);
    dateHeaderArray.unshift("Name");
    dateHeaderArray.unshift("Listing ID");

    let listingArray = [];
   
    listingArray.push(dateHeaderArray);
    
    listings.map(listing  => {
        let rentPerNight = [];
        
        let slicedPriceADate = listing.rateSummary?.rentNights?.splice(dayDiff);
        slicedPriceADate?.map(d => {
           rentPerNight.push(d);
        });

        listingArray.push([listing.listingId,
            (listing.propertyMetadata.headline)?.replace(/,/g, "-"),
             rentPerNight]);
    });
    fs.writeFile(fileName , listingArray.join("\r\n"), (err) => {
        if(!err){
           console.log("Data added to csv successfully , Refer to file", fileName)
        } else{
           console.error("There is some error while writing file",err)
        }
    });
}

module.exports = resolveJsonToCsv;