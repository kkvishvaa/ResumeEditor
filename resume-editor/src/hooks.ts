import { useState, useEffect, useRef, RefObject } from 'react';

export function useATSChecker(showATSChecker: boolean, setShowATSChecker: (value: boolean) => void) {
  useEffect(() => {
    const closeModal = () => setShowATSChecker(false);
    const modalSelector = ".fixed.inset-0.bg-black.bg-opacity-50 > .bg-white";

    const handleOutsideClick = (event: MouseEvent) => {
      const modal = document.querySelector(modalSelector);
      if (modal && !modal.contains(event.target as Node)) {
        closeModal();
      }
    };

    if (showATSChecker) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showATSChecker, setShowATSChecker]);
}

export function useResumeEditor(): RefObject<HTMLDivElement | null> {
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sendPostMessageReady = () => {
      const editor = resumeRef.current?.querySelector('iframe');
      if (editor?.contentWindow) {
        editor.contentWindow.postMessage(
          JSON.stringify({
            MessageId: 'Host_PostmessageReady',
            SendTime: Date.now(),
            Values: {}
          }),
          'http://localhost:9980' // Replace with the actual origin
        );
        console.log('Sent Host_PostmessageReady');
      }
    };

    const handleMessage = (event: MessageEvent) => {
      console.log('Received message from Collabora editor:', event.origin, event.data);

      if (event.data) {
        try {
          const message = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
          console.log('Parsed message:', message);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    sendPostMessageReady();

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return resumeRef;
}
