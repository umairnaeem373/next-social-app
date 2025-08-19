export const getAvatarColor = (name: string = 'New User' , darkMode: boolean = false) : string  => {
    const lightColors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-gray-500'
    ];
    const darkColors = [
      'bg-blue-600',
      'bg-green-500', 
      'bg-purple-600',
      'bg-pink-600',
      'bg-indigo-600',
      'bg-yellow-600',
      'bg-red-600',
      'bg-gray-600'
    ];
    const colors = darkMode ? darkColors : lightColors;
    const index = name.length % colors.length;
    return colors[index];
  };

  export const getInitials = (name: string = 'New User') : string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  export const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

export const safeLocalStorage = {
  getItem: (key: string) => (typeof window !== "undefined" ? localStorage.getItem(key) : null),
  setItem: (key: string, value: string) => {
    if (typeof window !== "undefined") localStorage.setItem(key, value);
  },
};