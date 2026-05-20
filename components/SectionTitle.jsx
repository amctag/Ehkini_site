export default function SectionTitle({ icon: Icon, title, iconProps, className }) {
  return (
    <h2 className={className}>
      {Icon ? <Icon {...iconProps} /> : null}
      {title}
    </h2>
  );
}

