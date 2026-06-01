const fs = require('fs');

const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
const schemaPath = 'prisma/schema.prisma';

try {
  let schema = fs.readFileSync(schemaPath, 'utf8');

  if (isProduction) {
    schema = schema.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"');
    console.log("⚡ [Prisma Setup] Production (Vercel) environment detected. Setting provider to postgresql.");
  } else {
    schema = schema.replace(/provider\s*=\s*"postgresql"/, 'provider = "sqlite"');
    console.log("💻 [Prisma Setup] Local development environment detected. Setting provider to sqlite.");
  }

  fs.writeFileSync(schemaPath, schema);
} catch (err) {
  console.error("❌ [Prisma Setup] Failed to update schema.prisma:", err);
}
