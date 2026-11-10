const DESKTOP_RELEASE_CHANNEL_ENV_NAME = "BB_DESKTOP_RELEASE_CHANNEL";
const DESKTOP_FLAVOR_ENV_NAME = "BB_DESKTOP_FLAVOR";

export function resolveDesktopFlavor(env) {
  const rawFlavor = env[DESKTOP_FLAVOR_ENV_NAME]?.trim();
  if (rawFlavor === undefined || rawFlavor.length === 0) {
    return "bb";
  }
  if (rawFlavor === "bb" || rawFlavor === "glass") {
    return rawFlavor;
  }

  throw new Error(
    `${DESKTOP_FLAVOR_ENV_NAME} must be bb or glass, got ${rawFlavor}.`,
  );
}

export function resolveDesktopReleaseChannel(env) {
  const rawChannel = env[DESKTOP_RELEASE_CHANNEL_ENV_NAME]?.trim();
  if (rawChannel === undefined || rawChannel.length === 0) {
    return "latest";
  }
  if (rawChannel === "latest" || rawChannel === "nightly") {
    return rawChannel;
  }

  throw new Error(
    `${DESKTOP_RELEASE_CHANNEL_ENV_NAME} must be latest or nightly, got ${rawChannel}.`,
  );
}

export function resolveDesktopBuildPlatform(nodePlatform) {
  if (nodePlatform === "darwin") {
    return "macos";
  }
  if (nodePlatform === "linux") {
    return "linux";
  }
  if (nodePlatform === "win32") {
    return "windows";
  }

  throw new Error(
    `Desktop builds support darwin, linux, and win32 only, got ${nodePlatform}.`,
  );
}

export function createDesktopReleaseConfig(channel, flavor) {
  if (flavor === "glass") {
    return {
      appId: "dev.bbglass.desktop",
      applicationName: "BB Glass",
      artifactName: "bb-glass-${version}-${arch}.${ext}",
      iconFileName: "icon-glass.png",
      linuxExecutableName: "bb-glass",
      macIconPath: "assets/icon-glass.icns",
      releaseTag: "desktop-glass",
      windowsInstallName: "bb-glass",
      updateMetadataFileNames: {
        linux: "latest-linux.yml",
        macos: "latest-mac.yml",
        windows: "latest.yml",
      },
    };
  }
  if (channel === "nightly") {
    return {
      appId: "dev.bb.desktop.nightly",
      applicationName: "bb Nightly",
      artifactName: "bb-nightly-${version}-${arch}.${ext}",
      iconFileName: "icon-nightly.png",
      // The Linux binary name must differ from stable so both channels can be
      // installed at once without one shadowing the other on PATH.
      linuxExecutableName: "bb-nightly",
      macIconPath: "assets/icon-nightly.icns",
      releaseTag: "desktop-nightly",
      windowsInstallName: "bb-nightly",
      updateMetadataFileNames: {
        linux: "nightly-linux.yml",
        macos: "nightly-mac.yml",
        windows: "nightly.yml",
      },
    };
  }

  return {
    appId: "dev.bb.desktop",
    applicationName: "bb",
    artifactName: "${productName}-${version}-${arch}.${ext}",
    iconFileName: "icon.png",
    linuxExecutableName: "bb",
    macIconPath: "assets/icon.icns",
    releaseTag: "desktop-latest",
    windowsInstallName: "bb",
    updateMetadataFileNames: {
      linux: "latest-linux.yml",
      macos: "latest-mac.yml",
      windows: "latest.yml",
    },
  };
}

export function createDesktopUpdateReleaseBaseUrl(releaseTag) {
  return `https://github.com/get-bb/bb/releases/download/${releaseTag}/`;
}
