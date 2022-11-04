import { BrowserWindow } from 'electron'
function createWindow() {
  /**
   * Initial window options
   */

  let mainWindow = new BrowserWindow({
    height: 720,
    useContentSize: true,
    width: 1280
  })
  // 设置全屏
  mainWindow.setFullScreen(true)
  // 隐藏菜单
  mainWindow.setMenu(null)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
createWindow()
