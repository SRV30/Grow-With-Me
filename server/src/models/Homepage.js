import mongoose from 'mongoose'

const mediaSchema = new mongoose.Schema(
  {
    publicId: { type: String, default: '' },
    url: { type: String, default: '' },
    alt: { type: String, default: '' },
  },
  { _id: false },
)

const homepageSchema = new mongoose.Schema(
  {
    singleton: { type: String, unique: true, default: 'homepage' },
    hero: {
      eyebrow: { type: String, default: 'Creative digital solutions · Since 2020' },
      title: { type: String, default: 'Grow your business. Build your brand. Get noticed.' },
      description: { type: String, default: '' },
      primaryCtaText: { type: String, default: 'Get Started' },
      primaryCtaLink: { type: String, default: '#contact' },
      secondaryCtaText: { type: String, default: 'View Our Work' },
      secondaryCtaLink: { type: String, default: '#work' },
      media: { type: mediaSchema, default: () => ({}) },
    },
    about: {
      eyebrow: String,
      title: String,
      description: String,
      experienceYear: { type: Number, default: 2020 },
    },
    process: [{ number: String, title: String, text: String, order: { type: Number, default: 0 } }],
    industries: [
      {
        name: String,
        active: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
      },
    ],
    cta: {
      eyebrow: String,
      title: String,
      primaryText: String,
      primaryLink: String,
      secondaryText: String,
      secondaryLink: String,
    },
    marquee: [{ text: String, order: { type: Number, default: 0 } }],
  },
  { timestamps: true },
)

export const Homepage = mongoose.model('Homepage', homepageSchema)
