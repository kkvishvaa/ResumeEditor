export const waitForIframeReady = (iframe: HTMLIFrameElement, cb: () => void) => {
  iframe.contentWindow?.postMessage(
    JSON.stringify({
      MessageId: 'Host_PostmessageReady',
      SendTime: Date.now(),
      Values: {}
    }),
    '*' // Use '*' for debugging, set correct origin for production
  );
  setTimeout(cb, 700); // Wait a bit to allow Collabora to process readiness
};

export const handleOutsideClick = (
  event: MouseEvent,
  modalSelector: string,
  closeModal: () => void
) => {
  const modal = document.querySelector(modalSelector);
  if (modal && !modal.contains(event.target as Node)) {
    closeModal();
  }
};
