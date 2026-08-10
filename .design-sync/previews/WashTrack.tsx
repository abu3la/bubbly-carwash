import { WashTrack } from '@bubbly/ui-web';

export const Assigned = () => <WashTrack status="assigned" />;

export const EnRoute = () => <WashTrack status="en_route" />;

export const Washing = () => <WashTrack status="washing" />;

export const Done = () => <WashTrack status="done" />;
