import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";

const dataDirectory = path.join(process.cwd(), "data");

export async function generateStaticParams() {
  const certificateData = await fs.readFile(path.join(dataDirectory, "certificates.json"), "utf8");
  const certificates = JSON.parse(certificateData || "[]");
  
  return certificates.map((cert: any) => ({
    id: cert.id,
  }));
}

export default async function CertificateImagePage({ params }: { params: { id: string } }) {
  const certificateData = await fs.readFile(path.join(dataDirectory, "certificates.json"), "utf8");
  const certificates = JSON.parse(certificateData || "[]");
  const certificate = certificates.find((cert: any) => cert.id === params.id);

  if (!certificate) return notFound();

  return (
    <div>
      <h1>Certificate Image</h1>
      <img src={`data:image/png;base64,${certificate.imageData}`} alt="Certificate" />
    </div>
  );
}
