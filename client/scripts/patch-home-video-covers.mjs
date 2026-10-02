import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const appPath = resolve(process.cwd(), 'src/App.jsx')
let source = await readFile(appPath, 'utf8')

if (!source.includes("import CloudinaryVideo from './components/CloudinaryVideo.jsx'")) {
  source = source.replace(
    "import QuoteCalculator from './components/QuoteCalculator.jsx'",
    "import QuoteCalculator from './components/QuoteCalculator.jsx'\nimport CloudinaryVideo from './components/CloudinaryVideo.jsx'",
  )
}

const iconMarker =
  'const processIcons = [Users, CalendarDays, PenTool, ImageIcon, Rocket, ArrowRight]\n'
if (!source.includes('const isVideoMedia =')) {
  source = source.replace(
    iconMarker,
    `${iconMarker}\nconst isVideoMedia = (media) =>\n  media?.resourceType === 'video' ||\n  /\\/video\\/upload\\//i.test(media?.secureUrl || media?.url || '') ||\n  /\\.(mp4|webm|mov)(\\?|$)/i.test(media?.secureUrl || media?.url || '')\n`,
  )
}

const projectImage = `      {project.coverImage?.url ? (\n        <img\n          src={project.coverImage.url}\n          alt={project.coverImage.alt || project.title}\n          loading="lazy"\n        />\n      ) : (`
const projectMedia = `      {project.coverImage?.url ? (\n        isVideoMedia(project.coverImage) ? (\n          <CloudinaryVideo\n            src={project.coverImage.url}\n            poster={project.coverImage.poster || project.coverImage.thumbnail}\n            className="figma-project-cover-video"\n            controls={false}\n            aria-label={project.coverImage.alt || project.title}\n          />\n        ) : (\n          <img\n            src={project.coverImage.url}\n            alt={project.coverImage.alt || project.title}\n            loading="lazy"\n          />\n        )\n      ) : (`
if (source.includes(projectImage)) source = source.replace(projectImage, projectMedia)

const heroImage = `              {project?.coverImage?.url ? (\n                <img\n                  src={project.coverImage.url}\n                  alt={project.coverImage.alt || project.title}\n                  loading={index < 2 ? 'eager' : 'lazy'}\n                />\n              ) : (`
const heroMedia = `              {project?.coverImage?.url ? (\n                isVideoMedia(project.coverImage) ? (\n                  <CloudinaryVideo\n                    src={project.coverImage.url}\n                    poster={project.coverImage.poster || project.coverImage.thumbnail}\n                    className="hero-collage-media"\n                    controls={false}\n                    aria-label={project.coverImage.alt || project.title}\n                  />\n                ) : (\n                  <img\n                    src={project.coverImage.url}\n                    alt={project.coverImage.alt || project.title}\n                    loading={index < 2 ? 'eager' : 'lazy'}\n                  />\n                )\n              ) : (`
if (source.includes(heroImage)) source = source.replace(heroImage, heroMedia)

await writeFile(appPath, source, 'utf8')
console.log('Homepage video cover rendering patched.')
