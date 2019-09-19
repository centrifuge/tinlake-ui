import { MenuItem } from './components/Header';
import config from './config'

const { isDemo } = config

const menuItems: MenuItem[] = [
  { label: 'Dashboard', route: '/' },
  { label: 'Borrower', route: '/borrower' },
  { label: 'Admin', route: '/admin' }
];

isDemo &&  menuItems.push({ label: 'Mint NFT', route: '/temp/mint-nft'})

export {
  menuItems
}