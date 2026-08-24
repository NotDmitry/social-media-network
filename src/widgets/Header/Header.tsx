import type { HeaderVariant } from './types';

interface HeaderProps {
  variant: HeaderVariant;
}

function Header({ variant }: HeaderProps) {
  // TODO: replace with actual component logic (console is for silencing the linter)
  console.log(variant);
  return <header></header>
}

export default Header;
