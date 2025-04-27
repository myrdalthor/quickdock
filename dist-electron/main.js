const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const isDev = process.env.NODE_ENV === "development";
let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 300,
    height: 800,
    x: 0,
    y: 0,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
  mainWindow.setAlwaysOnTop(true, "floating");
  mainWindow.setVisibleOnAllWorkspaces(true);
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
ipcMain.handle("open-file-picker", async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    filters: [
      { name: "Applications", extensions: ["exe", "lnk"] },
      { name: "All Files", extensions: ["*"] }
    ]
  });
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});
ipcMain.handle("set-startup", async (event, enable) => {
  const appFolder = path.dirname(process.execPath);
  const updateExe = path.resolve(appFolder, "..", "Update.exe");
  const exeName = path.basename(process.execPath);
  app.setLoginItemSettings({
    openAtLogin: enable,
    path: updateExe,
    args: [
      "--processStart",
      `"${exeName}"`,
      "--process-start-args",
      `"--hidden"`
    ]
  });
});
