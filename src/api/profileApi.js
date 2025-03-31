// /src/api/profileApi.js
import BASE_URL from "../constants/api";

export const updateProfilePic = async (userToken, fileUri, fileType, fileName) => {
  const formData = new FormData();
  formData.append("file", {
    uri: fileUri,
    type: fileType,
    name: fileName,
  });

  const response = await fetch(`${BASE_URL}/update_profile_pic`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${userToken}`,
      // Note: Do NOT set "Content-Type" manually for FormData.
    },
    body: formData,
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || "Failed to update profile picture");
  }
  return json.data;
};
