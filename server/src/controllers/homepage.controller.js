import { Homepage } from '../models/Homepage.js'

const defaults = {
  hero: {
    eyebrow: 'Creative digital solutions · Since 2020',
    title: 'Grow your business. Build your brand. Get noticed.',
    description:
      'Social media, creative content, video editing, graphic design, digital marketing and websites — built around the way your business needs to grow.',
    primaryCtaText: 'Get Started',
    primaryCtaLink: '#contact',
    secondaryCtaText: 'View Our Work',
    secondaryCtaLink: '#work',
  },
  about: {
    eyebrow: 'About Grow With Me',
    title: 'Creative digital solutions.',
    description:
      'Since 2020, we have been helping businesses build a professional and engaging digital presence through creative content, video editing, graphic design, social media and digital promotion.',
    experienceYear: 2020,
  },
  process: [
    {
      number: '01',
      title: 'Discuss',
      text: 'We understand your business, requirements and goals.',
      order: 1,
    },
    {
      number: '02',
      title: 'Plan',
      text: 'We plan the content according to your business and audience.',
      order: 2,
    },
    {
      number: '03',
      title: 'Create',
      text: 'We create designs, videos and promotional content.',
      order: 3,
    },
    {
      number: '04',
      title: 'Review',
      text: 'You review the content and share your feedback.',
      order: 4,
    },
    { number: '05', title: 'Publish', text: 'Approved content is ready to go live.', order: 5 },
    {
      number: '06',
      title: 'Grow',
      text: 'Consistent content and promotion help strengthen your online presence.',
      order: 6,
    },
  ],
  industries: [
    'Jewellery',
    'Furniture',
    'Restaurants',
    'Retail Stores',
    'Professionals',
    'Local Businesses',
    'Startups',
    'Service Businesses',
  ].map((name, i) => ({ name, active: true, order: i })),
  cta: {
    eyebrow: 'Ready to grow?',
    title: 'Your business deserves to be seen.',
    primaryText: 'WhatsApp Us',
    primaryLink: 'https://wa.me/918434305404',
    secondaryText: 'Send Email',
    secondaryLink: 'mailto:growithmeayush@gmail.com',
  },
  marquee: ['Social Media', 'Video', 'Design', 'Digital Marketing', 'Websites'].map((text, i) => ({
    text,
    order: i,
  })),
}

const stringValue = (value) => (typeof value === 'string' ? value.trim() : '')

const buildPayload = (body = {}) => {
  const hero = body.hero || {}
  const about = body.about || {}
  const cta = body.cta || {}

  return {
    hero: {
      eyebrow: stringValue(hero.eyebrow),
      title: stringValue(hero.title),
      description: stringValue(hero.description),
      primaryCtaText: stringValue(hero.primaryCtaText),
      primaryCtaLink: stringValue(hero.primaryCtaLink),
      secondaryCtaText: stringValue(hero.secondaryCtaText),
      secondaryCtaLink: stringValue(hero.secondaryCtaLink),
      ...(hero.media && typeof hero.media === 'object'
        ? {
            media: {
              publicId: stringValue(hero.media.publicId),
              url: stringValue(hero.media.url),
              alt: stringValue(hero.media.alt),
            },
          }
        : {}),
    },
    about: {
      eyebrow: stringValue(about.eyebrow),
      title: stringValue(about.title),
      description: stringValue(about.description),
      experienceYear: Number.isFinite(Number(about.experienceYear))
        ? Number(about.experienceYear)
        : defaults.about.experienceYear,
    },
    process: Array.isArray(body.process)
      ? body.process.slice(0, 20).map((item, index) => ({
          number: stringValue(item?.number),
          title: stringValue(item?.title),
          text: stringValue(item?.text),
          order: Number.isFinite(Number(item?.order)) ? Number(item.order) : index + 1,
        }))
      : [],
    industries: Array.isArray(body.industries)
      ? body.industries.slice(0, 30).map((item, index) => ({
          name: stringValue(item?.name),
          active: item?.active !== false,
          order: Number.isFinite(Number(item?.order)) ? Number(item.order) : index,
        }))
      : [],
    cta: {
      eyebrow: stringValue(cta.eyebrow),
      title: stringValue(cta.title),
      primaryText: stringValue(cta.primaryText),
      primaryLink: stringValue(cta.primaryLink),
      secondaryText: stringValue(cta.secondaryText),
      secondaryLink: stringValue(cta.secondaryLink),
    },
    marquee: Array.isArray(body.marquee)
      ? body.marquee.slice(0, 30).map((item, index) => ({
          text: stringValue(item?.text),
          order: Number.isFinite(Number(item?.order)) ? Number(item.order) : index,
        }))
      : [],
  }
}

export const getHomepage = async (_req, res, next) => {
  try {
    let page = await Homepage.findOne({ singleton: 'homepage' }).lean()
    if (!page) page = await Homepage.create({ singleton: 'homepage', ...defaults })
    res.json({ success: true, data: page })
  } catch (error) {
    next(error)
  }
}

export const updateHomepage = async (req, res, next) => {
  try {
    const payload = buildPayload(req.body)
    const page = await Homepage.findOneAndUpdate(
      { singleton: 'homepage' },
      { $set: payload },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    )
    res.json({ success: true, data: page })
  } catch (error) {
    next(error)
  }
}
