'use client';

import { toast } from "sonner";
import { useNetworkStatus } from "../hooks/useOfflineBanner";




export function NetworkToastTrigger() {
  const isOnline = useNetworkStatus();

  return (
    <div
      
    >
      {isOnline
        ? toast.success('✅ Vous êtes en ligne')
        : toast.warning('⚠️ Vous êtes hors ligne. Certaines fonctionnalités peuvent ne pas fonctionner.')}
    </div>
  );
}
