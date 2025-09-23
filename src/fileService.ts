import { FileNode } from "./types.js";
import { v4 as uuidv4 } from "uuid";

// داده‌های ابتدایی پروژه (همان داده‌هایی که در فرانت‌اند بود)
const initialFileTree: FileNode[] = [
  {
    id: "src",
    name: "src",
    type: "folder",
    isOpen: true,
    children: [
      {
        id: "index.html",
        name: "index.html",
        type: "file",
        fileType: "html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Hello World!</h1>
    <p>Welcome to my code editor</p>
    <script src="script.js"></script>
</body>
</html>`,
      },
      {
        id: "styles.css",
        name: "styles.css",
        type: "file",
        fileType: "css",
        content: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

h1 {
    color: #333;
    text-align: center;
}

p {
    color: #666;
    text-align: center;
    font-size: 16px;
}`,
      },
      {
        id: "script.js",
        name: "script.js",
        type: "file",
        fileType: "js",
        content: `console.log('Hello from script.js');

function greetUser() {
    const name = prompt('What is your name?');
    if (name) {
        alert('Hello, ' + name + '!');
    }
}

// Call the function when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM is ready');
    
    // Add click event to h1
    const h1 = document.querySelector('h1');
    if (h1) {
        h1.addEventListener('click', greetUser);
    }
});`,
      },
    ],
  },
  {
    id: "components",
    name: "components",
    type: "folder",
    isOpen: false,
    children: [
      {
        id: "header.html",
        name: "header.html",
        type: "file",
        fileType: "html",
        content: `<header class="main-header">
    <nav>
        <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </nav>
</header>`,
      },
      {
        id: "footer.js",
        name: "footer.js",
        type: "file",
        fileType: "js",
        content: `function createFooter() {
    const footer = document.createElement('footer');
    footer.innerHTML = '<p>&copy; 2024 My Website. All rights reserved.</p>';
    footer.className = 'main-footer';
    return footer;
}

// Export for use in other files
window.createFooter = createFooter;`,
      },
    ],
  },
];

class FileService {
  private fileTree: FileNode[] = JSON.parse(JSON.stringify(initialFileTree));

  // دریافت تمام فایل‌ها و فولدرها
  getFileTree(): FileNode[] {
    return this.fileTree;
  }

  // پیدا کردن فایل یا فولدر بر اساس ID
  findItemById(id: string, nodes: FileNode[] = this.fileTree): FileNode | null {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children) {
        const found = this.findItemById(id, node.children);
        if (found) return found;
      }
    }
    return null;
  }

  // دریافت محتوای فایل
  getFileContent(fileId: string): string | null {
    const file = this.findItemById(fileId);
    if (file && file.type === "file") {
      return file.content || "";
    }
    return null;
  }

  // بروزرسانی محتوای فایل
  updateFileContent(fileId: string, content: string): boolean {
    const file = this.findItemById(fileId);
    if (file && file.type === "file") {
      file.content = content;
      return true;
    }
    return false;
  }

  // ایجاد فایل جدید
  createFile(
    name: string,
    fileType: "html" | "css" | "js",
    parentId?: string
  ): FileNode | null {
    const newFile: FileNode = {
      id: uuidv4(),
      name,
      type: "file",
      fileType,
      content: this.getDefaultContent(fileType),
    };

    if (parentId) {
      const parent = this.findItemById(parentId);
      if (parent && parent.type === "folder") {
        if (!parent.children) parent.children = [];
        parent.children.push(newFile);
        parent.isOpen = true;
        return newFile;
      }
      return null;
    } else {
      this.fileTree.push(newFile);
      return newFile;
    }
  }

  // ایجاد فولدر جدید
  createFolder(name: string, parentId?: string): FileNode | null {
    const newFolder: FileNode = {
      id: uuidv4(),
      name,
      type: "folder",
      isOpen: true,
      children: [],
    };

    if (parentId) {
      const parent = this.findItemById(parentId);
      if (parent && parent.type === "folder") {
        if (!parent.children) parent.children = [];
        parent.children.push(newFolder);
        parent.isOpen = true;
        return newFolder;
      }
      return null;
    } else {
      this.fileTree.push(newFolder);
      return newFolder;
    }
  }

  // حذف فایل یا فولدر
  deleteItem(itemId: string): boolean {
    const deleteFromArray = (nodes: FileNode[]): boolean => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === itemId) {
          nodes.splice(i, 1);
          return true;
        }
        if (nodes[i].children) {
          if (deleteFromArray(nodes[i].children!)) {
            return true;
          }
        }
      }
      return false;
    };

    return deleteFromArray(this.fileTree);
  }

  // تغییر وضعیت باز/بسته فولدر
  toggleFolder(folderId: string): boolean {
    const folder = this.findItemById(folderId);
    if (folder && folder.type === "folder") {
      folder.isOpen = !folder.isOpen;
      return true;
    }
    return false;
  }

  // محتوای پیش‌فرض برای انواع فایل
  private getDefaultContent(fileType: "html" | "css" | "js"): string {
    switch (fileType) {
      case "html":
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`;
      case "css":
        return `/* Your CSS styles here */

`;
      case "js":
        return `// Your JavaScript code here

`;
      default:
        return "";
    }
  }

  // ریست کردن پروژه به حالت اولیه
  resetProject(): void {
    this.fileTree = JSON.parse(JSON.stringify(initialFileTree));
  }
}

export const fileService = new FileService();
