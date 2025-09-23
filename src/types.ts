export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: FileNode[];
  isOpen?: boolean;
  fileType?: "html" | "css" | "js";
}

export interface CreateFileRequest {
  name: string;
  fileType: "html" | "css" | "js";
  parentId?: string;
}

export interface CreateFolderRequest {
  name: string;
  parentId?: string;
}

export interface UpdateFileRequest {
  content: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}
