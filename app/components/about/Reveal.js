// The About page's entrance, played once as the element scrolls into view: a
// short rise out of transparency. Plain markup: the motion is CSS (data-rise
// in globals.css), started by the page's one shared observer, so the About
// page stays server-rendered with no animation script of its own.
export function Reveal({ as: Tag = "div", delay = 0, y = 22, className, style, children, ...rest }) {
  return (
    <Tag data-rise="" style={{ "--d": `${delay}s`, "--rise": `${y}px`, ...style }} className={className} {...rest}>
      {children}
    </Tag>
  );
}
