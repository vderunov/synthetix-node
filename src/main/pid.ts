import logger from 'electron-log';
import path from 'path';
import { ROOT } from './settings';
import { readFileSync } from 'fs';

export const PID_IPFS_FILE_PATH = path.join(ROOT, 'ipfs.pid');
export const PID_FOLLOWER_FILE_PATH = path.join(ROOT, 'ipfs-cluster-follow.pid');

export function getPid(filePath: string): number | null {
  try {
    const pid = readFileSync(filePath, 'utf8');
    return Number(pid);
  } catch (e) {
    logger.error(e);
    return null;
  }
}
