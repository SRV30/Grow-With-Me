const siteUrl = () =>
  typeof window !== 'undefined' ? window.location.origin : 'https://growwithmeayush.vercel.app'

export function OrganizationSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Grow With Me',
    url: siteUrl(),
    email: 'growithmeayush@gmail.com',
    telephone: '+91 8434305404',
    description:
      'Creative digital solutions including social media management, video editing, graphic design, digital marketing and website design.',
  }
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}

export function ProjectSchema({ project }) {
  if (!project) return null
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    url: `${siteUrl()}/work/${project.slug}`,
    image: project.coverImage?.url,
    creator: { '@type': 'Organization', name: 'Grow With Me', url: siteUrl() },
  }
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}
