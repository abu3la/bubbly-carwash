import {
  useId,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

/** Native React versions of the five components used by the approved landing. */
export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }) {
  return <button className={`bb-btn bb-btn--${variant} bb-btn--${size} ${className}`} {...props} />;
}
export function Input({
  label,
  hint,
  className = '',
  style,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint: string }) {
  const id = useId();
  return (
    <label className={`bb-field ${className}`} style={style} htmlFor={id}>
      <span className="bb-field__label">{label}</span>
      <input {...props} id={id} aria-describedby={`${id}-hint`} className="bb-input" />
      <span id={`${id}-hint`} className="bb-field__hint">
        {hint}
      </span>
    </label>
  );
}
export function BeatIcon({
  size = 'md',
  animate,
  active = 3,
}: {
  size?: string;
  animate?: boolean;
  active?: number;
}) {
  return (
    <span
      aria-hidden="true"
      className={`bb-beat bb-beat--${size}${animate ? ' bb-beat--animate' : ''}`}
    >
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={`bb-beat__dot bb-beat__dot--${n}${n > active ? ' bb-beat__dot--off' : ''}`}
        />
      ))}
    </span>
  );
}
export function BookingTicket({ time, meta }: { time: string; meta: string }) {
  return (
    <div className="bb-ticket">
      <div className="bb-ticket__body">
        <div className="bb-ticket__label">BOOKING CARD</div>
        <div className="bb-ticket__time">
          <bdi dir="ltr">{time}</bdi>
        </div>
        <div className="bb-ticket__meta">{meta}</div>
      </div>
      <div className="bb-ticket__stub">
        <BeatIcon size="sm" />
      </div>
    </div>
  );
}
const statusCopy: Record<string, [string, string]> = {
  arrived: ['ARRIVED', 'وصل'],
  washed: ['WASHED', 'الغسيل'],
  verified: ['VERIFIED', 'تأكد'],
};
export function StatusBadge({
  status = 'arrived',
  size = 'md',
  ...props
}: HTMLAttributes<HTMLSpanElement> & { status?: string; size?: string }) {
  const [en, ar] = statusCopy[status] ?? statusCopy.arrived;
  return (
    <span {...props} className={`bb-seal bb-seal--${status} bb-seal--${size}`}>
      <span className="bb-seal__en" lang="en">
        {en}
      </span>
      <span className="bb-seal__ar" lang="ar">
        {ar}
      </span>
    </span>
  );
}
export function IOSDevice({
  children,
  width,
  height,
}: {
  children: ReactNode;
  width: number;
  height: number;
}) {
  return (
    <div className="bcw-device" style={{ width, height }}>
      <div className="bcw-island" aria-hidden="true" />
      <div className="bcw-statusbar" dir="ltr" aria-hidden="true">
        <span>9:41</span>
        <span className="bcw-status-icons">
          <svg width="19" height="12" viewBox="0 0 19 12">
            {[7.5, 5, 2.5, 0].map((y, i) => (
              <rect
                key={y}
                x={i * 4.8}
                y={y}
                width="3.2"
                height={12 - y}
                rx=".7"
                fill="currentColor"
              />
            ))}
          </svg>
          <svg width="17" height="12" viewBox="0 0 17 12">
            <path
              d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2ZM8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z"
              fill="currentColor"
            />
            <circle cx="8.5" cy="10.5" r="1.5" fill="currentColor" />
          </svg>
          <svg width="27" height="13" viewBox="0 0 27 13">
            <rect
              x=".5"
              y=".5"
              width="23"
              height="12"
              rx="3.5"
              stroke="currentColor"
              strokeOpacity=".35"
              fill="none"
            />
            <rect x="2" y="2" width="20" height="9" rx="2" fill="currentColor" />
            <path
              d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z"
              fill="currentColor"
              fillOpacity=".4"
            />
          </svg>
        </span>
      </div>
      <div className="bcw-device-content">{children}</div>
      <div className="bcw-home-indicator" aria-hidden="true" />
    </div>
  );
}
