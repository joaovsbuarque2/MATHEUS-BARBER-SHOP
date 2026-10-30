import './styles/global.css';
import './styles/components.css';
import './styles/animations.css';

import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Brush,
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplets,
  Info,
  Instagram,
  Layers,
  MapPin,
  MessageCircle,
  Navigation,
  PenTool,
  Plus,
  Quote,
  Scissors,
  Sparkles,
  X,
  createIcons,
} from 'lucide';

import { initNavigation } from './scripts/navigation.js';
import { initGallery } from './scripts/gallery.js';
import { initInteractions } from './scripts/interactions.js';

createIcons({
  icons: {
    ArrowDown,
    ArrowUp,
    ArrowUpRight,
    Brush,
    ChevronLeft,
    ChevronRight,
    Clock,
    Droplets,
    Info,
    Instagram,
    Layers,
    MapPin,
    MessageCircle,
    Navigation,
    PenTool,
    Plus,
    Quote,
    Scissors,
    Sparkles,
    X,
  },
});

initNavigation();
initGallery();
initInteractions();
