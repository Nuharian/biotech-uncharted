import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.news.create({
    data: {
      title: 'Breakthrough in CRISPR Targeting',
      slug: 'breakthrough-crispr-targeting',
      summary: 'A new enzyme allows for unprecedented precision in DNA editing.',
      content: 'Researchers have discovered a new variant of Cas9 that drastically reduces off-target effects, paving the way for safer gene therapies. This is a monumental step forward for biotech...',
      isHighlighted: true,
    }
  })

  await prisma.publication.create({
    data: {
      title: 'Synthetic Biology Approaches to Carbon Capture',
      authors: 'Dr. E. Vance, Dr. J. Chen',
      journal: 'Nature Biotechnology',
      publishDate: new Date(),
      abstract: 'We engineered a novel pathway in cyanobacteria that increases CO2 fixation by 40%...',
      isHighlighted: true,
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
