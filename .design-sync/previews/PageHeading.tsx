import { PageHeading } from '@bubbly/ui-web';

export const WithMeta = () => (
  <PageHeading title="Today's bookings" meta="18 washes scheduled · 3 washers online" />
);

export const TitleOnly = () => <PageHeading title="Washers" />;
