import { MenuItem } from './components/Header';

export const menuItems: MenuItem[] = [
  { label: 'Dashboard', route: '/' },
  // TODO: update permissions
  { label: 'Loans', route: '/loans', permission: 'borrower' },
  { label: 'Mint NFT', route: '/demo/mint-nft', permission: 'demo' }
];
