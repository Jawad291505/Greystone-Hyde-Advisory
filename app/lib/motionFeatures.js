// framer-motion's animation engine, as its own module so it can be loaded
// after the page has painted (see MotionFeatures). The site only animates,
// fades, draws and reacts to hover or view: no layout or drag animations,
// so the smaller domAnimation set covers every `m.` component.
import { domAnimation } from "framer-motion";

export default domAnimation;
