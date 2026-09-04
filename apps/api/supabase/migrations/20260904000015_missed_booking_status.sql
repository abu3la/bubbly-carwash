-- A paid appointment that passed before the team arrived is not cancelled:
-- it is a consumed, missed wash. Keeping that distinction is what prevents a
-- subscription appointment from turning back into transferable credit.
alter type booking_status add value if not exists 'missed';
