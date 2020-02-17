import { MenuItem } from './components/Header';

export const menuItems: MenuItem[] = [
  { label: 'Dashboard', route: '/' },
  { label: 'Loans', route: '/borrower', permission: 'borrower' },
  { label: 'Mint NFT', route: '/demo/mint-nft', permission: 'demo' }
];
