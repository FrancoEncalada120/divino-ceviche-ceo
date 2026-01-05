export type MenuItemType = 'link' | 'section' | 'group';

export interface MenuItemBase {
  type: MenuItemType;
  label: string;
  icon?: string;
}

export interface MenuLinkItem extends MenuItemBase {
  type: 'link';
  route: string;
}

export interface MenuSectionItem extends MenuItemBase {
  type: 'section';
}

export interface MenuGroupItem extends MenuItemBase {
  type: 'group';
  children: MenuLinkItem[];
  isOpen?: boolean;
}

export type MenuItem = MenuLinkItem | MenuSectionItem | MenuGroupItem;
