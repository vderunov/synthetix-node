import { downloadIpfs, ipfsDaemon } from '../main/ipfs';
import { killPids } from '../main/pid';

async function main() {
  await downloadIpfs();
  await ipfsDaemon();
}

process.on('beforeExit', killPids);
main();
