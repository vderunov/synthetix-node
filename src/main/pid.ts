import { exec } from 'child_process';
import logger from 'electron-log';
import { readFileSync, writeFileSync, existsSync, promises as fs } from 'fs';

const PID_FILE_PATH = './process_ids.json';

export async function killPids() {
  if (!existsSync(PID_FILE_PATH)) {
    logger.log('File with pids does not exist or has already been deleted');
    return;
  }

  try {
    const rawData = readFileSync(PID_FILE_PATH, 'utf8');
    const pidObject = JSON.parse(rawData);
    const isWin32 = process.platform === 'win32';

    Object.keys(pidObject).forEach((processName) => {
      const pid = pidObject[processName];
      if (!pid) {
        throw new Error(`No PID found for process ${processName}`);
      }

      if (isWin32) {
        exec(`taskkill /F /PID ${pid}`);
      } else {
        process.kill(pid);
      }
    });

    if (existsSync(PID_FILE_PATH)) {
      await fs.rm(PID_FILE_PATH);
    }
  } catch (e) {
    logger.error('An error occurred while trying to stop processes: ', e);
  }
}

export function getPid(processName: string): number | null {
  if (existsSync(PID_FILE_PATH)) {
    const pidObject = JSON.parse(readFileSync(PID_FILE_PATH, 'utf8'));
    return pidObject[processName] ?? null;
  } else {
    logger.log(`PID file does not exist: ${PID_FILE_PATH}`);
    return null;
  }
}

export function savePids(processName: string, processId: number) {
  const existingProcesses = existsSync(PID_FILE_PATH)
    ? JSON.parse(readFileSync(PID_FILE_PATH, 'utf8'))
    : {};

  existingProcesses[processName] = processId;

  writeFileSync(PID_FILE_PATH, JSON.stringify(existingProcesses));
}
