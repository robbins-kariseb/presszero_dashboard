export const isInSameWeek = (date1, date2) => {
    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const daysDifference = Math.abs((date2 - date1) / millisecondsPerDay);
  
    // Check if the dates are within the same week (7 days)
    return daysDifference <= 7;
}

export const formatSmartInsightMessage = (text) => {
    const parts = text.split('\n');
    let message = '';
    
    parts.forEach((p,idx)=>{
        if (p.length > 2) 
        {
            p = p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            p = `${p[0]}${p[1]}` === '##' ? `<h4>${p.replaceAll('##','')}<h4>` : p;
            p = `${p[0]}${p[1]}` === '- ' ? `${p.replaceAll('- ','→ ')}` : p;
            if (idx===0) {
                if (`${p[0]}${p[1]}` === '1.' || `${p[0]}${p[1]}` == '→ ') {
                    message += `<div  className='message-heading'>Here's some information you may find helpful:</div>`;
                    message += `<div  className='message-insight'>${p}</div>`;
                }
                else {
                    message += `<div  className='message-heading'>${p}</div>`;
                }
            } else {
                message += `<div  className='message-insight'>${p}</div>`;
            }
        }
    })

    return message;
} 

export const isInSameMonth = (date1, date2) => {
    return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
};

/**
 * Extract timeseries data from the given model.
 * @param {*} param0 
 */

export const calculateAverageResponseTime = (dataset) => {
    const userChatTimes = {};  // Dictionary to store the first time a user chat occurs
    const responseTimes = [];  // Array to store calculated response times
    let firstTimeReceived = null;

    dataset.forEach(chat => {
        const { companyId, createdBy, createdDate } = chat;

        if (createdBy === 'user') {
            // Store the time of the first user chat
            userChatTimes[companyId] = new Date(createdDate);
            if (!firstTimeReceived) {
                firstTimeReceived = new Date(createdDate);
            }
        } else if (createdBy === 'system' && userChatTimes[companyId]) {
            const systemTime = new Date(createdDate);
            // Calculate the time difference for system response
            const userTime = userChatTimes[companyId];
            const timeDifference = systemTime - userTime;

            // Convert the time difference to hours and push to the response times array
            const hoursDifference = timeDifference / (1000 * 60 * 60);
            responseTimes.push(hoursDifference);

            // Reset the user chat time for the next calculation
            delete userChatTimes[companyId];
        }
    });

    // Calculate the average response time
    const averageResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;

    const defaultTime = (new Date() - firstTimeReceived) / (1000 * 60 * 60) == NaN ? (new Date() - firstTimeReceived) / (1000 * 60 * 60) : 0;

    return averageResponseTime;
}

export const calculateAverageTimeToClose = (dataset) => {
    const userChatTimes = {};  // Dictionary to store the first time a user chat occurs
    const responseTimes = [];  // Array to store calculated response times
    let firstTimeReceived = null;

    dataset.forEach(chat => {
        const { resolvedDate, createdDate } = chat;

        if (resolvedDate) {
            responseTimes.push(new Date(resolvedDate) - new Date(createdDate))
        } else {
            console.log(chat)
        }
    });

    // Calculate the average response time
    const averageResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;

    const defaultTime = (new Date() - firstTimeReceived) / (1000 * 60 * 60) == NaN ? (new Date() - firstTimeReceived) / (1000 * 60 * 60) : 0;

    return averageResponseTime;
}

export const timeseriesExtract = ({ dataset, key }) => {
    const initial = dataset[key];
    const timeseriesDay = [];
    const timeseriesWeek = [];
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
                timeseriesWeek.push(e);
            }

            if (isInSameMonth(createdDate, currentDate)) {
                timeseriesMonth.push(e);
            }
        }
    });

    let response = {}

    response[key] = initial
    response['timeseriesDay'] = timeseriesDay
    response['timeseriesMonth'] = timeseriesMonth
    response['timeseriesAllTimes'] = timeseriesAllTimes

    response['day'] = timeseriesDay
    response['week'] = timeseriesWeek
    response['month'] = timeseriesMonth
    
    return response;
};

export const formatDateToShort = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
};

export const isSameDay = (date1, date2) => {
    return date2.getDate() === date1.getDate()
};

export const listDatesBetween = (startDate, endDate) => {
    const datesArray = [];
    let currentDate = new Date(startDate);
  
    while (currentDate <= new Date(endDate)) {
      datesArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return datesArray;
};

export const getLowerAndUpperBoundDates = ({ dataset, key }) => {
    const initial = dataset[key];

    let lower = null;
    let upper = null;

    initial.forEach((e) => {
        if (e.createdDate) {
            const current = new Date(e.createdDate);
            if (!lower || lower > current) {
                lower = current;
            } else if (!upper || upper < current) {
                upper = current;
            }
        }
    });

    console.log({
        upper, 
        lower
    })

    return {
        upper, 
        lower
    }
};

export const getAvailabilityKey = (dayOfWeek) => {
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return daysOfWeek[dayOfWeek] + 'Availability';
}

export const convertHoursToTimeText = (hours) => {
    // Convert hours to seconds
    let totalSeconds = Math.round(hours * 3600);

    // Calculate hours, minutes, and seconds
    let h = Math.floor(totalSeconds / 3600);
    let m = Math.floor((totalSeconds % 3600) / 60);
    let s = totalSeconds % 60;

    // Build the time text
    let timeText = '';
    
    if (h > 0) {
        if (h < 24)
            timeText += h + 'h ';
        else
            timeText += '24h+ ';
    }

    if ((m > 0 || h > 0) && (h < 24)) {
        timeText += m + 'min ';
    }

    if ((h < 0 || timeText.length < 2) && (h < 24)) 
        timeText += s + 'sec';

    return timeText;
}

export function cache_encoder(obj) {
    // Convert object to JSON string
    var jsonString = JSON.stringify(obj);
    
    // Encode the JSON string using base64 encoding
    var encodedString = btoa(jsonString);
    
    // Return the encoded string
    return encodedString;
}

export const countryCodes = [
    { name: "United Kingdom", code: "UK" },
    { name: "United States", code: "US" },
    { name: "Germany", code: "DE" },
    { name: "France", code: "FR" },
    { name: "Canada", code: "CA" },
    { name: "Australia", code: "AU" },
    { name: "Brazil", code: "BR" },
    { name: "India", code: "IN" },
    { name: "Japan", code: "JP" },
    { name: "South Korea", code: "KR" },
    { name: "China", code: "CN" },
    { name: "Russia", code: "RU" },
    { name: "South Africa", code: "ZA" },
    { name: "Mexico", code: "MX" },
    { name: "Argentina", code: "AR" },
    { name: "Italy", code: "IT" },
    { name: "Spain", code: "ES" },
    { name: "Netherlands", code: "NL" },
    { name: "Sweden", code: "SE" },
    { name: "Norway", code: "NO" },
    { name: "Switzerland", code: "CH" },
    { name: "Austria", code: "AT" },
    { name: "Belgium", code: "BE" },
    { name: "Denmark", code: "DK" },
    { name: "Portugal", code: "PT" },
    { name: "Greece", code: "GR" },
    { name: "Poland", code: "PL" },
    { name: "Turkey", code: "TR" },
    { name: "Indonesia", code: "ID" },
    { name: "Thailand", code: "TH" },
    { name: "Vietnam", code: "VN" },
    { name: "Egypt", code: "EG" },
    { name: "Nigeria", code: "NG" },
    { name: "Kenya", code: "KE" },
    { name: "Saudi Arabia", code: "SA" },
    { name: "United Arab Emirates", code: "AE" },
    { name: "Singapore", code: "SG" },
    { name: "Malaysia", code: "MY" },
    { name: "New Zealand", code: "NZ" },
    { name: "Ireland", code: "IE" },
    { name: "Finland", code: "FI" },
    { name: "Czech Republic", code: "CZ" },
    { name: "Hungary", code: "HU" },
    { name: "Romania", code: "RO" },
    { name: "Croatia", code: "HR" },
    { name: "Bulgaria", code: "BG" },
    { name: "Serbia", code: "RS" },
    { name: "Slovakia", code: "SK" },
    { name: "Slovenia", code: "SI" },
    { name: "Estonia", code: "EE" },
    { name: "Latvia", code: "LV" },
    { name: "Lithuania", code: "LT" },
    { name: "Ukraine", code: "UA" },
    { name: "Belarus", code: "BY" },
    { name: "Moldova", code: "MD" },
    { name: "Cyprus", code: "CY" },
    { name: "Malta", code: "MT" },
    { name: "Luxembourg", code: "LU" },
    { name: "Monaco", code: "MC" },
    { name: "Iceland", code: "IS" },
    { name: "Greenland", code: "GL" },
    { name: "Fiji", code: "FJ" },
    { name: "Papua New Guinea", code: "PG" },
    { name: "Solomon Islands", code: "SB" },
    { name: "Afghanistan", code: "AF" },
    { name: "Albania", code: "AL" },
    { name: "Algeria", code: "DZ" },
    { name: "Andorra", code: "AD" },
    { name: "Angola", code: "AO" },
    { name: "Antigua and Barbuda", code: "AG" },
    { name: "Armenia", code: "AM" },
    { name: "Azerbaijan", code: "AZ" },
    { name: "Bahamas", code: "BS" },
    { name: "Bahrain", code: "BH" },
    { name: "Bangladesh", code: "BD" },
    { name: "Barbados", code: "BB" },
    { name: "Belize", code: "BZ" },
    { name: "Benin", code: "BJ" },
    { name: "Bhutan", code: "BT" },
    { name: "Bolivia", code: "BO" },
    { name: "Bosnia and Herzegovina", code: "BA" },
    { name: "Botswana", code: "BW" },
    { name: "Brunei", code: "BN" },
    { name: "Burkina Faso", code: "BF" },
    { name: "Burundi", code: "BI" },
    { name: "Cambodia", code: "KH" },
    { name: "Cameroon", code: "CM" },
    { name: "Cape Verde", code: "CV" },
    { name: "Central African Republic", code: "CF" },
    { name: "Chad", code: "TD" },
    { name: "Comoros", code: "KM" },
    { name: "Congo", code: "CG" },
    { name: "Costa Rica", code: "CR" },
    { name: "Côte d'Ivoire", code: "CI" },
    { name: "Cuba", code: "CU" },
    { name: "Djibouti", code: "DJ" },
    { name: "Dominica", code: "DM" },
    { name: "Dominican Republic", code: "DO" },
    { name: "Ecuador", code: "EC" },
    { name: "El Salvador", code: "SV" },
    { name: "Equatorial Guinea", code: "GQ" },
    { name: "Eritrea", code: "ER" },
    { name: "Eswatini", code: "SZ" },
    { name: "Ethiopia", code: "ET" },
    { name: "Gabon", code: "GA" },
    { name: "Gambia", code: "GM" },
    { name: "Georgia", code: "GE" },
    { name: "Ghana", code: "GH" },
    { name: "Grenada", code: "GD" },
    { name: "Guatemala", code: "GT" },
    { name: "Guinea", code: "GN" },
    { name: "Guinea-Bissau", code: "GW" },
    { name: "Guyana", code: "GY" },
    { name: "Haiti", code: "HT" },
    { name: "Honduras", code: "HN" },
    { name: "Iraq", code: "IQ" },
    { name: "Jamaica", code: "JM" },
    { name: "Jordan", code: "JO" },
    { name: "Kazakhstan", code: "KZ" },
    { name: "Kiribati", code: "KI" },
    { name: "Kuwait", code: "KW" },
    { name: "Kyrgyzstan", code: "KG" },
    { name: "Laos", code: "LA" },
    { name: "Lebanon", code: "LB" },
    { name: "Lesotho", code: "LS" },
    { name: "Liberia", code: "LR" },
    { name: "Libya", code: "LY" },
    { name: "Liechtenstein", code: "LI" },
    { name: "Macao", code: "MO" },
    { name: "Madagascar", code: "MG" },
    { name: "Malawi", code: "MW" },
    { name: "Maldives", code: "MV" },
    { name: "Mali", code: "ML" },
    { name: "Marshall Islands", code: "MH" },
    { name: "Mauritania", code: "MR" },
    { name: "Mauritius", code: "MU" },
    { name: "Micronesia", code: "FM" },
    { name: "Moldova", code: "MD" },
    { name: "Monaco", code: "MC" },
    { name: "Mongolia", code: "MN" },
    { name: "Montenegro", code: "ME" },
    { name: "Morocco", code: "MA" },
    { name: "Mozambique", code: "MZ" },
    { name: "Myanmar", code: "MM" },
    { name: "Namibia", code: "NA" },
    { name: "Nauru", code: "NR" },
    { name: "Nepal", code: "NP" },
    { name: "Nicaragua", code: "NI" },
    { name: "Niger", code: "NE" },
    { name: "North Korea", code: "KP" },
    { name: "Oman", code: "OM" },
    { name: "Pakistan", code: "PK" },
    { name: "Palau", code: "PW" },
    { name: "Panama", code: "PA" },
    { name: "Papua New Guinea", code: "PG" },
    { name: "Paraguay", code: "PY" },
    { name: "Peru", code: "PE" },
    { name: "Philippines", code: "PH" },
    { name: "Qatar", code: "QA" },
    { name: "Rwanda", code: "RW" },
    { name: "Saint Kitts and Nevis", code: "KN" },
    { name: "Saint Lucia", code: "LC" },
    { name: "Saint Vincent and the Grenadines", code: "VC" },
    { name: "Samoa", code: "WS" },
    { name: "San Marino", code: "SM"}
  ];

export const timezoneList = [
    { name: "Coordinated Universal Time", code: "UTC" },
    { name: "Central African Time", code: "CAT" },
    { name: "Eastern European Time", code: "EET" },
    { name: "Eastern Standard Time", code: "EST" },
    { name: "Greenwich Mean Time", code: "GMT" },
    { name: "South Africa Standard Time", code: "SAST" },
    // Add more timezones as needed
];

export const generateRandomHex = (c=5) => {
    // Generate a random number between 0 and 0xFFFF (65535 in decimal)
    const randomNumber = Math.floor(Math.random() * 0x10000);
  
    // Convert the random number to a HEX string and ensure it has 5 characters
    const hexString = randomNumber.toString(16).toUpperCase().padStart(c, '0');
  
    return hexString;
}

export const isValidEmail = (email) => {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const formattedDate = (currentDate) => currentDate.toLocaleDateString('en-US', {
    month: 'short', // Short month name (e.g., "Dec")
    day: 'numeric', // Numeric day of the month (e.g., "24")
    year: 'numeric' // Full year (e.g., "2023")
});

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