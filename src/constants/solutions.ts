import type { SolutionPath } from '../types';

// ─── Wi-Fi Solutions ──────────────────────────────────────────────────────────

const wifiPhoneBasic: SolutionPath = {
  id: 'wifi-phone-basic',
  category: 'wifi',
  device: 'phone',
  title: 'Wi-Fi not connecting on phone',
  steps: [
    {
      id: 'step-1',
      title: 'Toggle Wi-Fi off and on',
      instruction: 'Open your phone Settings, then tap on Wi-Fi. Turn the Wi-Fi switch OFF, wait 5 seconds, then turn it back ON.',
      followUp: 'Did your phone reconnect to Wi-Fi?',
    },
    {
      id: 'step-2',
      title: 'Forget and rejoin the network',
      instruction: 'In your Wi-Fi settings, find your home network name and tap on it. Choose "Forget" or "Forget Network." Then tap the network again and enter your Wi-Fi password.',
      followUp: 'Did it connect after re-entering the password?',
    },
    {
      id: 'step-3',
      title: 'Restart your phone',
      instruction: 'Hold down the power button on the side of your phone. You will see an option to Restart or Power Off. Tap Restart. Wait about 30 seconds for it to start back up.',
      followUp: 'After restarting, did the Wi-Fi connect?',
    },
    {
      id: 'step-4',
      title: 'Restart your router',
      instruction: 'Find the Wi-Fi router in your home. It usually has blinking lights. Unplug the power cable from the back. Wait 30 seconds, then plug it back in. Wait 2 minutes for the lights to stabilize.',
      followUp: 'Did your phone connect after restarting the router?',
    },
  ],
};

const wifiLaptopBasic: SolutionPath = {
  id: 'wifi-laptop-basic',
  category: 'wifi',
  device: 'laptop',
  title: 'Wi-Fi not connecting on laptop',
  steps: [
    {
      id: 'step-1',
      title: 'Click the Wi-Fi icon',
      instruction: 'Look at the bottom-right corner of your screen for the Wi-Fi symbol (it looks like a small fan or signal bars). Click it. Make sure Wi-Fi is turned on, then click your home network name.',
      followUp: 'Can you see your home network in the list?',
    },
    {
      id: 'step-2',
      title: 'Turn airplane mode off',
      instruction: 'Sometimes airplane mode gets turned on by accident. Click the network icon in the bottom right, and check if Airplane Mode is highlighted. If it is, click it to turn it off.',
      followUp: 'Was airplane mode on? Did turning it off help?',
    },
    {
      id: 'step-3',
      title: 'Restart your laptop',
      instruction: 'Click the Start button (Windows logo) at the bottom left. Click the Power icon, then choose Restart. Let it fully restart and try connecting to Wi-Fi again.',
      followUp: 'Did Wi-Fi connect after restarting?',
    },
    {
      id: 'step-4',
      title: 'Restart your router',
      instruction: 'Find your Wi-Fi router at home — it has blinking lights. Unplug the power cable, wait 30 seconds, then plug it back in. Wait 2 minutes and try connecting your laptop again.',
      followUp: 'Did it connect now?',
    },
  ],
};

// ─── Smartphone Solutions ─────────────────────────────────────────────────────

const smartphoneFrozen: SolutionPath = {
  id: 'smartphone-frozen',
  category: 'smartphone',
  device: 'phone',
  title: 'Phone is frozen or unresponsive',
  steps: [
    {
      id: 'step-1',
      title: 'Force restart your phone',
      instruction: 'Hold down the Power button and the Volume Down button at the same time for about 10 seconds. Your phone screen will go black and then restart. (On iPhones: press Volume Up, then Volume Down, then hold the Side button.)',
      followUp: 'Did the phone restart successfully?',
    },
    {
      id: 'step-2',
      title: 'Charge your phone',
      instruction: 'Connect your phone to its charger and plug it into a wall outlet. Wait 5 minutes. Sometimes a phone freezes when the battery is critically low.',
      followUp: 'Did it turn on after charging for a few minutes?',
    },
    {
      id: 'step-3',
      title: 'Close apps running in the background',
      instruction: 'Press the square or three-line button at the bottom of your screen (called the Recent Apps button). Swipe each app card to the side to close it. Then try using your phone normally.',
      followUp: 'Is the phone running smoother now?',
    },
  ],
};

const smartphoneCharging: SolutionPath = {
  id: 'smartphone-charging',
  category: 'smartphone',
  device: 'phone',
  title: 'Phone not charging',
  steps: [
    {
      id: 'step-1',
      title: 'Check the charging cable and port',
      instruction: 'Look at your charging cable — is it bent, frayed, or damaged? Try a different cable if you have one. Also look into the charging port on the phone with a light to check for dust or lint.',
      followUp: 'Does a different cable work? Is the port clean?',
    },
    {
      id: 'step-2',
      title: 'Try a different power outlet',
      instruction: 'Unplug the charger from the current outlet and plug it into a different wall outlet. Sometimes outlets stop working.',
      followUp: 'Is it charging on the new outlet?',
    },
    {
      id: 'step-3',
      title: 'Restart your phone',
      instruction: 'Hold the Power button, tap Restart, and once the phone starts back up, connect the charger again.',
      followUp: 'Is it showing the charging symbol now?',
    },
  ],
};

// ─── Laptop Solutions ─────────────────────────────────────────────────────────

const laptopSlow: SolutionPath = {
  id: 'laptop-slow',
  category: 'laptop',
  device: 'laptop',
  title: 'Laptop running very slow',
  steps: [
    {
      id: 'step-1',
      title: 'Restart your laptop',
      instruction: 'Click the Start button (Windows logo), click the Power icon, then click Restart. Wait for it to fully start up before testing. A restart clears many temporary slowdowns.',
      followUp: 'Is it faster after restarting?',
    },
    {
      id: 'step-2',
      title: 'Close programs you are not using',
      instruction: 'Look at the taskbar at the bottom of your screen. Right-click on any programs you are not using and choose Close. Also press Ctrl + Alt + Delete and click Task Manager to see what is using the most resources.',
      followUp: 'Did closing extra programs help?',
    },
    {
      id: 'step-3',
      title: 'Check for pending updates',
      instruction: 'Click the Start button, open Settings (the gear icon), then click Windows Update. If there are updates waiting, install them. Sometimes updates running in the background slow things down.',
      followUp: 'Were there updates to install? Is it faster now?',
    },
  ],
};

const laptopWontStart: SolutionPath = {
  id: 'laptop-wont-start',
  category: 'laptop',
  device: 'laptop',
  title: 'Laptop won\'t turn on',
  steps: [
    {
      id: 'step-1',
      title: 'Check the power connection',
      instruction: 'Make sure your charger is fully plugged into the laptop and the wall outlet. Look for a small charging light near the charging port — it should glow when plugged in.',
      followUp: 'Is there a charging light? What color is it?',
    },
    {
      id: 'step-2',
      title: 'Hold the power button for 10 seconds',
      instruction: 'Press and hold the power button (usually on the top-left or top-right of the keyboard) for a full 10 seconds. Release it, wait 5 seconds, then press it briefly to turn on.',
      followUp: 'Did anything appear on screen?',
    },
    {
      id: 'step-3',
      title: 'Remove and reattach the power adapter',
      instruction: 'Unplug the charger from both the laptop and the wall. Wait 30 seconds. Plug it back into the wall first, then into the laptop. Now try the power button.',
      followUp: 'Does it turn on now?',
    },
  ],
};

// ─── Printer Solutions ────────────────────────────────────────────────────────

const printerOffline: SolutionPath = {
  id: 'printer-offline',
  category: 'printer',
  device: 'printer',
  title: 'Printer says offline',
  steps: [
    {
      id: 'step-1',
      title: 'Turn the printer off and on',
      instruction: 'Find the power button on your printer and press it to turn it off. Wait 10 seconds, then press it again to turn it back on. Let it fully warm up.',
      followUp: 'Is the printer showing ready lights now?',
    },
    {
      id: 'step-2',
      title: 'Check all cable connections',
      instruction: 'If your printer uses a USB cable, trace the cable from the printer to the computer and make sure both ends are firmly pushed in. If it\'s a wireless printer, check that it shows connected to Wi-Fi.',
      followUp: 'Are all cables connected? Is it showing online now?',
    },
    {
      id: 'step-3',
      title: 'Set it as the default printer on your computer',
      instruction: 'On Windows: Click Start, go to Settings, click Bluetooth & devices, then Printers & scanners. Click your printer and choose "Set as default." On Mac: Go to System Preferences > Printers & Scanners and select your printer.',
      followUp: 'Is it now set as default? Can you print a test page?',
    },
  ],
};

// ─── Smart TV Solutions ───────────────────────────────────────────────────────

const tvAppNotLoading: SolutionPath = {
  id: 'tv-app-not-loading',
  category: 'smart-tv',
  device: 'smart-tv',
  title: 'App not loading on Smart TV',
  steps: [
    {
      id: 'step-1',
      title: 'Close and reopen the app',
      instruction: 'Press the Home button on your remote. Find the app (like Netflix or YouTube). Press and hold the OK/Select button on it — you will see an option to Close or Force Stop. Close it, then open it again.',
      followUp: 'Did the app open after closing and reopening?',
    },
    {
      id: 'step-2',
      title: 'Restart your TV',
      instruction: 'Press and hold the power button on your remote for 5 seconds, or unplug the TV from the wall. Wait 1 minute, then plug it back in. Restart clears the TV\'s temporary memory.',
      followUp: 'Is the app loading now after restarting?',
    },
    {
      id: 'step-3',
      title: 'Check your internet connection',
      instruction: 'Go to your TV\'s Settings menu. Look for Network or Internet settings. Check if the TV shows as connected. If not, reconnect to your Wi-Fi network.',
      followUp: 'Is your TV connected to the internet?',
    },
  ],
};

// ─── Storage Solutions ────────────────────────────────────────────────────────

const storageFullPhone: SolutionPath = {
  id: 'storage-full-phone',
  category: 'storage',
  device: 'phone',
  title: 'Phone storage is full',
  steps: [
    {
      id: 'step-1',
      title: 'Delete apps you don\'t use',
      instruction: 'Go to Settings and tap on Storage (or General > iPhone Storage on iPhone). You will see a list of apps and how much space they take. Tap on apps you haven\'t used in a while and choose Delete or Uninstall.',
      followUp: 'Did you free up some space by removing apps?',
    },
    {
      id: 'step-2',
      title: 'Back up and clear old photos',
      instruction: 'Your photos likely take the most space. You can upload them to Google Photos (Android) or iCloud (iPhone) to save them safely, then delete them from the phone to free up space. Make sure the backup is complete before deleting.',
      followUp: 'Were you able to back up and remove some photos?',
    },
    {
      id: 'step-3',
      title: 'Clear app cache',
      instruction: 'Go to Settings > Apps (Android). Tap on a large app like Chrome, YouTube or Facebook. Tap Storage, then tap Clear Cache. This removes temporary files without deleting your data.',
      followUp: 'Did clearing the cache free up some space?',
    },
  ],
};

// ─── Account Solutions ────────────────────────────────────────────────────────

const accountPassword: SolutionPath = {
  id: 'account-password',
  category: 'account',
  device: 'unknown',
  title: 'Forgot password or can\'t log in',
  steps: [
    {
      id: 'step-1',
      title: 'Use the "Forgot Password" option',
      instruction: 'On the login screen, look for a link that says "Forgot Password?" or "Reset Password." Click it. You will be asked for your email address. Enter the email you used when you created the account.',
      followUp: 'Did you get an email with a reset link?',
    },
    {
      id: 'step-2',
      title: 'Check your email for the reset link',
      instruction: 'Open your email inbox and look for a message from the service (e.g. Google, Netflix). It may take a few minutes to arrive. Check your Spam or Junk folder if you don\'t see it.',
      followUp: 'Did you find the reset email?',
    },
    {
      id: 'step-3',
      title: 'Create a new password',
      instruction: 'Click the link in the email. You will be taken to a page to create a new password. Choose something you can remember but don\'t share it with anyone. Do not use obvious things like your birthday.',
      followUp: 'Were you able to log in with the new password?',
    },
  ],
};

// ─── App Solutions ────────────────────────────────────────────────────────────

const appCrashing: SolutionPath = {
  id: 'app-crashing',
  category: 'app',
  device: 'phone',
  title: 'App keeps crashing or not opening',
  steps: [
    {
      id: 'step-1',
      title: 'Close and reopen the app',
      instruction: 'On Android: press the square button at the bottom and swipe the app away. On iPhone: swipe up from the bottom and swipe the app up to close it. Then tap the app again to reopen.',
      followUp: 'Is the app working after reopening?',
    },
    {
      id: 'step-2',
      title: 'Update the app',
      instruction: 'Open the App Store (iPhone) or Play Store (Android). Search for the app name. If you see an Update button, tap it. Updates often fix crashing problems.',
      followUp: 'Was there an update available? Did it fix the crashing?',
    },
    {
      id: 'step-3',
      title: 'Clear the app\'s data/cache',
      instruction: 'On Android: Go to Settings > Apps, find the app, tap Storage, then tap Clear Cache and Clear Data. Note: this resets the app, so you may need to sign in again.',
      followUp: 'Did clearing the data fix the problem?',
    },
    {
      id: 'step-4',
      title: 'Uninstall and reinstall the app',
      instruction: 'Hold your finger on the app icon until a menu appears. Choose Uninstall or Delete. Then go to the App Store or Play Store and download it fresh.',
      followUp: 'Is the app working after reinstalling?',
    },
  ],
};

// ─── Master solution registry ─────────────────────────────────────────────────

export const SOLUTION_PATHS: SolutionPath[] = [
  wifiPhoneBasic,
  wifiLaptopBasic,
  smartphoneFrozen,
  smartphoneCharging,
  laptopSlow,
  laptopWontStart,
  printerOffline,
  tvAppNotLoading,
  storageFullPhone,
  accountPassword,
  appCrashing,
];

/** Look up a solution path by ID */
export function getSolutionById(id: string): SolutionPath | undefined {
  return SOLUTION_PATHS.find((s) => s.id === id);
}

/** Find the best-matching solution paths for a given category + device */
export function findSolutions(category: string, device: string): SolutionPath[] {
  const exact = SOLUTION_PATHS.filter(
    (s) => s.category === category && s.device === device,
  );
  if (exact.length) return exact;

  // Fall back to category-only match
  return SOLUTION_PATHS.filter((s) => s.category === category);
}
