import { calculateAverageResponseTime, calculateAverageTimeToClose, convertHoursToTimeText, formatDateToShort, getAvailabilityKey, getLowerAndUpperBoundDates, isSameDay, listDatesBetween, timeseriesExtract } from "../utilities/helpers";


export default class Reports {
  CustomerSentimentReport = ({ dataset }) => {
    let positiveDay = 0;
    let positiveWeek = 0;
    let positiveMonth = 0;

    let negativeDay = 0;
    let negativeWeek = 0;
    let negativeMonth = 0;

    let neutralDay = 0;
    let neutralWeek = 0;
    let neutralMonth = 0;
    
    const time_series = timeseriesExtract({dataset: {dataset:dataset}, key: "dataset" })

    time_series.day.forEach((e) => {
        if (e.sentimentScore < 4) {
          negativeDay += 1;
        } else if (e.sentimentScore >= 4 && e.sentimentScore <= 6) {
          neutralDay += 1;
        } else {
          positiveDay += 1;
        }
      });

    time_series.month.forEach((e) => {
        if (e.sentimentScore < 4) {
            negativeMonth += 1;
        } else if (e.sentimentScore >= 4 && e.sentimentScore <= 6) {
          neutralMonth += 1;
        } else {
          positiveMonth += 1;
        }
    });

    time_series.week.forEach((e) => {
        if (e.sentimentScore < 4) {
          negativeWeek += 1;
        } else if (e.sentimentScore >= 4 && e.sentimentScore <= 6) {
          neutralWeek += 1;
        } else {
          positiveWeek += 1;
        }
    });

    return {
        day: {
            positive: positiveDay,
            negative: negativeDay,
            neutral: neutralDay,
        },
        week: {
            positive: positiveWeek,
            negative: negativeWeek,
            neutral: neutralWeek,
        },
        month: {
            positive: positiveMonth,
            negative: negativeMonth,
            neutral: neutralMonth,
        }
    };
  };

  AverageFirstResponseTimeReport = ({ dataset }) => {
    const time_series = timeseriesExtract({dataset: {dataset}, key: "dataset"})

    const artDay = calculateAverageResponseTime(time_series.day.filter((e)=>e.serial !== 'AutoReply'));
    const artWeek = calculateAverageResponseTime(time_series.week.filter((e)=>e.serial !== 'AutoReply'));
    const artMonth = calculateAverageResponseTime(time_series.month.filter((e)=>e.serial !== 'AutoReply'));
    console.log({
        day: {
            time: artDay,
            total: artDay,
        },
        week: {
            time: artWeek,
            total: artWeek - artDay,
        },
        month: {
            time: artMonth,
            total: artMonth - artWeek,
        }
    })
    return {
        day: {
            time: convertHoursToTimeText(artDay||0),
            total: convertHoursToTimeText(artDay||0),
        },
        week: {
            time: convertHoursToTimeText(artWeek||0),
            total: convertHoursToTimeText((artWeek - artDay)||0),
        },
        month: {
            time: convertHoursToTimeText(artMonth||0),
            total: convertHoursToTimeText((artMonth - artWeek)||0),
        }
    };
  };

  InboundChatsReceivedReport = ({ dataset }) => {
    const time_series = timeseriesExtract({dataset: {dataset}, key: "dataset"})

    return {
        day: {
            current: time_series.day.length,
            total: time_series.day.length,
        },
        week: {
            current: time_series.week.length,
            total: time_series.day.length - time_series.week.length,
        },
        month: {
            current: time_series.month.length,
            total: time_series.week.length - time_series.month.length,
        }
    };
  };

  CustomersAtRiskOfChurnReport = ({ dataset }) => {
    const time_series = timeseriesExtract({dataset: {dataset}, key: "dataset"})
    const user_hash_table = {
      day:{},
      week:{},
      month:{},
    }

    const results = {
      day: 0,
      week: 0,
      month: 0,
    }

    time_series.day.forEach((e)=>{
      if (user_hash_table['day'][e.userId] === undefined) {
        user_hash_table['day'][e.userId] = e;
      } else if (user_hash_table['day'][e.userId].sentimentScore < e.sentimentScore) {
        user_hash_table['day'][e.userId].sentimentScore = e.sentimentScore
      }
    })

    time_series.week.forEach((e)=>{
      if (user_hash_table['week'][e.userId] === undefined) {
        user_hash_table['week'][e.userId] = e;
      } else if (user_hash_table['week'][e.userId].sentimentScore < e.sentimentScore) {
        user_hash_table['week'][e.userId].sentimentScore = e.sentimentScore
      }
    })

    time_series.month.forEach((e)=>{
      if (user_hash_table['month'][e.userId] === undefined) {
        user_hash_table['month'][e.userId] = e;
      } else if (user_hash_table['month'][e.userId].sentimentScore < e.sentimentScore) {
        user_hash_table['month'][e.userId].sentimentScore = e.sentimentScore
      }
    })

    for (const series in user_hash_table) {
      for (const key in user_hash_table[series]) {
        if (user_hash_table[series][key].sentimentScore <= 4) {
          results[series] += 1
        }
      }
    }

    return {
        day: {
            current: results['day'],
            total: results['day'],
        },
        week: {
            current: results['week'],
            total: results['day'] - results['week'],
        },
        month: {
            current: results['month'],
            total: results['week'] - results['month'],
        }
    };
  };

  InboundChatsReceivedByTimeReport = ({dataset, companyData}) => {
    const time_series = timeseriesExtract({dataset: {dataset}, key: "dataset"})
    // Initialize counters
    let totalMessagesWhileOpen_day = 0;
    let totalMessagesWhileClosed_day = 0;

    let totalMessagesWhileOpen_week = 0;
    let totalMessagesWhileClosed_week = 0;

    let totalMessagesWhileOpen_month = 0;
    let totalMessagesWhileClosed_month = 0;

    // Iterate through the dataset
    time_series.day.forEach(message => {
        const createdDate = new Date(message.createdDate);

        // Check if the business is open on the day the message was sent
        const dayOfWeek = createdDate.getDay();
        const availabilityKey = getAvailabilityKey(dayOfWeek);

        if (availabilityKey && companyData[availabilityKey]) {
            // Business is open
            totalMessagesWhileOpen_day++;
        } else {
            // Business is closed
            totalMessagesWhileClosed_day++;
        }
    });

    time_series.week.forEach(message => {
      const createdDate = new Date(message.createdDate);

      // Check if the business is open on the day the message was sent
      const dayOfWeek = createdDate.getDay();
      const availabilityKey = getAvailabilityKey(dayOfWeek);

      if (availabilityKey && companyData[availabilityKey]) {
          // Business is open
          totalMessagesWhileOpen_week++;
      } else {
          // Business is closed
          totalMessagesWhileClosed_week++;
      }
    });

    time_series.month.forEach(message => {
      const createdDate = new Date(message.createdDate);

      // Check if the business is open on the day the message was sent
      const dayOfWeek = createdDate.getDay();
      const availabilityKey = getAvailabilityKey(dayOfWeek);

      if (availabilityKey && companyData[availabilityKey]) {
          // Business is open
          totalMessagesWhileOpen_month++;
      } else {
          // Business is closed
          totalMessagesWhileClosed_month++;
      }
    });

    return {
      day: {
        open: totalMessagesWhileOpen_day,
        closed: totalMessagesWhileClosed_day,
      },
      week: {
        open: totalMessagesWhileOpen_week,
        closed: totalMessagesWhileClosed_week,
      },
      month: {
        open: totalMessagesWhileOpen_month,
        closed: totalMessagesWhileClosed_month,
      },
    };
  }

  InboundChatsReceivedReport = ({ dataset }) => {
    const time_series = timeseriesExtract({dataset: {dataset}, key: "dataset"})

    return {
        day: {
            current: time_series.day.length,
            total: time_series.day.length,
        },
        week: {
            current: time_series.week.length,
            total: time_series.day.length - time_series.week.length,
        },
        month: {
            current: time_series.month.length,
            total: time_series.week.length - time_series.month.length,
        }
    };
  };

  CustomerSatisfactionScoreReport = ({ dataset }) => {
    const time_series = timeseriesExtract({dataset: {dataset}, key: "dataset"})

    let dayCurrent = 0, weekCurrent = 0, monthCurrent = 0
    let dayDifference = 0, weekDifference = 0, monthDifference = 0

    if (time_series.day.length > 0) {
        time_series.day.forEach((a)=>{
          dayCurrent += (a.metricFriendly + a.metricKnowledgeable + a.metricOverAllScore)/3
        })

        dayCurrent = dayCurrent / time_series.day.length;
        if (dayCurrent==NaN) dayCurrent = 0
    }
    if (time_series.week.length > 0) {
        time_series.week.forEach((a)=>{
          weekCurrent += (a.metricFriendly + a.metricKnowledgeable + a.metricOverAllScore)/3
        })

        weekCurrent = weekCurrent / time_series.week.length;
        if (weekCurrent==NaN) weekCurrent = 0
    }
    if (time_series.month.length > 0) {
        time_series.month.forEach((a)=>{
          monthCurrent += (a.metricFriendly + a.metricKnowledgeable + a.metricOverAllScore)/3
        })

        monthCurrent = monthCurrent / time_series.month.length;
        if (monthCurrent==NaN) monthCurrent = 0
    }
    
    if (time_series.day.length > 0) {
        dayDifference = dayCurrent
        if (dayDifference == NaN) dayDifference = 0
    }
    if (time_series.week.length > 0) {
        weekDifference = weekCurrent - dayCurrent
        if (weekDifference == NaN) weekDifference = 0
    }
    if (time_series.month.length > 0) {
        monthDifference = monthCurrent - weekCurrent
        if (monthDifference == NaN) monthDifference = 0
    }

    return {
      day: {
          current: dayCurrent.toFixed(2),
          total: dayDifference.toFixed(2),
      },
      week: {
          current: weekCurrent.toFixed(2),
          total: weekDifference.toFixed(2),
      },
      month: {
          current: monthCurrent.toFixed(2),
          total: monthDifference.toFixed(2),
      }
    };
  }

  AverageTimeToCloseReport = ({ dataset }) => {
    const time_series = timeseriesExtract({dataset: {dataset}, key: "dataset"})

    const artDay = calculateAverageTimeToClose(time_series.day);
    const artWeek = calculateAverageTimeToClose(time_series.week);
    const artMonth = calculateAverageTimeToClose(time_series.month);

    console.log({
        day: {
            time: artDay,
            total: artDay,
        },
        week: {
            time: artWeek,
            total: artWeek - artDay,
        },
        month: {
            time: artMonth,
            total: artMonth - artWeek,
        }
    })
    return {
        day: {
            time: convertHoursToTimeText(artDay||0),
            total: convertHoursToTimeText(artDay||0),
        },
        week: {
            time: convertHoursToTimeText(artWeek||0),
            total: convertHoursToTimeText((artWeek - artDay)||0),
        },
        month: {
            time: convertHoursToTimeText(artMonth||0),
            total: convertHoursToTimeText((artMonth - artWeek)||0),
        }
    };
  };

  CustomerSatisfactionTrendReport = ({ dataset }) => {
    const time_series = timeseriesExtract({dataset: {dataset}, key: "dataset"})

    const dayArr = {}, weekArr = {}, monthArr = {};

    let {upper: upperDay, lower: lowerDay} = getLowerAndUpperBoundDates({ dataset: time_series, key: "day" })
    let {upper: upperWeek, lower: lowerWeek} = getLowerAndUpperBoundDates({ dataset: time_series, key: "week" })
    let {upper: upperMonth, lower: lowerMonth} = getLowerAndUpperBoundDates({ dataset: time_series, key: "month" })

    listDatesBetween(lowerDay, upperDay).forEach((day) => {
        const dateIndex = formatDateToShort(day);
        dayArr[dateIndex] = {
            name: formatDateToShort(day),
            'Average Sentiment': 0,
            amt: 0,
            count: 0,
        };
    });

    listDatesBetween(lowerWeek, upperWeek).forEach((day) => {
        const dateIndex = formatDateToShort(day);
        weekArr[dateIndex] = {
            name: formatDateToShort(day),
            'Average Sentiment': 0,
            amt: 0,
            count: 0,
        };
    });

    listDatesBetween(lowerMonth, upperMonth).forEach((day) => {
        const dateIndex = formatDateToShort(day);
        monthArr[dateIndex] = {
            name: formatDateToShort(day),
            'Average Sentiment': 0,
            amt: 0,
            count: 0,
        };
    });

    time_series.day.forEach((e) => {
        const dateIndex = formatDateToShort(new Date(e.createdDate));
        if (dayArr[dateIndex] !== undefined && e.sentimentScore > 0) {
            dayArr[dateIndex]['Average Sentiment'] += e.sentimentScore / 10;
            dayArr[dateIndex].count += 1;
        }
    });

    time_series.week.forEach((e) => {
        const dateIndex = formatDateToShort(new Date(e.createdDate));
        if (weekArr[dateIndex] !== undefined && e.sentimentScore > 0) {
            weekArr[dateIndex]['Average Sentiment'] += e.sentimentScore / 10;
            weekArr[dateIndex].count += 1;
        }
    });

    time_series.month.forEach((e) => {
        const dateIndex = formatDateToShort(new Date(e.createdDate));
        if (monthArr[dateIndex] !== undefined && e.sentimentScore > 0) {
            monthArr[dateIndex]['Average Sentiment'] += e.sentimentScore / 10;
            monthArr[dateIndex].count += 1;
        }
    });

    const dayRes = Object.values(dayArr).map((entry) => {
        if (entry.count !== 0) {
            entry['Average Sentiment'] = ((entry['Average Sentiment'] / entry.count) * 100).toFixed(1);
        }
        return entry;
    });

    const weekRes = Object.values(weekArr).map((entry) => {
        if (entry.count !== 0) {
            entry['Average Sentiment'] = ((entry['Average Sentiment'] / entry.count) * 100).toFixed(1);
        }
        return entry;
    });

    const monthRes = Object.values(monthArr).map((entry) => {
        if (entry.count !== 0) {
            entry['Average Sentiment'] = ((entry['Average Sentiment'] / entry.count) * 100).toFixed(1);
        }
        return entry;
    });

    return {
        day: dayRes,
        week: weekRes,
        month: monthRes
    };
};


}
