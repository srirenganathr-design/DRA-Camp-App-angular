const tentFillIcon = 'assets/icons/tent-fill.svg';
const tentLineIcon = 'assets/icons/tent-line.svg';
const user2LineIcon = 'assets/icons/user-2-line.svg';
const user2FillIcon = 'assets/icons/user-2-fill.svg';
const profileIcon = 'assets/icons/user-line.svg';

export type NavTabId = 'camps' | 'patients' | 'profile';

export interface NavTabConfig {
  id: NavTabId;
  nodeId: string;
  label: string;
  icon: string;
  activeIcon?: string;
  href?: string;
  indicatorNodeId?: string;
  glowNodeId?: string;
}

export interface BottomNavConfig {
  rootNodeId: string;
  tabs: NavTabConfig[];
  activeTab: NavTabId;
}

export const campsNavConfig: BottomNavConfig = {
  rootNodeId: '16:3042',
  activeTab: 'camps',
  tabs: [
    {
      id: 'camps',
      nodeId: '16:3043',
      label: 'Camps',
      icon: tentFillIcon,
      activeIcon: tentFillIcon,
      indicatorNodeId: '16:3047',
      glowNodeId: '16:3044',
    },
    {
      id: 'patients',
      nodeId: '16:3048',
      label: 'Patients',
      icon: user2LineIcon,
      activeIcon: user2FillIcon,
      href: '/patients',
    },
    { id: 'profile', nodeId: '16:3051', label: 'Profile', icon: profileIcon },
  ],
};

export const patientsNavConfig: BottomNavConfig = {
  rootNodeId: '16:3271',
  activeTab: 'patients',
  tabs: [
    {
      id: 'camps',
      nodeId: '16:3272',
      label: 'Camps',
      icon: tentLineIcon,
      activeIcon: tentFillIcon,
      href: '/camps',
    },
    {
      id: 'patients',
      nodeId: '16:3275',
      label: 'Patients',
      icon: user2FillIcon,
      activeIcon: user2FillIcon,
      indicatorNodeId: '16:3277',
      glowNodeId: '16:3276',
    },
    { id: 'profile', nodeId: '16:3280', label: 'Profile', icon: profileIcon },
  ],
};

export function getActiveNavTab(pathname: string): NavTabId | null {
  if (pathname === '/camps') return 'camps';
  if (pathname === '/patients') return 'patients';
  return null;
}
