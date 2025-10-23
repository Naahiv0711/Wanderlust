const formatCategoryString = (queryValue) => {
  if (!queryValue) return null;

  const spacedString = queryValue.replace(/-/g, " ");

  const formattedString = spacedString
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return formattedString;
};

module.exports = formatCategoryString;
