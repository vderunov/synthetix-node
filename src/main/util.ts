import { URL } from 'url';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function getPlatformDetails() {
  const arch = os.arch();
  const targetArch = arch === 'x64' ? 'amd64' : 'arm64';
  const osPlatform = process.platform === 'darwin' ? 'darwin' : 'windows';
  const fileExt = osPlatform === 'darwin' ? 'tar.gz' : 'zip';
  return { osPlatform, fileExt, targetArch };
}

export async function killProcess(pid: number) {
  if (process.platform === 'win32') {
    exec(`taskkill /F /PID ${pid}`);
  } else {
    process.kill(pid);
  }
}
