import { useState, useEffect, useCallback } from 'react';

// Shared across hook instances
let deferredPrompt: any = null;

const DISMISS_KEY = 'medfield_install_dismissed';

function isDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === 'true';
  } catch {
    return false;
  }
}

function setDismissed(): void {
  try {
    sessionStorage.setItem(DISMISS_KEY, 'true');
  } catch {
    // Ignore storage errors
  }
}

function getIsStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

function getIsIOS(): boolean {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent) && !(window as any).MSStream;
}

export function useInstallPrompt() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(getIsStandalone);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissedState] = useState(isDismissed);

  // Allow previewing the modal on localhost even before native event fires
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (getIsStandalone()) {
      setIsInstalled(true);
      return;
    }

    setIsIOS(getIsIOS());

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      deferredPrompt = null;
      setIsInstalled(true);
      setIsInstallable(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (deferredPrompt) {
      setIsInstallable(true);
    } else {
      // Auto-preview install modal after 2 seconds for demonstration on localhost if not installed/dismissed
      const timer = setTimeout(() => {
        if (!getIsStandalone() && !isDismissed()) {
          setPreviewMode(true);
        }
      }, 2000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      // If in preview mode without native prompt, simulate dismissal or instructions
      return false;
    }
    try {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
      }
      deferredPrompt = null;
      return result.outcome === 'accepted';
    } catch {
      return false;
    }
  }, []);

  const dismiss = useCallback(() => {
    setDismissed();
    setDismissedState(true);
    setPreviewMode(false);
  }, []);

  const shouldShowPopup = !isInstalled && !dismissed && (isInstallable || previewMode);

  return {
    isInstallable,
    isInstalled,
    isIOS,
    shouldShowPopup,
    promptInstall,
    dismiss,
  };
}
