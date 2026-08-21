import { Homepage } from '../models/Homepage.js'

const defaults = {
  hero: { eyebrow: 'Creative digital solutions · Since 2020', title: 'Grow your business. Build your brand. Get noticed.', description: 'Social media, creative content, video editing, graphic design, digital marketing and websites — built around the way your business needs to grow.', primaryCtaText: 'Get Started', primaryCtaLink: '#contact', secondaryCtaText: 'View Our Work', secondaryCtaLink: '#work' },
  about: { eyebrow: 'About Grow With Me', title: 'Creative digital solutions.', description: 'Since 2020, we have been helping businesses build a professional and engaging digital presence through creative content, video editing, graphic design, social media and digital promotion.', experienceYear: 2020 },
  process: [{ number: '01', title: 'Discuss', text: 'We understand your business, requirements and goals.', order: 1 }, { number: '02', title: 'Plan', text: 'We plan the content according to your business and audience.', order: 2 }, { number: '03', title: 'Create', text: 'We create designs, videos and promotional content.', order: 3 }, { number: '04', title: 'Review', text: 'You review the content and share your feedback.', order: 4 }, { number: '05', title: 'Publish', text: 'Approved content is ready to go live.', order: 5 }, { number: '06', title: 'Grow', text: 'Consistent content and promotion help strengthen your online presence.', order: 6 }],
  industries: ['Jewellery', 'Furniture', 'Restaurants', 'Retail Stores', 'Professionals', 'Local Businesses', 'Startups', 'Service Businesses'].map((name, i) => ({ name, active: true, order: i })),
  cta: { eyebrow: 'Ready to grow?', title: 'Your business deserves to be seen.', primaryText: 'WhatsApp Us', primaryLink: 'https://wa.me/918434305404', secondaryText: 'Send Email', secondaryLink: 'mailto:growithmeayush@gmail.com' },
  marquee: ['Social Media', 'Video', 'Design', 'Digital Marketing', 'Websites'].map((text, i) => ({ text, order: i })),
}

export const getHomepage = async (_req, res, next) => {
  try {
    let page = await Homepage.findOne({ singleton: 'homepage' }).lean()
    if (!page) page = await Homepage.create({ singleton: 'homepage', ...defaults })
    res.json({ success: true, data: page })
  } catch (error) { next(error) }
}

export const updateHomepage = async (req, res, next) => {
  try {
    const page = await Homepage.findOneAndUpdate({ singleton: 'homepage' }, { $set: req.body }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true })
    res.json({ success: true, data: page })
  } catch (error) { next(error) }
}
