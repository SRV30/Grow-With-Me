const siteUrl = () => {
  const configured = import.meta.env.VITE_SITE_URL
  return (configured || window.location.origin).replace(/\/$/, '')
}

export function OrganizationSchema() {
  const url = siteUrl()
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}/#organization`,
    name: 'Grow With Me',
    url,
    logo: `${url}/images/vite.svg`,
    email: 'growwithmeayush@gmail.com',
    telephone: '+91 8434305404',
    description:
      'Creative digital solutions including social media management, video editing, graphic design, digital marketing and website design.',
    sameAs: [],
  }
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}

export function ProjectSchema({ project }) {
  if (!project) return null
  const url = siteUrl()
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    url: `${url}/work/${project.slug}`,
    image: project.coverImage?.url,
    creator: { '@type': 'Organization', name: 'Grow With Me', url },
  }
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}
