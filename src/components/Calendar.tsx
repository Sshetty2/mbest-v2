import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Calendar from 'react-calendar';
import { setDateRange } from '../store/dateSlice';
import { endOfDay, startOfDay, formatISO } from 'date-fns';
import { Value } from 'react-calendar/src/shared/types.js';

import 'react-calendar/dist/Calendar.css';

interface CalendarProps {
  onDateChange?: (dates: [Date, Date]) => void;
}

export const CalendarComponent = ({ onDateChange }: CalendarProps) => {
  const today = new Date();
  const [selectedDates, setSelectedDates] = useState<Value>(today);
  const dispatch = useDispatch();

  const handleDateChange = (value: Value) => {
    setSelectedDates(value);

    if (Array.isArray(value) && value.length === 2) {
      const [start, end] = value;

      const formattedStartDate = formatISO(startOfDay(start as Date));
      const formattedEndDate = formatISO(endOfDay(end as Date));

      dispatch(setDateRange({
        startDate: formattedStartDate,
        endDate  : formattedEndDate
      }));

      onDateChange?.([start as Date, end as Date]);
    }
  };

  return (
    <Calendar
      onChange={handleDateChange}
      value={selectedDates}
      selectRange={true}
      minDate={today}
    />
  );
};
