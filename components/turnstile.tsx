import { useEffect } from 'react';


interface TurnstileComponentProps {
  onToken: (token: string) => void;
}

export default function TurnstileComponent({ onToken }: TurnstileComponentProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
 
    (window as any).onTurnstileCallback = (token: string) => {
      onToken(token); 
    };
  }, [onToken]);

  return (
    <div>
      <div
        className="cf-turnstile"
        data-sitekey="0x4AAAAAAA8xm9OZHqv04NO6"
        // data-sitekey={process.env.CLOUDFLARE_SITE_KEY}
        data-theme="light"
        data-callback="onTurnstileCallback" 
      ></div>
    </div>
  );
}
