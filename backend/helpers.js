//take two timestamps and generate an hourly timestamp for every hour between them
module.exports.generateHourlyTimeslots = (startTime, endTime) => {
    const END_TIMESTAMP = new Date(endTime);
    const START_TIMESTAMP = new Date(startTime);

    let lastTimeStamp = new Date(startTime);

    let returnTimestamps = [];
    let hourOffset = 0;

    while (lastTimeStamp.getTime() < END_TIMESTAMP.getTime()) {
        lastTimeStamp.setHours(START_TIMESTAMP.getHours() + hourOffset); 
        
        returnTimestamps.push(lastTimeStamp.getTime());
        hourOffset++;
    }

    return returnTimestamps;
} 