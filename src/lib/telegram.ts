export const getTelegramUser = () => {
  return window.Telegram?.WebApp?.initDataUnsafe?.user;
};

export const getStartParam = () => {
  return window.Telegram?.WebApp?.initDataUnsafe?.start_param;
};

export const expandWebApp = () => {
  window.Telegram?.WebApp?.expand();
};

export const setHeaderColor = (color: string) => {
  window.Telegram?.WebApp?.setHeaderColor(color);
};

export const showMainButton = (text: string, onClick: () => void) => {
  const mainButton = window.Telegram?.WebApp?.MainButton;
  if (mainButton) {
    mainButton.text = text;
    mainButton.onClick(onClick);
    mainButton.show();
  }
};

export const hideMainButton = () => {
  window.Telegram?.WebApp?.MainButton?.hide();
};
