import { timeToMinutes } from './timeUtils';

// Calculate event position and height based on start time and duration
export const getEventPosition = (startTime, duration) => {
  const startMinutes = timeToMinutes(startTime);
  const startHour = 8 * 60; // 8:00 AM in minutes (480 minutes)
  const slotHeight = 33; // Each 15-minute slot is 32px
  
  // Calculate which 15-minute slot this event starts in
  const minutesFromStart = startMinutes - startHour;
  const startSlot = minutesFromStart / 15;
  const durationSlots = duration / 15;
  
  return {
    top: startSlot * slotHeight,
    height: durationSlots * slotHeight
  };
};

// Format time string (pass-through for now, can be extended)
export const formatTime = (timeStr) => {
  return timeStr;
};

// Calculate end time based on start time and duration
export const getEndTime = (startTime, duration) => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = startMinutes + duration;
  const endHours = Math.floor(endMinutes / 60);
  const endMins = endMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
};

// Get appropriate icon for course type
export const getCourseIcon = (title) => {
  const course = title.toLowerCase();
  if (course.includes('math')) return '🔢';
  if (course.includes('physics')) return '⚛️';
  if (course.includes('chemistry')) return '🧪';
  if (course.includes('biology')) return '🧬';
  if (course.includes('computer')) return '💻';
  if (course.includes('english') || course.includes('literature')) return '📚';
  if (course.includes('history')) return '🏛️';
  if (course.includes('art')) return '🎨';
  if (course.includes('economics')) return '📊';
  if (course.includes('philosophy')) return '🤔';
  if (course.includes('psychology')) return '🧠';
  if (course.includes('study') || course.includes('research')) return '📖';
  if (course.includes('tutorial')) return '🎯';
  if (course.includes('seminar') || course.includes('presentation')) return '🎓';
  if (course.includes('statistics')) return '📈';
  if (course.includes('safety')) return '🦺';
  return '📋';
};

// Get color styling for event based on color name
export const getEventStyle = (color) => {
  const colorMap = {
    blue: { bg: '#3B82F6', text: 'white' },
    green: { bg: '#10B981', text: 'white' },
    red: { bg: '#EF4444', text: 'white' },
    purple: { bg: '#8B5CF6', text: 'white' },
    indigo: { bg: '#6366F1', text: 'white' },
    yellow: { bg: '#F59E0B', text: 'black' },
    orange: { bg: '#F97316', text: 'white' },
    pink: { bg: '#EC4899', text: 'white' },
    gray: { bg: '#6B7280', text: 'white' },
    teal: { bg: '#14B8A6', text: 'white' },
  };
  return colorMap[color] || colorMap.blue;
};
