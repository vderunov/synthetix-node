import { downloadFollower, followerDaemon } from '../main/follower';
import { killPids } from '../main/pid';

async function main() {
  await downloadFollower();
  await followerDaemon();
}

process.on('beforeExit', killPids);
main();
