import logger from 'electron-log';
import path from 'path';
import { ROOT } from './settings';
import { promises as fs } from 'fs';

export const PID_IPFS_FILE_PATH = path.join(ROOT, 'ipfs.pid');
export const PID_FOLLOWER_FILE_PATH = path.join(ROOT, 'ipfs-cluster-follow.pid');

export async function getPid(filePath: string): Promise<number | null> {
  try {
    const pid = await fs.readFile(filePath, 'utf8');
    return Number(pid);
  } catch (e) {
    logger.error(e);
    return null;
  }
}
