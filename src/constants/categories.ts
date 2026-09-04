import type { ProblemCategory, DeviceType } from '../types';

export interface CategoryMeta {
  id: ProblemCategory;
  label: string;
  emoji: string;
  description: string;
  keywords: string[];
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'wifi',
    label: 'Wi-Fi / Internet',
    emoji: '📶',
    description: "Internet not working, slow connection, can't connect",
    keywords: ['wifi', 'wi-fi', 'internet', 'network', 'connection', 'router', 'hotspot', 'ethernet', 'online', 'disconnected', 'no internet'],
  },
  {
    id: 'smartphone',
    label: 'Smartphone',
    emoji: '📱',
    description: 'Phone freezing, crashing, not charging',
    keywords: ['phone', 'smartphone', 'android', 'iphone', 'mobile', 'ios', 'samsung', 'pixel', 'charging', 'battery', 'screen'],
  },
  {
    id: 'laptop',
    label: 'Laptop / Computer',
    emoji: '💻',
    description: "Laptop slow, won't start, overheating",
    keywords: ['laptop', 'computer', 'pc', 'mac', 'macbook', 'windows', 'slow', 'frozen', 'blue screen', 'startup', 'boot'],
  },
  {
    id: 'printer',
    label: 'Printer',
    emoji: '🖨️',
    description: 'Printer not printing, paper jam, offline',
    keywords: ['printer', 'printing', 'print', 'paper jam', 'ink', 'offline printer', 'scanner'],
  },
  {
    id: 'smart-tv',
    label: 'Smart TV',
    emoji: '📺',
    description: 'TV app not loading, remote not working, no picture',
    keywords: ['tv', 'television', 'smart tv', 'netflix', 'youtube', 'streaming', 'remote', 'hdmi', 'disney', 'hulu', 'firestick'],
  },
  {
    id: 'app',
    label: 'App Problems',
    emoji: '📲',
    description: 'App crashing, not opening, not updating',
    keywords: ['app', 'application', 'crash', 'update', 'install', 'not opening', 'loading', 'force close', 'software'],
  },
  {
    id: 'storage',
    label: 'Storage Full',
    emoji: '💾',
    description: 'Phone or computer says storage is full',
    keywords: ['storage', 'space', 'full', 'memory', 'disk', 'photos', 'backup', 'files', 'download', 'cloud'],
  },
  {
    id: 'account',
    label: 'Account / Login',
    emoji: '🔐',
    description: "Forgot password, can't log in, account locked",
    keywords: ['password', 'login', 'account', 'sign in', 'forgot', 'locked', 'email', 'reset', 'username', 'google account', 'apple id'],
  },
];

export interface DeviceMeta {
  id: DeviceType;
  label: string;
  emoji: string;
  keywords: string[];
}

export const DEVICES: DeviceMeta[] = [
  { id: 'phone',    label: 'Phone',    emoji: '📱', keywords: ['phone', 'mobile', 'iphone', 'android', 'samsung', 'pixel', 'smartphone'] },
  { id: 'laptop',   label: 'Laptop',   emoji: '💻', keywords: ['laptop', 'macbook', 'notebook', 'chromebook'] },
  { id: 'desktop',  label: 'Desktop',  emoji: '🖥️',  keywords: ['desktop', 'computer', 'pc', 'mac', 'imac'] },
  { id: 'tablet',   label: 'Tablet',   emoji: '📋', keywords: ['tablet', 'ipad', 'kindle', 'surface'] },
  { id: 'printer',  label: 'Printer',  emoji: '🖨️', keywords: ['printer', 'print'] },
  { id: 'smart-tv', label: 'Smart TV', emoji: '📺', keywords: ['tv', 'television', 'smart tv', 'firestick', 'chromecast', 'roku'] },
  { id: 'router',   label: 'Router',   emoji: '📡', keywords: ['router', 'modem', 'gateway'] },
  { id: 'other',    label: 'Other',    emoji: '🔧', keywords: [] },
];
