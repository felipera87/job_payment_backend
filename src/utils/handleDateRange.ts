import {
  parseISO,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
} from 'date-fns';

type DateRange = {
  startDate: Date;
  endDate: Date;
};

export default function handleDateRange({
  startDate: startDateParam,
  endDate: endDateParam,
}: {
  startDate?: string;
  endDate?: string;
}): DateRange {
  let startDate = startDateParam ? parseISO(startDateParam as string) : null;
  let endDate = endDateParam ? parseISO(endDateParam as string) : null;

  if (!endDateParam) {
    endDate = new Date();
  }
  if (!startDateParam) {
    startDate = new Date(1900, 1, 1, 0, 0, 0, 0);
  }

  if (endDateParam && !endDateParam.includes('T')) {
    endDate = setHours(endDate, 23);
    endDate = setMinutes(endDate, 59);
    endDate = setSeconds(endDate, 59);
    endDate = setMilliseconds(endDate, 999);
  }

  return {
    startDate,
    endDate,
  };
}
