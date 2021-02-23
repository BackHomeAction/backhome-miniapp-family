import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import calendar from "dayjs/plugin/calendar";
import isToday from "dayjs/plugin/isToday";
dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(isToday);
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");

export default dayjs;
