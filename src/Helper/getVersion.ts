import { execShellCommand } from "./execShellCommand";

export function getVersion() {
  return execShellCommand('git describe --tags --always');
}
