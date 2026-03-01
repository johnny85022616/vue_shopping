import { inject } from 'vue';
import type { PopupManager } from '@/plugin/textPopup';
import { PopupSymbol } from '@/plugin/textPopup';

export default function usePopup(): PopupManager {
  const popup = inject<PopupManager>(PopupSymbol);

  if (!popup) {
    throw new Error('Popup plugin is not provided');
  }

  return popup;
}
