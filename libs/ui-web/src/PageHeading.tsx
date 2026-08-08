interface PageHeadingProps {
  title: string;
  meta?: string;
}

export function PageHeading({ title, meta }: PageHeadingProps) {
  return (
    <div>
      <h1 className="bb-heading">{title}</h1>
      {meta ? <p className="bb-heading-meta">{meta}</p> : null}
    </div>
  );
}
