export const isInSameWeek = (date1, date2) => {
    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const daysDifference = Math.abs((date2 - date1) / millisecondsPerDay);
  
    // Check if the dates are within the same week (7 days)
    return daysDifference <= 7;
}

/**
 * Extract timeseries data from the given model.
 * @param {*} param0 
 */
export const timeseriesExtract = ({ dataset, key }) => {
    const initial = dataset[key];
    const timeseriesDay = [];
    const timeseriesMonth = [];
    const timeseriesAllTimes = initial;

    const currentDate = new Date(); // current date and time

    console.log(dataset)

    initial.forEach((e) => {
        if (e.createdDate) {
            const createdDate = new Date(e.createdDate);
            // Check if createdDate is part of the current day
            if (
                createdDate.getDate() === currentDate.getDate() &&
                createdDate.getMonth() === currentDate.getMonth() &&
                createdDate.getFullYear() === currentDate.getFullYear()
            ) {
                timeseriesDay.push(e);
            }

            // Check if createdDate is part of the current month
            if (isInSameWeek(createdDate, currentDate)) {
                timeseriesMonth.push(e);
            }
        }
    });

    let response = {}

    response[key] = initial
    response['timeseriesDay'] = timeseriesDay
    response['timeseriesMonth'] = timeseriesMonth
    response['timeseriesAllTimes'] = timeseriesAllTimes
    
    return response;
};

export const queryCurrentDayOfWeek = () => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const dayOfWeek = daysOfWeek[today.getDay()];
    return dayOfWeek;
}

export const queryOnlineStatus = ({ company }) => {
    const daycode = queryCurrentDayOfWeek();
  
    const open = company[`${daycode.toLowerCase()}OpeningTime`];
    const close = company[`${daycode.toLowerCase()}ClosingTime`];
    const currentUtcTime = getTimeInUTC().toTimeString().split(' ')[0];
  
    // Parse opening and closing times to Date objects
    const openingTime = new Date(`1970-01-01T${open}Z`);
    const closingTime = new Date(`1970-01-01T${close}Z`);
    const currentTime = new Date(`1970-01-01T${currentUtcTime}Z`);
  
    // Check if the current time is between opening and closing times
    return currentTime >= openingTime && currentTime <= closingTime;
  };

export const getTimeInUTC = () => {
    const localTime = new Date();
    const utcTime = new Date(localTime.getTime() + localTime.getTimezoneOffset() * 60000);
    return utcTime;
}

export const convertTimeToUTC = (time) => {
    // Create a date object with today's date and the provided time
    const localTime = new Date(`1970-01-01T${time}Z`);
  
    // Get the UTC time in ISO format
    const utcTime = localTime.toISOString();
  
    // Extract only the time part from the ISO string
    const utcTimeString = utcTime.slice(11, 19);
  
    return utcTimeString;
}