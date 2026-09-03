import { Redirect } from 'expo-router';

/** Legacy wash packages are disabled; paid products live under real memberships. */
export default function PackageList() {
  return <Redirect href="/club" />;
}
