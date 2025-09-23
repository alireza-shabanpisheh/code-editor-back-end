import express from "express";
import cors from "cors";
import { fileService } from "./fileService.js";
import {
  ApiResponse,
  CreateFileRequest,
  CreateFolderRequest,
  UpdateFileRequest,
} from "./types.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// دریافت ساختار کامل فایل‌ها
app.get("/api/files", (req, res) => {
  try {
    const fileTree = fileService.getFileTree();
    const response: ApiResponse = {
      success: true,
      data: fileTree,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "خطا در دریافت فایل‌ها",
    };
    res.status(500).json(response);
  }
});

// دریافت محتوای یک فایل خاص
app.get("/api/files/:fileId/content", (req, res) => {
  try {
    const { fileId } = req.params;
    const content = fileService.getFileContent(fileId);

    if (content === null) {
      const response: ApiResponse = {
        success: false,
        message: "فایل یافت نشد",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: { content },
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "خطا در دریافت محتوای فایل",
    };
    res.status(500).json(response);
  }
});

// بروزرسانی محتوای فایل
app.put("/api/files/:fileId/content", (req, res) => {
  try {
    const { fileId } = req.params;
    const { content }: UpdateFileRequest = req.body;

    const success = fileService.updateFileContent(fileId, content);

    if (!success) {
      const response: ApiResponse = {
        success: false,
        message: "فایل یافت نشد",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      message: "فایل با موفقیت بروزرسانی شد",
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "خطا در بروزرسانی فایل",
    };
    res.status(500).json(response);
  }
});

// ایجاد فایل جدید
app.post("/api/files", (req, res) => {
  try {
    const { name, fileType, parentId }: CreateFileRequest = req.body;

    const newFile = fileService.createFile(name, fileType, parentId);

    if (!newFile) {
      const response: ApiResponse = {
        success: false,
        message: "خطا در ایجاد فایل",
      };
      return res.status(400).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: newFile,
      message: "فایل با موفقیت ایجاد شد",
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "خطا در ایجاد فایل",
    };
    res.status(500).json(response);
  }
});

// ایجاد فولدر جدید
app.post("/api/folders", (req, res) => {
  try {
    const { name, parentId }: CreateFolderRequest = req.body;

    const newFolder = fileService.createFolder(name, parentId);

    if (!newFolder) {
      const response: ApiResponse = {
        success: false,
        message: "خطا در ایجاد فولدر",
      };
      return res.status(400).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: newFolder,
      message: "فولدر با موفقیت ایجاد شد",
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "خطا در ایجاد فولدر",
    };
    res.status(500).json(response);
  }
});

// حذف فایل یا فولدر
app.delete("/api/items/:itemId", (req, res) => {
  try {
    const { itemId } = req.params;

    const success = fileService.deleteItem(itemId);

    if (!success) {
      const response: ApiResponse = {
        success: false,
        message: "آیتم یافت نشد",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      message: "آیتم با موفقیت حذف شد",
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "خطا در حذف آیتم",
    };
    res.status(500).json(response);
  }
});

// تغییر وضعیت فولدر (باز/بسته)
app.put("/api/folders/:folderId/toggle", (req, res) => {
  try {
    const { folderId } = req.params;

    const success = fileService.toggleFolder(folderId);

    if (!success) {
      const response: ApiResponse = {
        success: false,
        message: "فولدر یافت نشد",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      message: "وضعیت فولدر تغییر کرد",
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "خطا در تغییر وضعیت فولدر",
    };
    res.status(500).json(response);
  }
});

// ریست پروژه
app.post("/api/reset", (req, res) => {
  try {
    fileService.resetProject();

    const response: ApiResponse = {
      success: true,
      message: "پروژه به حالت اولیه بازگشت",
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "خطا در ریست پروژه",
    };
    res.status(500).json(response);
  }
});

// Health check
app.get("/api/health", (req, res) => {
  const response: ApiResponse = {
    success: true,
    message: "سرور در حال اجرا است",
  };
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📁 API endpoints available at http://localhost:${PORT}/api`);
});
