import QRCode from "qrcode";

interface QrCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export async function QrCodeImage({ value, size = 160, className }: QrCodeProps) {
  const dataUrl = await QRCode.toDataURL(value, {
    width: size,
    margin: 1,
    color: { dark: "#C12129", light: "#0A0A0A" },
    errorCorrectionLevel: "M",
  });

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={dataUrl}
      alt="QR code"
      width={size}
      height={size}
      className={className}
    />
  );
}
