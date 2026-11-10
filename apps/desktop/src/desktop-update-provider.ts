import {
  createBbDesktopVersionFeedFileName,
  type BbDesktopVersionFeedPlatform,
} from "@bb/desktop-contract";

type DesktopReleaseChannel = "latest" | "nightly";
type DesktopFlavor = "bb" | "glass";

interface DesktopReleaseInfo {
  appId: "dev.bb.desktop" | "dev.bb.desktop.nightly" | "dev.bbglass.desktop";
  applicationName: "bb" | "bb Nightly" | "BB Glass";
  channel: DesktopReleaseChannel;
  iconFileName: "icon.png" | "icon-nightly.png" | "icon-glass.png";
  releaseTag: "desktop-latest" | "desktop-nightly";
  updateReleaseBaseUrl: string;
}

export function createDesktopReleaseInfo(
  channel: DesktopReleaseChannel,
  flavor: DesktopFlavor,
): DesktopReleaseInfo {
  const nightly = channel === "nightly";
  const releaseTag = nightly ? "desktop-nightly" : "desktop-latest";

  if (flavor === "glass") {
    return {
      appId: "dev.bbglass.desktop",
      applicationName: "BB Glass",
      channel,
      iconFileName: "icon-glass.png",
      releaseTag,
      updateReleaseBaseUrl: `https://github.com/get-bb/bb/releases/download/${releaseTag}/`,
    };
  }

  return {
    appId: nightly ? "dev.bb.desktop.nightly" : "dev.bb.desktop",
    applicationName: nightly ? "bb Nightly" : "bb",
    channel,
    iconFileName: nightly ? "icon-nightly.png" : "icon.png",
    releaseTag,
    updateReleaseBaseUrl: `https://github.com/get-bb/bb/releases/download/${releaseTag}/`,
  };
}

function resolveBuiltDesktopReleaseChannel(
  rawChannel: string | undefined,
): DesktopReleaseChannel {
  if (rawChannel === undefined || rawChannel.length === 0) {
    return "latest";
  }
  if (rawChannel === "latest" || rawChannel === "nightly") {
    return rawChannel;
  }

  throw new Error(
    `Built desktop release channel must be latest or nightly, got ${String(rawChannel)}.`,
  );
}

export const DESKTOP_RELEASE_CHANNEL = resolveBuiltDesktopReleaseChannel(
  process.env.BB_DESKTOP_RELEASE_CHANNEL,
);
export const DESKTOP_FLAVOR: DesktopFlavor =
  process.env.BB_DESKTOP_FLAVOR === "glass" ? "glass" : "bb";
export const DESKTOP_RELEASE_INFO = createDesktopReleaseInfo(
  DESKTOP_RELEASE_CHANNEL,
  DESKTOP_FLAVOR,
);
const DESKTOP_UPDATE_RELEASE_BASE_URL =
  DESKTOP_RELEASE_INFO.updateReleaseBaseUrl;

export function createDesktopUpdateFeedUrl(
  platform: BbDesktopVersionFeedPlatform,
): string {
  return `${DESKTOP_UPDATE_RELEASE_BASE_URL}${createBbDesktopVersionFeedFileName(platform)}`;
}

export interface DesktopAutoUpdateFeedConfig {
  channel: DesktopReleaseChannel;
  provider: "generic";
  url: string;
}

export const DESKTOP_AUTO_UPDATE_FEED_CONFIG: DesktopAutoUpdateFeedConfig = {
  channel: DESKTOP_RELEASE_CHANNEL,
  provider: "generic",
  url: DESKTOP_UPDATE_RELEASE_BASE_URL,
};

interface DesktopUpdateSupport {
  autoUpdate: boolean;
  versionCheck: boolean;
}

interface ResolveDesktopUpdateSupportArgs {
  canReplaceAppImage: (appImagePath: string) => boolean;
  env: NodeJS.ProcessEnv;
  platform: BbDesktopVersionFeedPlatform;
}

export function resolveDesktopUpdateSupport(
  args: ResolveDesktopUpdateSupportArgs,
): DesktopUpdateSupport {
  if (DESKTOP_FLAVOR === "glass") {
    return { autoUpdate: false, versionCheck: false };
  }
  if (args.platform === "macos" || args.platform === "windows") {
    return { autoUpdate: true, versionCheck: true };
  }

  const appImagePath = args.env.APPIMAGE?.trim() ?? "";
  if (appImagePath.length === 0) {
    return { autoUpdate: false, versionCheck: true };
  }

  return {
    autoUpdate: args.canReplaceAppImage(appImagePath),
    versionCheck: true,
  };
}
