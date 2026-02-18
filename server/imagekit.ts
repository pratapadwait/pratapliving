import ImageKit from "@imagekit/nodejs";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

export function getAuthParams() {
  return imagekit.helper.getAuthenticationParameters();
}

export async function uploadToImageKit(
  file: Buffer | string,
  fileName: string,
  folder: string
): Promise<{ url: string; fileId: string; filePath: string }> {
  const response = await imagekit.files.upload({
    file,
    fileName,
    folder,
    useUniqueFileName: true,
  });

  return {
    url: response.url!,
    fileId: response.fileId!,
    filePath: response.filePath!,
  };
}

export async function deleteFromImageKit(fileId: string): Promise<void> {
  await imagekit.files.delete(fileId);
}

export { imagekit };
