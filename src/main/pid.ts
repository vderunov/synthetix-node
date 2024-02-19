import { exec } from 'child_process';
import logger from 'electron-log';
import { readFileSync, existsSync, promises as fs } from 'fs';
import path from 'path';
import { ROOT } from './settings';

export const PID_IPFS_FILE_PATH = path.join(ROOT, 'ipfs_process_id.txt');
export const PID_FOLLOWER_FILE_PATH = path.join(ROOT, 'follower_process_id.txt');

export async function killPids() {
  await killPidFromFilePath(PID_IPFS_FILE_PATH, 'ipfs');
  await killPidFromFilePath(PID_FOLLOWER_FILE_PATH, 'follower');
  await deleteFiles();
}

async function killPidFromFilePath(PID_FILE_PATH: string, processLabel: string) {
  if (!existsSync(PID_FILE_PATH)) {
    logger.log(`File with ${processLabel} pid does not exist or has already been deleted`);
    return;
  }

  try {
    const pid = readFileSync(PID_FILE_PATH, 'utf8').trim();

    if (!pid) {
      throw new Error(`No PID found for process ${processLabel}`);
    }

    if (process.platform === 'win32') {
      exec(`taskkill /F /PID ${pid}`);
    } else {
      process.kill(Number(pid));
    }
  } catch (e) {
    logger.error(`An error occurred while trying to stop ${processLabel} process: `, e);
  }
}

async function deleteFiles() {
  await Promise.all(
    [PID_IPFS_FILE_PATH, PID_FOLLOWER_FILE_PATH].map((path) =>
      fs.rm(path).catch((err) => {
        logger.error(`Could not delete ${path}: `, err.message);
      })
    )
  );
}

export function isPidExist(PID_FILE_PATH: string): boolean {
  if (existsSync(PID_FILE_PATH)) {
    return !!readFileSync(PID_FILE_PATH, 'utf8').trim();
  } else {
    logger.log(`PID file does not exist: ${PID_FILE_PATH}`);
    return false;
  }
}
