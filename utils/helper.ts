export const getAvatarColor = (name: string , darkMode?: boolean) : string  => {
    const lightColors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-gray-500",
    ];
    const darkColors = [
      "bg-blue-600",
      "bg-green-600",
      "bg-purple-600",
      "bg-pink-600",
      "bg-indigo-600",
      "bg-yellow-600",
      "bg-red-600",
      "bg-gray-600",
    ];
    const colors = darkMode ? darkColors : lightColors;
    const index = name.length % colors.length;
    return colors[index];
  };

  export const getInitials = (name: string) : string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };