import { createApp, h } from 'vue';
import type { App } from 'vue';
import PopupConfirm from '@/components/common/textPopup.vue';

export interface PopupManager {
  confirm: (msg: string) => Promise<boolean>;
}

export const PopupSymbol = Symbol('Popup');

export default {
  install(app: App) {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const popupApp = createApp({
      render() {
        return h(PopupConfirm, { ref: 'popup' });
      },
    });

    const vm = popupApp.mount(container);
    const popupRef = vm.$refs.popup as InstanceType<typeof PopupConfirm>;

    const popupManager: PopupManager = {
      confirm: (msg: string) => popupRef.show(msg),
    };

    // ✅ 用 provide 提供 popupManager
    app.provide(PopupSymbol, popupManager);
  },
};
