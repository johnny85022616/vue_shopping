import { createApp, h } from 'vue';
import type { App } from 'vue';
import PopupConfirm from '@/components/common/textPopup.vue';

interface option {
  isCancelBtnShow: boolean; //是否要顯示取消按鈕
  cancelBtnText?: string; //取消按鈕文字客制化
  confirmBtnText?: string; //確定按鈕文字客製化
}

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
      confirm: (msg) => popupRef.show(msg),
    };

    // ✅ 用 provide 提供 popupManager
    app.provide(PopupSymbol, popupManager);
  },
};
