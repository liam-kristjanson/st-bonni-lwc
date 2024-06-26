module.exports.setTimeOnDate = (date, time) => {
    let returnDate = new Date(date + " " + time);
    return returnDate;
}

module.exports.getDateFromStub = (date) => {
    let returnDate = new Date(date + " 00:00");
    return returnDate;
}