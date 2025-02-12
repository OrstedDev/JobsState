import { JobOfferEntity } from "../../../../../../DomainLayer/Models/Aplication/Modules/Example/JobsEntity";

export default function parseJobOffers(text: string): JobOfferEntity[] {
  const jobBlocks = text.split(/▁+/g).filter((block) => block.trim() !== ""); // Dividimos las ofertas
  const jobOffers: JobOfferEntity[] = [];

  jobBlocks.forEach((block) => {
    const lines = block.split("\n").map((line) => line.trim()); // Separar líneas y limpiar espacios
    const job: Partial<JobOfferEntity> = {};

    job.vigent = true;

    lines.forEach((line) => {
      if (line.startsWith("🏢")) {
        const match = line.match(/🏢 : (.+?) - (\d+) plaza/);
        if (match) {
          job.company = match[1].trim();
          job.positions = match[2];
        }
      } else if (line.startsWith("📝")) {
        job.contractType = line.replace("📝 :", "").trim();
      } else if (line.startsWith("🎓")) {
        job.education = line.replace("🎓 :", "").trim();
      } else if (line.startsWith("🎯")) {
        job.location = line.replace("🎯 :", "").trim();
      } else if (line.startsWith("💰")) {
        job.salary = line.replace("💰 :", "").trim();
      } else if (line.startsWith("📅")) {
        const match = line.match(/📅 : Finaliza el (\d{2}\/\d{2}\/\d{4})/);
        if (match) {
          job.deadline = match[1].trim();
        }
      } else if (line.startsWith("🔗")) {
        job.link = line.replace("🔗 :", "").trim();
      }
    });
    
    if (
      job.company &&
      job.positions &&
      job.contractType &&
      job.education &&
      job.location &&
      job.deadline &&
      job.link
    ) {
      jobOffers.push(job as JobOfferEntity);
    }
  });

  return jobOffers;
}
