import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Coffee,
  Diamond,
  ExternalLink,
  Image as ImageIcon,
  Laptop,
  Menu,
  Megaphone,
  PenTool,
  PlaySquare,
  Rocket,
  ShoppingBag,
  Smartphone,
  Store,
  Users,
  Utensils,
  X,
} from 'lucide-react'
import { services, industries, process } from './data/site.js'
import { api, getHomepage, getProjects } from './services/api.js'
import SEO from './components/SEO.jsx'
import { OrganizationSchema } from './components/StructuredData.jsx'
import './styles/figma-home.css'
import './styles/hero-collage.css'
import './styles/mobile-fixes.css'
