import { pawlingsContent } from "@/config/pawlings-content";

export interface AdoptionCertificateData {
  referenceCode: string;
  walletAddress: string;
  xHandle?: string;
  signatureDataUrl: string;
  submittedAt: Date;
  statusLabel?: string;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawPuppySilhouette(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = "#141b45";
  ctx.beginPath();
  ctx.ellipse(x, y + size * 0.55, size * 0.42, size * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x - size * 0.28, y + size * 0.08, size * 0.14, 0, Math.PI * 2);
  ctx.arc(x + size * 0.28, y + size * 0.08, size * 0.14, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export async function renderAdoptionCertificate(
  data: AdoptionCertificateData
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 990;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const cream = "#f6f2ea";
  const ink = "#141b45";
  const muted = "#5c6288";
  const stamp = "#c0392b";

  ctx.fillStyle = cream;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 8000; i++) {
    ctx.fillStyle = `rgba(20,27,69,${Math.random() * 0.015})`;
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
  }

  drawPuppySilhouette(ctx, canvas.width * 0.82, canvas.height * 0.72, 320);

  const margin = 48;
  ctx.strokeStyle = "rgba(20,27,69,0.18)";
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, margin, margin, canvas.width - margin * 2, canvas.height - margin * 2, 18);
  ctx.stroke();

  ctx.strokeStyle = "rgba(168,239,36,0.35)";
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, margin + 14, margin + 14, canvas.width - (margin + 14) * 2, canvas.height - (margin + 14) * 2, 14);
  ctx.stroke();

  try {
    const logo = await loadImage(pawlingsContent.brand.logoPath);
    const logoH = 110;
    const logoW = (logo.width / logo.height) * logoH;
    ctx.drawImage(logo, canvas.width / 2 - logoW / 2, margin + 36, logoW, logoH);
  } catch {
    ctx.fillStyle = ink;
    ctx.font = "bold 48px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("Pawlings", canvas.width / 2, margin + 100);
  }

  ctx.fillStyle = muted;
  ctx.font = "600 14px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("OFFICIAL ADOPTION CERTIFICATE", canvas.width / 2, margin + 168);

  ctx.fillStyle = ink;
  ctx.font = "bold 36px Georgia, serif";
  ctx.fillText("Approved Adoption Papers", canvas.width / 2, margin + 218);

  const left = margin + 72;
  let y = margin + 290;
  const row = (label: string, value: string) => {
    ctx.fillStyle = muted;
    ctx.font = "600 13px Georgia, serif";
    ctx.textAlign = "left";
    ctx.fillText(label.toUpperCase(), left, y);
    ctx.fillStyle = ink;
    ctx.font = "500 22px Georgia, serif";
    ctx.fillText(value, left, y + 28);
    y += 62;
  };

  row("Adoption ID", data.referenceCode);
  row("Guardian Wallet", data.walletAddress);
  row("X Username", data.xHandle?.trim() ? data.xHandle : "N/A");
  row(
    "Date Submitted",
    data.submittedAt.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  );
  row("Status", data.statusLabel ?? "Application Received");

  ctx.fillStyle = muted;
  ctx.font = "600 13px Georgia, serif";
  ctx.fillText("APPLICANT SIGNATURE", left, y + 8);

  try {
    const sig = await loadImage(data.signatureDataUrl);
    ctx.drawImage(sig, left, y + 20, 360, 100);
  } catch {
    ctx.strokeStyle = "rgba(20,27,69,0.2)";
    ctx.strokeRect(left, y + 20, 360, 100);
  }

  ctx.strokeStyle = "rgba(20,27,69,0.25)";
  ctx.beginPath();
  ctx.moveTo(left, y + 130);
  ctx.lineTo(left + 360, y + 130);
  ctx.stroke();

  const sealX = canvas.width - margin - 160;
  const sealY = canvas.height - margin - 200;
  ctx.save();
  ctx.translate(sealX, sealY);
  ctx.rotate(-0.12);
  ctx.strokeStyle = stamp;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, 78, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 62, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = stamp;
  ctx.font = "bold 13px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("APPLICATION", 0, -8);
  ctx.fillText("RECEIVED", 0, 12);
  ctx.restore();

  ctx.fillStyle = "rgba(192,57,43,0.12)";
  ctx.font = "bold 72px Georgia, serif";
  ctx.textAlign = "center";
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height - margin - 120);
  ctx.rotate(-0.08);
  ctx.fillText("APPLICATION RECEIVED", 0, 0);
  ctx.restore();

  ctx.fillStyle = muted;
  ctx.font = "italic 14px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(pawlingsContent.adoption.agency, canvas.width / 2, canvas.height - margin - 36);

  return canvas;
}

export async function downloadAdoptionCertificate(data: AdoptionCertificateData) {
  const canvas = await renderAdoptionCertificate(data);
  const link = document.createElement("a");
  link.download = `${data.referenceCode}-adoption-certificate.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
