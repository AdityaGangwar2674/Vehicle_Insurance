const express = require("express");
// utils/url.helper.js
exports.getFullImageUrl = (req, filePath) => {
  if (!filePath) return null;

  // If already a full URL, return as is
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }
  const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;

  return `${req.protocol}://${req.get("host")}/${cleanPath.replace(
    /\\/g,
    "/"
  )}`;
};
