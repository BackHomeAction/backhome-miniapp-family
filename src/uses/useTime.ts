import dayjs from "@/utils/dayjs";

export const useTime = () => {
  const getCalendarTime = (time: string) => {
    return dayjs(time).calendar(dayjs(), {
      sameDay: "今天 HH:mm", // The same day ( Today at 2:30 AM )
      nextDay: "明天 HH:mm", // The next day ( Tomorrow at 2:30 AM )
      nextWeek: "周dd HH:mm", // The next week ( Sunday at 2:30 AM )
      lastDay: "昨天 HH:mm", // The day before ( Yesterday at 2:30 AM )
      lastWeek: "上周dd HH:mm", // Last week ( Last Monday at 2:30 AM )
      sameElse: "YYYY-MM-DD HH:mm", // Everything else ( 7/10/2011 )
    });
  };

  const parseDate = (time: string) => {
    return dayjs(time).format("YYYY-MM-DD");
  };

  const parseDateTime = (time: string, withSecond = true) => {
    const template = withSecond ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD HH:mm";
    return dayjs(time).format(template);
  };

  return { getCalendarTime, parseDate, parseDateTime };
};
