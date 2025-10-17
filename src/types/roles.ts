export type GlobalRole = 'ceo' | 'administrator' | 'moderator' | 'editor';

export type ContentRole = 
  | 'shop_admin' 
  | 'shop_editor' 
  | 'service_admin' 
  | 'service_editor' 
  | 'school_admin' 
  | 'school_editor' 
  | 'post_admin' 
  | 'post_editor';

export type Permission = 
  | 'users.view'
  | 'users.edit'
  | 'users.delete'
  | 'users.ban'
  | 'users.roles'
  | 'content.view'
  | 'content.create'
  | 'content.edit'
  | 'content.delete'
  | 'content.moderate'
  | 'reports.view'
  | 'reports.resolve'
  | 'settings.view'
  | 'settings.edit'
  | 'permissions.manage';

export interface RoleDefinition {
  id: GlobalRole | ContentRole;
  name: string;
  description: string;
  category: 'global' | 'shop' | 'service' | 'school' | 'post';
  permissions: Permission[];
  canBeAssignedBy: GlobalRole[];
}

export const ROLES: Record<string, RoleDefinition> = {
  ceo: {
    id: 'ceo',
    name: 'CEO',
    description: 'Полный доступ ко всем функциям сайта',
    category: 'global',
    permissions: [
      'users.view', 'users.edit', 'users.delete', 'users.ban', 'users.roles',
      'content.view', 'content.create', 'content.edit', 'content.delete', 'content.moderate',
      'reports.view', 'reports.resolve',
      'settings.view', 'settings.edit',
      'permissions.manage'
    ],
    canBeAssignedBy: ['ceo'],
  },
  administrator: {
    id: 'administrator',
    name: 'Администратор',
    description: 'Управление пользователями и контентом',
    category: 'global',
    permissions: [
      'users.view', 'users.edit', 'users.ban', 'users.roles',
      'content.view', 'content.create', 'content.edit', 'content.delete', 'content.moderate',
      'reports.view', 'reports.resolve',
      'settings.view'
    ],
    canBeAssignedBy: ['ceo'],
  },
  moderator: {
    id: 'moderator',
    name: 'Модератор',
    description: 'Модерация контента и жалоб',
    category: 'global',
    permissions: [
      'users.view', 'users.ban',
      'content.view', 'content.moderate',
      'reports.view', 'reports.resolve'
    ],
    canBeAssignedBy: ['ceo', 'administrator'],
  },
  editor: {
    id: 'editor',
    name: 'Редактор',
    description: 'Создание и редактирование контента',
    category: 'global',
    permissions: [
      'content.view', 'content.create', 'content.edit'
    ],
    canBeAssignedBy: ['ceo', 'administrator'],
  },
  shop_admin: {
    id: 'shop_admin',
    name: 'Гл. Администратор магазинов',
    description: 'Полное управление магазинами',
    category: 'shop',
    permissions: [
      'content.view', 'content.create', 'content.edit', 'content.delete', 'content.moderate'
    ],
    canBeAssignedBy: ['ceo', 'administrator'],
  },
  shop_editor: {
    id: 'shop_editor',
    name: 'Редактор магазинов',
    description: 'Создание и редактирование магазинов',
    category: 'shop',
    permissions: [
      'content.view', 'content.create', 'content.edit'
    ],
    canBeAssignedBy: ['ceo', 'administrator'],
  },
  service_admin: {
    id: 'service_admin',
    name: 'Гл. Администратор сервисов',
    description: 'Полное управление сервисами',
    category: 'service',
    permissions: [
      'content.view', 'content.create', 'content.edit', 'content.delete', 'content.moderate'
    ],
    canBeAssignedBy: ['ceo', 'administrator'],
  },
  service_editor: {
    id: 'service_editor',
    name: 'Редактор сервисов',
    description: 'Создание и редактирование сервисов',
    category: 'service',
    permissions: [
      'content.view', 'content.create', 'content.edit'
    ],
    canBeAssignedBy: ['ceo', 'administrator'],
  },
  school_admin: {
    id: 'school_admin',
    name: 'Гл. Администратор мотошкол',
    description: 'Полное управление мотошколами',
    category: 'school',
    permissions: [
      'content.view', 'content.create', 'content.edit', 'content.delete', 'content.moderate'
    ],
    canBeAssignedBy: ['ceo', 'administrator'],
  },
  school_editor: {
    id: 'school_editor',
    name: 'Редактор мотошкол',
    description: 'Создание и редактирование мотошкол',
    category: 'school',
    permissions: [
      'content.view', 'content.create', 'content.edit'
    ],
    canBeAssignedBy: ['ceo', 'administrator'],
  },
  post_admin: {
    id: 'post_admin',
    name: 'Гл. Администратор байк-постов',
    description: 'Полное управление байк-постами',
    category: 'post',
    permissions: [
      'content.view', 'content.create', 'content.edit', 'content.delete', 'content.moderate'
    ],
    canBeAssignedBy: ['ceo', 'administrator'],
  },
  post_editor: {
    id: 'post_editor',
    name: 'Редактор байк-постов',
    description: 'Создание и редактирование байк-постов',
    category: 'post',
    permissions: [
      'content.view', 'content.create', 'content.edit'
    ],
    canBeAssignedBy: ['ceo', 'administrator'],
  },
};

export const PERMISSION_LABELS: Record<Permission, string> = {
  'users.view': 'Просмотр пользователей',
  'users.edit': 'Редактирование пользователей',
  'users.delete': 'Удаление пользователей',
  'users.ban': 'Блокировка пользователей',
  'users.roles': 'Управление ролями пользователей',
  'content.view': 'Просмотр контента',
  'content.create': 'Создание контента',
  'content.edit': 'Редактирование контента',
  'content.delete': 'Удаление контента',
  'content.moderate': 'Модерация контента',
  'reports.view': 'Просмотр жалоб',
  'reports.resolve': 'Обработка жалоб',
  'settings.view': 'Просмотр настроек',
  'settings.edit': 'Изменение настроек',
  'permissions.manage': 'Управление разрешениями',
};

export const PERMISSION_CATEGORIES = {
  users: ['users.view', 'users.edit', 'users.delete', 'users.ban', 'users.roles'],
  content: ['content.view', 'content.create', 'content.edit', 'content.delete', 'content.moderate'],
  reports: ['reports.view', 'reports.resolve'],
  settings: ['settings.view', 'settings.edit'],
  permissions: ['permissions.manage'],
} as const;
