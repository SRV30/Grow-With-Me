const services = ['Social Media Management','Reels & Video Editing','Graphic Designing','Social Media Advertising','Business Promotion','Website Design']

export default function ServiceSchema() {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://growwithmeayush.vercel.app'
  const data = services.map(name => ({ '@context':'https://schema.org','@type':'Service','name':name,'provider':{'@type':'Organization','name':'Grow With Me','url':origin},'areaServed':{'@type':'Country','name':'India'} }))
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data)}} />
}
