const PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY || "";
const AUTH = Buffer.from(PRIVATE_KEY + ":").toString("base64");

async function apiCall(endpoint: string, method = "GET", body?: any) {
  const opts: any = {
    method,
    headers: {
      "Authorization": `Basic ${AUTH}`,
      "Content-Type": "application/json",
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`https://api.imagekit.io/v1${endpoint}`, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${method} ${endpoint}: ${res.status} - ${text}`);
  }
  if (method === "GET") return res.json();
  return res.text();
}

async function listFiles(path: string) {
  return apiCall(`/files?path=${encodeURIComponent(path)}&limit=100`);
}

async function moveFile(sourceFilePath: string, destinationPath: string) {
  try {
    await apiCall("/files/move", "POST", { sourceFilePath, destinationPath });
    console.log(`  Moved: ${sourceFilePath} → ${destinationPath}`);
    return true;
  } catch (err: any) {
    console.error(`  Error: ${err.message}`);
    return false;
  }
}

async function createFolder(folderName: string, parentFolderPath: string) {
  try {
    await apiCall("/folder", "POST", { folderName, parentFolderPath });
    console.log(`Created folder: ${parentFolderPath}/${folderName}`);
  } catch (err: any) {
    console.log(`Folder ${parentFolderPath}/${folderName}: ${err.message?.includes("already") ? "exists" : err.message}`);
  }
}

async function main() {
  console.log("Listing files in /pratapliving-com/...");
  const files: any[] = await listFiles("/pratapliving-com");
  console.log(`Found ${files.length} files\n`);
  files.forEach((f: any) => console.log(`  ${f.name} (${f.filePath})`));
  console.log("");

  console.log("Creating subfolders...");
  await createFolder("site", "/pratapliving-com");
  await createFolder("property-types", "/pratapliving-com");
  await createFolder("testimonials", "/pratapliving-com");
  await createFolder("properties", "/pratapliving-com");
  await createFolder("penthouse-suite-at-omaxe", "/pratapliving-com/properties");
  await createFolder("entire-villa-at-golf-city", "/pratapliving-com/properties");
  console.log("");

  const moveMap: { pattern: string; dest: string }[] = [
    { pattern: "hero-lucknow", dest: "/pratapliving-com/site/" },
    { pattern: "logo_", dest: "/pratapliving-com/site/" },
    { pattern: "property-homestay", dest: "/pratapliving-com/property-types/" },
    { pattern: "property-suite", dest: "/pratapliving-com/property-types/" },
    { pattern: "property-apartment", dest: "/pratapliving-com/property-types/" },
    { pattern: "property-villa", dest: "/pratapliving-com/property-types/" },
    { pattern: "testimonial-family", dest: "/pratapliving-com/testimonials/" },
    { pattern: "testimonial-business", dest: "/pratapliving-com/testimonials/" },
    { pattern: "testimonial-couple", dest: "/pratapliving-com/testimonials/" },
    { pattern: "penthouse-suite-at-omaxe", dest: "/pratapliving-com/properties/penthouse-suite-at-omaxe/" },
    { pattern: "entire-villa-at-golf-city", dest: "/pratapliving-com/properties/entire-villa-at-golf-city/" },
  ];

  console.log("Moving files to organized subfolders...");
  for (const file of files) {
    const mapping = moveMap.find(m => file.name.includes(m.pattern));
    if (mapping) {
      await moveFile(file.filePath, mapping.dest);
    } else {
      console.log(`  Skipped: ${file.name}`);
    }
  }

  console.log("\n=== VERIFYING STRUCTURE ===");
  for (const folder of ["/pratapliving-com/site", "/pratapliving-com/property-types", "/pratapliving-com/testimonials", "/pratapliving-com/properties/penthouse-suite-at-omaxe", "/pratapliving-com/properties/entire-villa-at-golf-city"]) {
    const folderFiles: any[] = await listFiles(folder);
    console.log(`${folder}/: ${folderFiles.length} files`);
    folderFiles.forEach((f: any) => console.log(`  - ${f.name} → ${f.url}`));
  }
}

main().catch(console.error);
