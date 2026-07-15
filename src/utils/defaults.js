export const DEFAULT_SETTINGS = {
  displayName: 'there',
  clock24h: false,
  searchEngine: 'google', // google | bing | duckduckgo
  tempUnit: 'c', // c | f
  manualCity: '',
  theme: 'system', // system | dark | light
  backgroundType: 'daily', // daily | custom | color | none
  customBackground: '',
  backgroundEnabled: true,
  pomodoroWork: 25,
  pomodoroShortBreak: 5,
  pomodoroLongBreak: 15,
  widgetVisibility: {
    greeting: true,
    search: true,
    todos: true,
    links: true,
    weather: true,
    quote: true,
    pomodoro: true,
  },
}

export const DEFAULT_WIDGET_ORDER = [
  'greeting',
  'search',
  'weather',
  'pomodoro',
  'todos',
  'links',
  'quote',
]

export const DEFAULT_LINKS = [
  { id: 'gmail', label: 'Gmail', url: 'https://mail.google.com' },
  { id: 'youtube', label: 'YouTube', url: 'https://youtube.com' },
  { id: 'github', label: 'GitHub', url: 'https://github.com' },
  { id: 'drive', label: 'Drive', url: 'https://drive.google.com' },
  { id: 'reddit', label: 'Reddit', url: 'https://reddit.com' },
  { id: 'calendar', label: 'Calendar', url: 'https://calendar.google.com' },
]

export const FALLBACK_QUOTES = [
  { content: 'The obstacle is the way.', author: 'Marcus Aurelius' },
  { content: 'What we think, we become.', author: 'Buddha' },
  { content: 'He who has a why to live can bear almost any how.', author: 'Nietzsche' },
  { content: 'The unexamined life is not worth living.', author: 'Socrates' },
  { content: 'You have power over your mind, not outside events.', author: 'Marcus Aurelius' },
  { content: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
  { content: 'It always seems impossible until it is done.', author: 'Nelson Mandela' },
  { content: 'The mind is everything. What you think you become.', author: 'Buddha' },
  { content: 'Whatever you are, be a good one.', author: 'Abraham Lincoln' },
  { content: 'Do the hard things first.', author: 'Unknown' },
  { content: 'Discipline is choosing between what you want now and what you want most.', author: 'Unknown' },
  { content: 'Fall seven times, stand up eight.', author: 'Japanese Proverb' },
  { content: 'A river cuts through rock not by power but persistence.', author: 'Jim Watkins' },
  { content: 'Small daily improvements are the key to staggering long-term results.', author: 'Unknown' },
  { content: 'The cave you fear to enter holds the treasure you seek.', author: 'Joseph Campbell' },
  { content: 'Action is the foundational key to all success.', author: 'Pablo Picasso' },
  { content: 'Well begun is half done.', author: 'Aristotle' },
  { content: 'Patience is bitter, but its fruit is sweet.', author: 'Aristotle' },
  { content: 'You must do the things you think you cannot do.', author: 'Eleanor Roosevelt' },
  { content: 'Turn your wounds into wisdom.', author: 'Oprah Winfrey' },
  { content: 'Energy and persistence conquer all things.', author: 'Benjamin Franklin' },
  { content: 'Out of clutter, find simplicity.', author: 'Albert Einstein' },
  { content: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb' },
  { content: 'Focus on being productive instead of busy.', author: 'Tim Ferriss' },
  { content: 'Start where you are. Use what you have. Do what you can.', author: 'Arthur Ashe' },
  { content: 'Success is the sum of small efforts repeated daily.', author: 'Robert Collier' },
  { content: 'Motivation gets you going, discipline keeps you growing.', author: 'John C. Maxwell' },
  { content: 'Slow is smooth, and smooth is fast.', author: 'Navy SEAL Proverb' },
  { content: 'What stands in the way becomes the way.', author: 'Marcus Aurelius' },
]

export const SEARCH_ENGINES = {
  google: { label: 'Google', url: (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}` },
  bing: { label: 'Bing', url: (q) => `https://www.bing.com/search?q=${encodeURIComponent(q)}` },
  duckduckgo: { label: 'DuckDuckGo', url: (q) => `https://duckduckgo.com/?q=${encodeURIComponent(q)}` },
}
