import { ROLE } from '@/lib/constants/role.constants';

const ROLE_LABELS: Readonly<Partial<Record<string, string>>> = {
  [ROLE.USER]: 'Kullanıcı',
  [ROLE.ADMIN]: 'Yönetici',
};

export function roleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}
