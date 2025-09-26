import { act } from "react";

export async function uploadImage(file: File) {
  const res = await fetch("/api/presign-url", {
    method: "POST",
    body: JSON.stringify({ fileType: file.type }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    console.log("Presign URL request failed:", res.status, res.statusText);
    throw new Error(`Presign URL request failed: ${res.status} ${res.statusText}`);
  }

  let json;
  try {
    json = await res.json();
  } catch (err) {
    throw new Error("Presign URL response is not valid JSON");
  }
  console.log("Presign URL response:", json);

  const { uploadUrl, key } = json;

  await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  return `https://${process.env.NEXT_PUBLIC_UPLOAD_BUCKET}.s3.amazonaws.com/${key}`;
}

export async function uploadAsset(file: File, category: string) {
  try {
    const res = await fetch(`/api/presign-asset-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileType: file.type, category, action: "upload" }),
    });

    if (!res.ok) {
      console.error("Failed to get presigned URL:", res.status, res.statusText);
      throw new Error("Failed to get presigned URL");
    }

    const { url, key } = await res.json();

    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    return `https://${process.env.NEXT_PUBLIC_ASSETS_BUCKET}.s3.amazonaws.com/${key}`;
  } catch (err) {
    console.error("Error uploading asset:", err);
    throw new Error("Failed to upload asset");
  }
}