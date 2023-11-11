import multer from 'multer'
import path from 'path'
import fs from 'fs'

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, 'public/profile_pictures');
  },
  filename: function (req: any, file: any, cb: any) {
    // Generate a unique file name (you could use the user's id or a UUID)
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

export async function deleteFile(filename: string | null) 
{
  if (filename === null) {
    return;
  }

  await fs.unlink(`public/profile_pictures/${filename}`, (err) => {
    if (err) {
      // Handle the error if the file is not deleted
      console.log("Error deleting file", err);
    } else {
      // If no error, the file has been deleted successfully
      console.log("File deleted successfully");
    }
  });
};

export const upload = multer({ storage: storage });
