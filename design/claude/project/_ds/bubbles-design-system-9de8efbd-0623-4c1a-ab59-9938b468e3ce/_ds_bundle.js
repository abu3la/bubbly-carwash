/* @ds-bundle: {"format":4,"namespace":"BubblesDesignSystem_9de8ef","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"BeatIcon","sourcePath":"components/display/BeatIcon.jsx"},{"name":"BookingTicket","sourcePath":"components/display/BookingTicket.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"StatusBadge","sourcePath":"components/display/StatusBadge.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"ToastStack","sourcePath":"components/feedback/ToastStack.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"a4ba77871f05","components/actions/IconButton.jsx":"97dbc312a72a","components/display/Badge.jsx":"58d1a55bec10","components/display/BeatIcon.jsx":"57e09d85e5aa","components/display/BookingTicket.jsx":"9ec052ed38b4","components/display/Card.jsx":"99889c6734be","components/display/StatusBadge.jsx":"fa49f6748633","components/display/Tag.jsx":"87c53287611d","components/feedback/Dialog.jsx":"a90bb0cb43b4","components/feedback/Toast.jsx":"77c8f5eab9f9","components/feedback/ToastStack.jsx":"5990983aa214","components/feedback/Tooltip.jsx":"e0d8327ec5f2","components/forms/Checkbox.jsx":"a2ea2d22a397","components/forms/Input.jsx":"13e0730f9952","components/forms/Radio.jsx":"0f2141963543","components/forms/Select.jsx":"a5fb5d57b9a8","components/forms/Switch.jsx":"aac1f277135d","components/navigation/Tabs.jsx":"ff828eb3cd51","design_handoff_sama_redesign/app-ar/image-slot.js":"fff26d081c8d","ui_kits/admin/AdminViews.jsx":"fe07d80dcbc8","ui_kits/app-ar/BookingsScreen.jsx":"4c363635adb0","ui_kits/app-ar/ClubFlow.jsx":"19137134a89c","ui_kits/app-ar/HomeScreenAr.jsx":"cd3bf640d562","ui_kits/app-ar/OnboardingFlow.jsx":"c94ec2227641","ui_kits/app-ar/PackagesFlow.jsx":"cb1f6f587fb2","ui_kits/app-ar/ProfileScreen.jsx":"017ace7bf341","ui_kits/app-ar/SingleVisitFlow.jsx":"23833cd1bff5","ui_kits/app-ar/image-slot.js":"fff26d081c8d","ui_kits/app/BookScreen.jsx":"b6a6e06900ef","ui_kits/app/ClubScreen.jsx":"0ad878cac06b","ui_kits/app/HomeScreen.jsx":"a09ca42973a5","ui_kits/app/TrackScreen.jsx":"1238f6e1e03b","ui_kits/tech-ar/DaySummary.jsx":"a254cacb7d6a","ui_kits/tech-ar/JobFlow.jsx":"8789cb837eeb","ui_kits/tech-ar/OpsChat.jsx":"cee11e3de071","ui_kits/tech-ar/ScheduleScreen.jsx":"18d2b18fb048","ui_kits/tech-ar/Shared.jsx":"0120cd8a521c","ui_kits/tech-ar/TechProfile.jsx":"d6a0fffde7ad","ui_kits/tech-ar/TodayScreen.jsx":"43dae391fc12","ui_kits/tech-ar/image-slot.js":"fff26d081c8d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.BubblesDesignSystem_9de8ef = window.BubblesDesignSystem_9de8ef || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    className: "bb-btn bb-btn--" + variant + " bb-btn--" + size + " " + className
  }, rest), icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  variant = "secondary",
  size = "md",
  label,
  children,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": label,
    title: label,
    className: "bb-btn bb-iconbtn bb-btn--" + variant + " bb-btn--" + size + " " + className
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Badge({
  tone = "violet",
  className = "",
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "bb-badge" + (tone !== "violet" ? " bb-badge--" + tone : "") + " " + className
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/BeatIcon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function BeatIcon({
  size = "md",
  animate,
  active = 3,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "bb-beat bb-beat--" + size + (animate ? " bb-beat--animate" : "") + " " + className
  }, rest), [1, 2, 3].map(n => /*#__PURE__*/React.createElement("span", {
    key: n,
    className: "bb-beat__dot bb-beat__dot--" + n + (n > active ? " bb-beat__dot--off" : "")
  })));
}
Object.assign(__ds_scope, { BeatIcon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/BeatIcon.jsx", error: String((e && e.message) || e) }); }

// components/display/BookingTicket.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function BookingTicket({
  label = "BOOKING CARD",
  time,
  meta,
  stub,
  notch,
  className = "",
  style,
  ...rest
}) {
  const s = notch ? {
    "--notch": notch,
    ...style
  } : style;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "bb-ticket " + className,
    style: s
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "bb-ticket__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bb-ticket__label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "bb-ticket__time"
  }, time), meta && /*#__PURE__*/React.createElement("div", {
    className: "bb-ticket__meta"
  }, meta)), /*#__PURE__*/React.createElement("div", {
    className: "bb-ticket__stub"
  }, stub || /*#__PURE__*/React.createElement(__ds_scope.BeatIcon, {
    size: "sm"
  })));
}
Object.assign(__ds_scope, { BookingTicket });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/BookingTicket.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  variant,
  className = "",
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "bb-card" + (variant ? " bb-card--" + variant : "") + " " + className
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/StatusBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const COPY = {
  arrived: ["ARRIVED", "\u0648\u0635\u0644"],
  washed: ["WASHED", "\u0627\u0644\u063A\u0633\u064A\u0644"],
  verified: ["VERIFIED", "\u062A\u0623\u0643\u062F"]
};
function StatusBadge({
  status = "arrived",
  size = "md",
  className = "",
  ...rest
}) {
  const [en, ar] = COPY[status] || COPY.arrived;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "bb-seal bb-seal--" + status + " bb-seal--" + size + " " + className
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "bb-seal__en"
  }, en), /*#__PURE__*/React.createElement("span", {
    className: "bb-seal__ar",
    lang: "ar"
  }, ar));
}
Object.assign(__ds_scope, { StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tag({
  selected,
  className = "",
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-pressed": !!selected,
    className: "bb-tag" + (selected ? " bb-tag--selected" : "") + " " + className
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open,
  title,
  children,
  actions,
  onClose
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "bb-overlay",
    onClick: e => {
      if (e.target === e.currentTarget && onClose) onClose();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "bb-dialog",
    role: "dialog",
    "aria-modal": "true"
  }, title && /*#__PURE__*/React.createElement("h2", {
    className: "bb-dialog__title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "bb-dialog__body"
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    className: "bb-dialog__actions"
  }, actions)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONE = {
  arrived: "var(--status-arrived)",
  washed: "var(--status-washed)",
  verified: "var(--status-verified)",
  neutral: "var(--ink-40)"
};
function Toast({
  tone = "verified",
  size = "sm",
  title,
  action,
  onClose,
  className = "",
  children,
  ...rest
}) {
  const color = TONE[tone] || TONE.verified;
  if (size === "lg") {
    return /*#__PURE__*/React.createElement("div", _extends({
      className: "bb-toast bb-toast--lg " + className,
      role: "alert"
    }, rest), /*#__PURE__*/React.createElement("span", {
      className: "bb-toast__rail",
      style: {
        background: color
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "bb-toast__body"
    }, title && /*#__PURE__*/React.createElement("div", {
      className: "bb-toast__title"
    }, title), children && /*#__PURE__*/React.createElement("div", {
      className: "bb-toast__text"
    }, children), action && /*#__PURE__*/React.createElement("div", {
      className: "bb-toast__actions"
    }, action)), onClose && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "bb-toast__close",
      "aria-label": "Dismiss",
      onClick: onClose
    }, "\xD7"));
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "bb-toast " + className,
    role: "status"
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "bb-toast__dot",
    style: {
      background: color
    }
  }), children, action && /*#__PURE__*/React.createElement("span", {
    className: "bb-toast__action"
  }, action));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ToastStack.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ToastStack({
  placement = "bottom",
  offset,
  fixed,
  className = "",
  style,
  children,
  ...rest
}) {
  const vars = offset == null ? style : {
    ...style,
    "--bb-toast-offset": typeof offset === "number" ? offset + "px" : offset
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "bb-toast-stack bb-toast-stack--" + placement + (fixed ? " bb-toast-stack--fixed" : "") + " " + className,
    style: vars,
    "aria-live": placement === "top" ? "assertive" : "polite"
  }, rest), children);
}
Object.assign(__ds_scope, { ToastStack });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ToastStack.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tooltip({
  label,
  open,
  className = "",
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "bb-tooltip-wrap " + className
  }, rest), children, /*#__PURE__*/React.createElement("span", {
    className: "bb-tooltip" + (open ? " bb-tooltip--open" : ""),
    role: "tooltip"
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  label,
  className = "",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: "bb-check " + className,
    style: style
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox"
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "bb-check__box"
  }), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  hint,
  error,
  className = "",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: "bb-field" + (error ? " bb-field--error" : "") + " " + className,
    style: style
  }, label && /*#__PURE__*/React.createElement("span", {
    className: "bb-field__label"
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    className: "bb-input"
  }, rest)), (error || hint) && /*#__PURE__*/React.createElement("span", {
    className: "bb-field__hint"
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Radio({
  label,
  className = "",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: "bb-radio " + className,
    style: style
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "radio"
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "bb-radio__dot"
  }), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  label,
  hint,
  error,
  children,
  className = "",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: "bb-field" + (error ? " bb-field--error" : "") + " " + className,
    style: style
  }, label && /*#__PURE__*/React.createElement("span", {
    className: "bb-field__label"
  }, label), /*#__PURE__*/React.createElement("select", _extends({
    className: "bb-input"
  }, rest), children), (error || hint) && /*#__PURE__*/React.createElement("span", {
    className: "bb-field__hint"
  }, error || hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Switch({
  label,
  className = "",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: "bb-switch " + className,
    style: style
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    role: "switch"
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "bb-switch__track"
  }), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tabs({
  tabs = [],
  value,
  onChange,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "bb-tabs " + className,
    role: "tablist"
  }, rest), tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    role: "tab",
    "aria-selected": t === value,
    className: "bb-tabs__tab" + (t === value ? " bb-tabs__tab--active" : ""),
    onClick: () => onChange && onChange(t)
  }, t)));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// design_handoff_sama_redesign/app-ar/image-slot.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever a design needs an image.
 * You control the slot's shape; it sizes to its container by default. When the search_stock_photos tool
 * is available, prefill the slot by default — write the photo's URL into
 * src (with credit/credit-href); the user can still fill or replace it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The sidecar is a SIBLING of the HTML file that uses this component: the
 * read is a document-relative fetch, and the host resolves the bridge's
 * sidecar writes into the previewed file's directory to match (same
 * contract as design_canvas.jsx). Pages in the same directory share one
 * sidecar; keep slot ids distinct across them.
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          Initial framing baseline: cover | contain.   (default 'cover')
 *                cover starts the image filling the frame (overflow cropped);
 *                contain starts it fully visible (letterboxed). Either way the
 *                user can always pan/scale from there — double-click, or the
 *                Edit control, enters reframe mode (drag to move, scroll or
 *                corner-handles to scale; Escape / click-out commits). The
 *                crop persists alongside the image in the sidecar.
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. Prefill it with a real
 *                photo via search_stock_photos when that tool is available
 *                (set credit/credit-href from the result). A user drop
 *                overrides it; clearing the drop reveals src again.
 *   credit       Attribution text shown as a small overlay at the
 *                bottom-left of the filled slot. REQUIRED whenever src
 *                points at any Unsplash host (images.unsplash.com,
 *                plus.unsplash.com, …): an Unsplash src with no credit
 *                renders an error tile INSTEAD of the photo (Unsplash
 *                terms forbid showing their photos unattributed). Use the
 *                exact form 'Photo by {photographer name} on Unsplash' —
 *                the overlay then links the name to credit-href and
 *                'Unsplash' to the Unsplash homepage, and links back to
 *                unsplash.com automatically get the required utm referral
 *                params appended at render time. The credit belongs to
 *                the src image, so it only shows while src is what's
 *                displayed — a user-dropped image hides it.
 *   credit-href  Link for the photographer's name in the credit overlay
 *                (their Unsplash profile URL from the stock-photo search
 *                results). http(s) URLs only — anything else renders the
 *                name as plain text.
 *
 * Sizing: the slot fills its container by default (width/height 100%).
 * Put it in a sized wrapper — absolutely positioned, a grid cell, a fixed
 * frame — and it takes exactly that box. When the parent's height is
 * indefinite (ordinary flow), it falls back to full width at a 3:2 aspect
 * ratio instead of collapsing. In a shrink-to-fit parent (a float,
 * width:max-content, an unsized absolute wrapper), percentages have
 * nothing to resolve against — size the slot or its wrapper explicitly
 * there. For a fixed-size slot, set
 * width/height on the element itself (inline style), which overrides the
 * default. When
 * layering content above a slot (full-bleed layouts), make the overlay
 * click-through — pointer-events: none on scrims/text plates, re-enabled
 * on interactive children — so the slot's hover controls stay reachable.
 * Keep the slot's bottom-left corner visually clear as well: the credit
 * overlay renders there, and a dark fade or text plate covering it hides
 * the attribution Unsplash's terms require — end the fade above that
 * corner, or keep it nearly transparent where the credit sits.
 *
 * Usage:
 *   <div style="position:relative;width:100%;height:100%">      <!-- full-bleed: -->
 *     <image-slot id="bg" shape="rect"></image-slot>            <!-- fills the wrapper -->
 *   </div>
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.image-slots.state.json';

  // Unsplash terms require visible attribution wherever their photos
  // display, and every link back to unsplash.com must carry utm referral
  // params. Two render-time rules enforce that here:
  //  - an Unsplash-src slot with NO credit attribute renders an error
  //    tile INSTEAD of the photo (an uncredited Unsplash photo on screen
  //    is itself the terms violation, so it never renders bare);
  //  - rendered credit links pointing at unsplash.com get the referral
  //    params appended when absent (credit-href values live in page
  //    content that can't be edited after the fact).
  // Keep the utm_source value in sync with UTM_SOURCE in
  // platform/web-agent/unsplash.ts — this file is a project-local
  // artifact and cannot import it (equality is pinned by tests).
  const UNSPLASH_HOMEPAGE_HREF = 'https://unsplash.com/?utm_source=claude_design&utm_medium=referral';
  // Host rule mirrors the hotlink validator that admits Unsplash srcs into
  // pages in the first place (cdn$ in unsplash.ts: apex or any subdomain)
  // — Unsplash+ results serve from plus.unsplash.com, not just images.*,
  // and an admitted-but-uncredited photo must error whatever unsplash
  // host it rides on.
  // Trailing-dot FQDNs (images.unsplash.com.) are the same host to the
  // browser but would miss the regex — strip one dot so the check fails
  // CLOSED (unrecognized-but-real Unsplash srcs must error, not render).
  const isUnsplashHost = u => {
    try {
      return /(^|\.)unsplash\.com$/.test(new URL(u, document.baseURI).hostname.replace(/\.$/, ''));
    } catch {
      return false;
    }
  };
  // Render-time referral normalization for links back to Unsplash:
  // appends utm_source/utm_medium when absent, preserves every existing
  // query param, never overwrites an existing utm_source, and passes
  // non-Unsplash URLs through untouched. Input is an ABSOLUTE validated
  // http(s) URL (the credit render funnel resolves + validates first).
  const withReferral = href => {
    try {
      const u = new URL(href);
      if (!/(^|\.)unsplash\.com$/.test(u.hostname.replace(/\.$/, ''))) {
        return href;
      }
      if (!u.searchParams.has('utm_source')) {
        u.searchParams.set('utm_source', 'claude_design');
      }
      if (!u.searchParams.has('utm_medium')) {
        u.searchParams.set('utm_medium', 'referral');
      }
      return u.toString();
    } catch (e) {
      return href;
    }
  };
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  // Unload-time flush: save()'s serialization defers a mid-RTT re-fire to a
  // .then that never runs in an unloading document, silently dropping a
  // pagehide commit. Post the current slots immediately instead — content
  // is a superset snapshot of any in-flight save's, the write is a
  // whole-file last-writer-wins replace, and postMessage FIFO delivers it
  // to the host after the in-flight one, so a backend-side reorder at
  // worst reproduces the dropped-commit outcome this flush improves on.
  // Guarded on the initial sidecar read: pre-hydration slots can miss
  // other slots' persisted entries, and flushing it would clobber them —
  // that narrow case stays best-effort (the in-memory merge in load()
  // cannot happen in an unloading document anyway).
  function flushNow() {
    if (!loaded) return;
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    try {
      Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {});
    } catch (e) {}
  }
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet =
  // Fill the container by default: slots are usually placed inside a
  // sized wrapper (a hero frame, a grid cell, an inset:0 layer) and are
  // expected to take that box — a fixed intrinsic size would render as
  // a small tile in the corner of a full-bleed wrapper instead.
  // aspect-ratio is the companion fallback that keeps a bare slot
  // visible when the parent's height is indefinite: height:100%
  // resolves to auto there, and the ratio then derives height from
  // width instead of letting the slot collapse to zero height.
  // Explicit width/height on the element override all of this.
  // color:inherit (not a fixed near-black): the placeholder chrome —
  // empty-state icon/caption (currentColor) and the dashed ring — must
  // read on dark decks too, and the slide's own text color is the one
  // color guaranteed to contrast with the slide background. The soft
  // look comes from opacity on those parts, not from a baked-in alpha.
  ':host{display:block;position:relative;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;' + '  width:100%;height:100%;aspect-ratio:3/2}' + '.empty .cap,.empty .sub{opacity:.75}' + '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(127,127,127,.08)}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  // popover=manual promotes the spill to the top layer on reframe, so it is
  // not clipped by any overflow:hidden / clip-path / scroll-container
  // ancestor (a plain z-index can't escape overflow clipping). UA popover
  // defaults (inset:0;margin:auto) are reset; _applyView sets viewport px.
  '.spill{position:fixed;margin:0;inset:auto;border:0;padding:0;background:transparent;' + '  overflow:visible;transform:translate(-50%,-50%);z-index:1;cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px}' + '.empty:hover .sub{opacity:1}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed currentColor;' + '  opacity:.35;transition:border-color .12s,opacity .12s}' + ':host([data-over]) .ring{border-color:#c96442;opacity:1}' + ':host([data-filled]) .ring{display:none}' +
  // Controls overlay INSIDE the frame, pinned to the top-right corner, so
  // a full-bleed slot in an overflow:hidden container still shows them
  // (the old below-mask placement got clipped). Credit sits bottom-left,
  // so top-right avoids collision. The blurred pill background keeps them
  // legible over the image.
  // The UA [popover] base rule styles the element in EVERY state (only
  // display:none is gated on :not(:popover-open), and the display:flex
  // below overrides that) — so the UA resets live HERE, like .spill's,
  // or the ordinary hover-state strip renders as a bordered Canvas box
  // centered by margin:auto. inset:auto precedes top/right (shorthand).
  '.ctl{position:absolute;inset:auto;top:8px;right:8px;margin:0;border:0;padding:0;' + '  background:transparent;overflow:visible;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' +
  // While reframing, the spill owns the top layer and would swallow every
  // click on the in-frame controls. Promoting .ctl into the top layer
  // ABOVE the spill (shown after it — later popovers stack higher) keeps
  // Edit-as-toggle and Replace clickable mid-reframe. _applyView pins it
  // to the frame's top-right in viewport px (translateX(-100%)
  // right-aligns against the computed left edge); inset:auto clears the
  // base rule's top/right so the inline left/top position it alone.
  '.ctl:popover-open{position:fixed;inset:auto;transform:translateX(-100%)}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}' +
  // Replacement in flight: after a src swap the browser keeps painting
  // the PREVIOUS image until the new one decodes, so a Replace would
  // flash the old photo and then pop. Hide the stale frame (visibility,
  // not display — _applyView geometry still applies) and spin until the
  // new image reports in (load/error clears data-swapping).
  ':host([data-swapping]) .frame img{visibility:hidden}' + '.loading{position:absolute;inset:0;display:none;align-items:center;' + '  justify-content:center;pointer-events:none}' + ':host([data-swapping]) .loading{display:flex}' + '.loading::after{content:"";width:22px;height:22px;border-radius:50%;' + '  border:2px solid rgba(127,127,127,.25);border-top-color:currentColor;' + '  animation:om-slot-spin .7s linear infinite}' + '@keyframes om-slot-spin{to{transform:rotate(360deg)}}' +
  // Reduced motion: the static two-tone ring still reads as "working".
  '@media (prefers-reduced-motion:reduce){.loading::after{animation:none}}' + '.credit{position:absolute;left:6px;bottom:6px;max-width:calc(100% - 12px);display:none;' + '  padding:3px 7px;border-radius:5px;background:rgba(0,0,0,.55);color:#fff;' + '  font:10px/1.2 system-ui,-apple-system,sans-serif;text-decoration:none;' + '  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;backdrop-filter:blur(6px)}' +
  // The credit is a SPAN holding one or two <a>s (Unsplash's prescribed
  // form links the photographer AND Unsplash) — anchors style inline so
  // the overlay reads as one line of text.
  '.credit a{color:inherit;text-decoration:none}' + '.credit a:hover,.credit a:focus-visible{text-decoration:underline}' + ':host([data-filled][data-credit]) .credit{display:block}' +
  // Exports must ship JUST the image — no hover controls, no credit chip
  // (the host marks <html data-om-exporting> for the capture window; the
  // page-level hide script can't reach shadow DOM, this rule can).
  ':host-context([data-om-exporting]) .ctl,' + ':host-context([data-om-exporting]) .credit{display:none !important}' +
  // Print must ship just the image too: the hover-gated controls can be
  // mid-hover when print() fires, and the credit chip is screen chrome —
  // the same rule the capture window gets, keyed on print media instead
  // of the host's data-om-exporting mark (the print path sets no mark).
  '@media print{.ctl,.credit{display:none !important}}' +
  // No export-window mask rules here on purpose: the export capture
  // releases the replacement mask by REMOVING data-swapping (the
  // shadow-root pass in pages/export/shared.ts HIDE_EXPORT_CHROME_SCRIPT)
  // — attribute removal works in every engine (:host-context is
  // Chromium-only), is scoped by construction to slots actually
  // mid-swap, and hides the spinner through the same gate. A masked img
  // would otherwise be silently dropped from PPTX decks (the capture
  // walk skips visibility:hidden imgs).
  // Attribution error tile: REPLACES the photo when an Unsplash src has
  // no credit attribute — rendering the photo uncredited is the terms
  // violation, so the photo must not appear at all.
  // Calm and neutral on purpose (review feedback): the tile informs the
  // user; the fix instructions are machine-facing (usage docblock, tool
  // description, and the turn-end scan's bounce copy name the attributes
  // for the agent).
  '.attr-error{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  background:#f2f1ef;color:#6e6c66;user-select:none;' + '  font:13px/1.45 system-ui,-apple-system,sans-serif}' + '.attr-error svg{opacity:.55}' + '.attr-error .cap{max-width:92%;font-weight:500;letter-spacing:.01em}' + ':host([data-attribution-error]) .attr-error{display:flex}' + ':host([data-attribution-error]) .ring{display:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  const warnIcon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>' + '<path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'placeholder', 'src', 'id', 'credit', 'credit-href'];
    }

    /** Duplicate-slide hook (called by deck-stage, see its
     *  _remintDuplicateIds): copy this id's stored image, if any, under a
     *  freshly minted key and return that key — so a duplicated slide's
     *  slot keeps its dropped photo instead of reverting to the
     *  placeholder. 'isFree' is the caller's uniqueness check (document
     *  ids); candidates must ALSO be unused in the sidecar, which can
     *  hold keys from other pages sharing the project root. (An EMPTY
     *  slot on another page leaves no sidecar entry, so its id is not
     *  detectable here — a minted key can collide with it and that slot
     *  would show this photo. Same blast radius as two pages reusing an
     *  id by hand, which the shared sidecar already permits.) Returns null
     *  when no id could be minted (caller strips the id, today's
     *  behavior). */
    static cloneSlot(fromId, isFree) {
      if (typeof fromId !== 'string' || !fromId) return null;
      // Pre-hydration the store can't veto candidates or source the copy
      // — degrade to the strip (today's behavior) rather than mint
      // against keys we can't see yet. Any rendered (= droppable) slot
      // means load() has already settled.
      if (!loaded) return null;
      const stem = fromId.replace(/-\d+$/, '') || fromId;
      for (let n = 2; n < 100; n++) {
        const toId = stem + '-' + n;
        if (toId === fromId) continue;
        if (slots[toId] !== undefined) {
          // Reuse a key holding this exact value (bytes AND crop) if no
          // live element here owns it — a duplicate op the host refused
          // after minting leaves such a key behind, and reusing keeps
          // refused retries from accumulating one orphaned copy per
          // attempt. Full equality (not just bytes) so a byte-identical
          // key another PAGE owns with its own crop is stepped past, not
          // adopted or rewritten. (Entries without .u never match.)
          const prev = getSlot(toId);
          const cur = getSlot(fromId);
          if (!(prev && cur && prev.u && prev.u === cur.u && prev.s === cur.s && prev.x === cur.x && prev.y === cur.y && (typeof isFree !== 'function' || isFree(toId)))) continue;
          return toId;
        }
        if (typeof isFree === 'function' && !isFree(toId)) continue;
        const v = getSlot(fromId);
        if (v) setSlot(toId, Object.assign({}, v));
        return toId;
      }
      return null;
    }
    constructor() {
      super();
      // clonable: rail thumbnails deep-clone slides and carry this shadow
      // along; reuse an already-cloned root so upgrade-after-clone works.
      // (Deliberately NOT serializable — a getHTML consumer would embed
      // multi-MB sidecar data-URLs into serialized page HTML.)
      const root = this.shadowRoot || this.attachShadow({
        mode: 'open',
        clonable: true
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="attr-error" part="attribution-error">' + warnIcon + '    <div class="cap">This photo needs attribution</div></div>' + '  <div class="loading" part="loading"></div>' + '  <div class="ring" part="ring"></div>' + '</div>' +
      // Outside .frame, like .spill/.ctl — the frame's overflow:hidden +
      // border-radius/clip-path would cut the credit off on circle/pill/mask.
      // A SPAN, not an <a>: the prescribed Unsplash credit holds two links
      // (photographer + Unsplash), built per-render in _render().
      '<span class="credit" part="credit"></span>' + '<div class="spill" popover="manual" data-dc-edit-transparent>' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' +
      // data-dc-edit-transparent: the DC editor's edit-mode picker lets
      // clicks through for chrome marked with it (EDIT_TRANSPARENT_SEL)
      // — without it, Replace/Edit clicks in Edit mode are swallowed by
      // element selection and the controls look dead.
      '<div class="ctl" popover="manual" data-dc-edit-transparent><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="edit" title="Reframe image">Edit</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ctl = root.querySelector('.ctl');
      this._credit = root.querySelector('.credit');
      this._attrError = root.querySelector('.attr-error');
      // Credit clicks open the link, not browse/reframe.
      this._credit.addEventListener('click', e => e.stopPropagation());
      this._credit.addEventListener('dblclick', e => e.stopPropagation());
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      // Encode-in-flight marker (the owning _ingest generation): while set,
      // the same-src "nothing in flight" clear in _render must not fire —
      // the stored value still points at the OLD image until the encode
      // lands, so that clear would unmask the stale image mid-replace.
      this._swapGen = 0;
      // Render-owned swap in flight: set when _render assigns a new src,
      // cleared only by the img's own load/error (or the empty branch).
      // img.complete CANNOT stand in for this — setting src only QUEUES
      // the current-request swap (a microtask), so synchronously after an
      // assignment, complete still reports the OLD settled request. The
      // pick path does exactly that: the host sets src, credit, and
      // credit-href back-to-back in one task, and renders #2/#3 would
      // read the stale complete === true and drop the mask one render
      // after it was set.
      this._loadPending = false;
      // See _render's empty branch: a transient attribution-error wipe of a
      // showing image must make the follow-up render a replacement (spinner),
      // not a first fill (blank frame).
      this._hidShowing = false;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (!act) return;
        // The hidden controls are opacity-0 but still tabbable — without
        // this gate a keyboard user could drive them on a read-only share
        // link (mirrors the dblclick handler's editable gate).
        if (!this.hasAttribute('data-editable')) return;
        if (act === 'replace') {
          this._exitReframe(true);
          // Host-owned picker (Unsplash modal; it also offers local import).
          this.dispatchEvent(new CustomEvent('image-slot:pick', {
            bubbles: true,
            composed: true,
            detail: {
              id: this.id || null
            }
          }));
        }
        if (act === 'edit') {
          if (!this._reframes()) return;
          if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      // load/error also release the replacement-in-flight mask (via the
      // single discipline in _releaseMask): the swap is only revealed once
      // the new image can actually paint (on error the frame shows its
      // background, same as a fresh slot with a broken src).
      this._img.addEventListener('load', () => {
        this._loadPending = false;
        this._releaseMask(true);
        this._applyView();
      });
      this._img.addEventListener('error', () => {
        this._loadPending = false;
        this._releaseMask(true);
      });
      // Gated only on editable — any filled slot can be repositioned/scaled,
      // regardless of fit. Share links (no writeFile) stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
          const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // The host may inject window.omelette.writeFile AFTER the first render;
      // re-render on hover so the editable-gated controls reliably appear.
      this.addEventListener('pointerenter', this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('pointerenter', this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      // commit=false: a disconnect is not a user intent — committing here
      // would persist whatever half-finished drag a React remount or DOM
      // splice happened to interrupt. Deliberate exits commit on their own
      // paths (Escape/click-out/toggle), and unloads commit via pagehide.
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._signalReframe(true);
      // Best-effort commit when the document unloads mid-reframe (a host
      // navigation racing the enter signal, a manual reload, tab close):
      // the sidecar write rides the host bridge, which outlives this
      // document, so the crop survives even though the mode dies with the
      // DOM. Held on the instance so _exitReframe detaches exactly what
      // was attached.
      this._pagehide = () => {
        this._exitReframe(true);
        flushNow();
      };
      window.addEventListener('pagehide', this._pagehide);
      // Promote spill to the top layer, then keep it pinned over the frame:
      // scroll/resize cover the common cases, and a per-frame rect check
      // catches layout shifts that fire neither (an image above finishing
      // load, streamed DOM pushing the slot down, an ancestor transform
      // change) so the overlay can't detach from the frame.
      try {
        this._spill.showPopover();
      } catch {}
      // After the spill, so the controls stack above it in the top layer.
      try {
        this._ctl.showPopover();
      } catch {}
      this._reposition = () => {
        if (this.hasAttribute('data-reframe')) this._applyView();
      };
      window.addEventListener('scroll', this._reposition, true);
      window.addEventListener('resize', this._reposition);
      this._lastRect = '';
      this._watch = () => {
        if (!this.hasAttribute('data-reframe')) return;
        const r = this.getBoundingClientRect();
        const key = r.left + ',' + r.top + ',' + r.width + ',' + r.height;
        if (key !== this._lastRect) {
          this._lastRect = key;
          this._applyView();
        }
        this._watchId = requestAnimationFrame(this._watch);
      };
      this._watchId = requestAnimationFrame(this._watch);
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (this._reposition) {
        window.removeEventListener('scroll', this._reposition, true);
        window.removeEventListener('resize', this._reposition);
        this._reposition = null;
      }
      if (this._watchId) {
        cancelAnimationFrame(this._watchId);
        this._watchId = 0;
      }
      if (this._pagehide) {
        window.removeEventListener('pagehide', this._pagehide);
        this._pagehide = null;
      }
      try {
        this._spill.hidePopover();
      } catch {}
      try {
        this._ctl.hidePopover();
      } catch {}
      this._ctl.style.left = '';
      this._ctl.style.top = '';
      if (commit) this._commitView();
      this._signalReframe(false);
    }

    // Reframe state lives only in this DOM until commit, invisible to the
    // host's dirty signals — announce enter/exit so the host can hold
    // auto-reloads for exactly the gesture (the guest bundle forwards
    // image-slot:reframe to the host as imageSlotReframe). Dispatched on
    // the element (composed, so it escapes shadow roots) while connected;
    // a disconnected exit (disconnectedCallback) falls back to document so
    // the host still hears it.
    _signalReframe(active) {
      const target = this.isConnected ? this : document;
      target.dispatchEvent(new CustomEvent('image-slot:reframe', {
        bubbles: true,
        composed: true,
        detail: {
          active: active,
          id: this.id || null
        }
      }));
    }

    // Public: host's "Import from computer" calls this to run local browse.
    openFilePicker() {
      this._exitReframe(true);
      this._input.click();
    }

    // A src write is a newer intent for this slot's content — the host
    // pick path (setImageSlotImage) or an agent edit — so it must win
    // over any encode still in flight from an earlier drop: left live,
    // that encode lands later, passes _ingest's gen guard, and its
    // setSlot silently overwrites the pick (the stored value shadows
    // src in _render). Bumping _gen kills the encode before its own
    // _swapGen clear runs, so clear the dead claim here too — otherwise
    // _releaseMask (gated on !_swapGen) never fires and the pick's
    // spinner is stranded. src ONLY: the pick sets credit/credit-href
    // in the same task, and clearing _swapGen on those would let the
    // same-src branch unmask the old image mid-encode.
    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'src' && oldVal !== newVal) {
        this._gen++;
        this._swapGen = 0;
      }
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      // Replacing a shown image: surface the swap through the encode too,
      // not just the decode — otherwise the old photo sits there with no
      // feedback while the canvas re-encode runs. An empty slot keeps its
      // placeholder (no spinner) until the encode lands, as before.
      // _swapGen guards the mask against re-renders DURING the encode
      // (pointerenter, ResizeObserver, another slot's store write): the
      // stored value still resolves to the old image there, so _render's
      // same-src clear would otherwise unmask it mid-replace.
      if (this.hasAttribute('data-filled')) {
        this.setAttribute('data-swapping', '');
        this._swapGen = gen;
      }
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        // Clear BEFORE setSlot: its synchronous re-render must see no
        // pending encode, so a byte-identical re-upload (same data URL, no
        // load event coming) still clears the mask via the complete branch.
        this._swapGen = 0;
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._swapGen = 0;
        // Reveal the kept old image — unless another replacement (a
        // remote pick's src swap) is still in flight, in which case the
        // mask stays until THAT image settles (its load/error releases).
        this._releaseMask();
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is available on any filled slot — the user can
    // always reposition/scale. `fit` only sets the initial baseline (see
    // _geom): contain starts fully-visible, cover starts frame-filling.
    _reframes() {
      return this.hasAttribute('data-filled');
    }

    // The single release discipline for the replacement-in-flight mask
    // (data-swapping). The mask comes off only when BOTH hold:
    //  - no encode is pending (_swapGen) — mid-encode the stored value
    //    still resolves to the old image, so any reveal paints it;
    //  - the frame img has settled on its current src — an unsettled src
    //    means some replacement is still in flight (e.g. a remote pick),
    //    whoever started it, and revealing would paint the previous
    //    frame. The load/error listeners pass settled=true (the event IS
    //    the settlement signal, per spec complete is true by then);
    //    other callers rely on the complete flag (covers loaded AND
    //    failed).
    // Every release path funnels through here EXCEPT _render's empty
    // branch (the img is being cleared — nothing will ever settle).
    _releaseMask(settled) {
      if (!this._swapGen && !this._loadPending && (settled || this._img.complete)) {
        this.removeAttribute('data-swapping');
      }
    }

    // Baseline geometry, shared by clamp/apply/resize. `base` is the scale at
    // view-scale s=1: cover = fill the frame (overflow on the looser axis),
    // contain = fit fully inside (letterboxed). Zooming a contain image past
    // s where it overflows naturally becomes a crop. Null until the img has
    // loaded (naturalWidth is 0 before that) or when the slot has no layout
    // box — ResizeObserver fires with a 0×0 rect under display:none, and
    // clamping against a degenerate 1×1 frame would silently pull the stored
    // pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
      const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
      return {
        iw,
        ih,
        fw,
        fh,
        base
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      // Top-layer controls: pin to the frame's top-right in viewport px
      // (the same 8px inset as the in-frame layout; unscaled — top-layer UI
      // reads as chrome, not page content). BEFORE the geometry branch:
      // placement needs only the frame rect, and a not-yet-loaded or broken
      // src must not leave the promoted strip floating unpositioned. Gated
      // on the popover actually being open: without the Popover API,
      // showPopover() threw (swallowed in _enterReframe), .ctl stays in
      // its in-frame absolute layout, and viewport-px coordinates would
      // shove it off-frame — and matches(':popover-open') itself throws
      // there (unknown pseudo-class), hence the try/catch.
      if (this.hasAttribute('data-reframe')) {
        let onTop = false;
        try {
          onTop = this._ctl.matches(':popover-open');
        } catch {}
        if (onTop) {
          const r = this.getBoundingClientRect();
          this._ctl.style.left = r.right - 8 + 'px';
          this._ctl.style.top = r.top + 8 + 'px';
        }
      }
      if (!g) {
        // Dimensions not known yet (before img load) — centered fit so there
        // is no flash of an unpositioned image before the geometry lands.
        const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = contain ? 'contain' : 'cover';
        return;
      }
      // Baseline (cover-fill or contain-fit) × view scale. Width/height and
      // left/top are all frame-% — depends only on the frame aspect ratio, so
      // a responsive resize keeps the same crop. The spill layer mirrors the
      // same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      if (this.hasAttribute('data-reframe')) {
        // Top-layer spill: position in viewport px over the frame. The top
        // layer escapes ancestor transforms entirely, so EVERY term must be
        // in viewport units: getBoundingClientRect gives the frame's scaled
        // origin AND size, and the rect/layout ratio rescales the ghost —
        // sizing from layout px alone renders it 1/scale too large under a
        // scaled deck slide. Inner ghost + handles stay box-relative.
        const r = this.getBoundingClientRect();
        const sx = g.fw ? r.width / g.fw : 1;
        const sy = g.fh ? r.height / g.fh : 1;
        this._spill.style.width = g.iw * k * sx + 'px';
        this._spill.style.height = g.ih * k * sy + 'px';
        this._spill.style.left = r.left + (50 + this._view.x) / 100 * r.width + 'px';
        this._spill.style.top = r.top + (50 + this._view.y) / 100 * r.height + 'px';
      }
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      // An Unsplash src with no credit attribute must NOT render — showing
      // the photo uncredited is the Unsplash-terms violation itself. The
      // error tile replaces the photo until the credit is written. A
      // user-dropped image is the user's own content and always renders.
      // Trimmed: credit is agent/user-editable content, and a whitespace-
      // only value must count as missing — otherwise it would suppress the
      // error tile AND render an empty credit box (no text, no links),
      // exactly the unattributed state this gate exists to prevent.
      const credit = (this.getAttribute('credit') || '').trim();
      const attrError = !!(!credit && !this._userUrl && srcAttr && isUnsplashHost(srcAttr));
      this.toggleAttribute('data-attribution-error', attrError);
      if (url && !attrError) {
        const prev = this._img.getAttribute('src');
        if (prev !== url) {
          // Replacing an already-shown image: mark the swap BEFORE setting
          // src so the stale frame is never revealed (see the data-swapping
          // stylesheet rules). First fill (prev empty) keeps the existing
          // placeholder-until-load behavior — no spinner. _hidShowing
          // covers the pick path's transient attribution-error wipe: prev
          // is gone, but an image WAS showing, so this is a replacement.
          if (prev || this._hidShowing) this.setAttribute('data-swapping', '');
          // Mark the swap BEFORE assigning src: complete keeps reporting
          // the old settled request until the browser's
          // update-the-image-data microtask runs, so same-task re-renders
          // (the pick path's credit/credit-href setAttributes) need this
          // flag, not complete, to know a load is in flight.
          this._loadPending = true;
          this._img.src = url;
          this._ghost.src = url;
        } else {
          // Same-src re-render — release if settled, so an ingest-set
          // spinner can't stick after a byte-identical re-upload (same
          // data URL, no further load event ever fires).
          this._releaseMask();
        }
        this._hidShowing = false;
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this.removeAttribute('data-swapping');
        // The src is being removed — no load/error will ever fire for it.
        this._loadPending = false;
        // A transient attribution-error wipe of a showing image happens on
        // the pick path: the host sets src one setAttribute before credit,
        // so render N hides the old image (attrError) and render N+1
        // restores a URL. Remember the wipe so that restore renders as a
        // replacement (spinner), not a first fill (blank frame).
        this._hidShowing = attrError && !!this._img.getAttribute('src');
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        // The error tile owns the blocked-photo state; .empty stays for
        // the genuinely-empty slot.
        this._empty.style.display = attrError ? 'none' : 'flex';
        this.removeAttribute('data-filled');
      }

      // Credit belongs to the author src, so a user drop hides it.
      // textContent + the http(s)-only funnel keep external strings inert.
      const showCredit = !!(url && credit && !this._userUrl && !attrError);
      this._credit.textContent = '';
      if (showCredit) {
        // Validate once (resolved against the document, http(s) only),
        // then append the terms-required utm referral params to links
        // that point back at unsplash.com.
        let href = '';
        const rawHref = this.getAttribute('credit-href') || '';
        if (rawHref) {
          try {
            const u = new URL(rawHref, document.baseURI);
            if (u.protocol === 'http:' || u.protocol === 'https:') {
              href = withReferral(u.href);
            }
          } catch {}
        }
        const mkLink = (text, linkHref) => {
          const a = document.createElement('a');
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          a.setAttribute('href', linkHref);
          a.textContent = text;
          return a;
        };
        // Unsplash's prescribed credit is TWO links — the photographer's
        // name to their profile (credit-href) and 'Unsplash' to the
        // homepage. Render that split whenever the text has the canonical
        // shape; other text keeps the legacy single-link rendering.
        const m = /^Photo by (.+) on Unsplash$/.exec(credit);
        if (m) {
          this._credit.appendChild(document.createTextNode('Photo by '));
          this._credit.appendChild(href ? mkLink(m[1], href) : document.createTextNode(m[1]));
          this._credit.appendChild(document.createTextNode(' on '));
          this._credit.appendChild(mkLink('Unsplash', UNSPLASH_HOMEPAGE_HREF));
        } else if (href) {
          this._credit.appendChild(mkLink(credit, href));
        } else {
          this._credit.textContent = credit;
        }
      }
      this.toggleAttribute('data-credit', showCredit);
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff_sama_redesign/app-ar/image-slot.js", error: String((e && e.message) || e) }); }

// ui_kits/admin/AdminViews.jsx
try { (() => {
const DS = window.BubblesDesignSystem_9de8ef;
const fmtSAR = n => n.toLocaleString('en-US') + ' ر.س';
function Stat({
  label,
  value,
  delta,
  tone
}) {
  const {
    Card
  } = DS;
  return /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 600,
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 30,
      fontWeight: 800,
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.02em'
    }
  }, value), delta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: tone === 'down' ? 'var(--guava-600)' : 'var(--violet)'
    }
  }, delta));
}
function Table({
  cols,
  rows,
  align
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden',
      borderRadius: 'var(--radius-md)',
      border: '1.5px solid var(--border-subtle)',
      background: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, cols.map((c, i) => /*#__PURE__*/React.createElement("th", {
    key: c,
    style: {
      textAlign: align && align[i] || 'right',
      padding: '11px 16px',
      fontSize: 11.5,
      fontWeight: 700,
      letterSpacing: '0.06em',
      color: 'var(--text-muted)',
      background: 'var(--surface-page)',
      borderBottom: '1.5px solid var(--border-subtle)'
    }
  }, c)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, ri) => /*#__PURE__*/React.createElement("tr", {
    key: ri,
    style: {
      borderBottom: ri < rows.length - 1 ? '1px solid var(--border-subtle)' : 'none'
    }
  }, r.map((cell, ci) => /*#__PURE__*/React.createElement("td", {
    key: ci,
    style: {
      padding: '12px 16px',
      textAlign: align && align[ci] || 'right',
      fontVariantNumeric: 'tabular-nums'
    }
  }, cell)))))));
}
function SectionHead({
  title,
  sub,
  actions
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 16,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 24,
      fontWeight: 800,
      letterSpacing: '-0.01em'
    }
  }, title), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-muted)',
      marginTop: 4
    }
  }, sub)), actions);
}
function PayBadge({
  s
}) {
  const {
    Badge
  } = DS;
  const map = {
    paid: ['مدفوعة', 'violet'],
    pending: ['بانتظار الدفع', 'yellow'],
    refunded: ['مستردّة', 'guava']
  };
  const [label, tone] = map[s];
  return /*#__PURE__*/React.createElement(Badge, {
    tone: tone
  }, label);
}
function SubBadge({
  s
}) {
  const {
    Badge
  } = DS;
  const map = {
    active: ['نشط', 'violet'],
    paused: ['متوقف مؤقتًا', 'yellow'],
    cancelled: ['ملغى', 'guava']
  };
  const [label, tone] = map[s];
  return /*#__PURE__*/React.createElement(Badge, {
    tone: tone
  }, label);
}
const BOOKINGS = [['#B-4231', 'نورة العتيبي', 'غسلة كاملة', 'حي الياسمين', '10:30–11:00', 'arrived', 69], ['#B-4230', 'خالد الشمري', 'غسلة خارجية', 'حي الملقا', '10:00–10:30', 'washed', 49], ['#B-4229', 'سارة القحطاني', 'غسلة خارجية + إطارات', 'حي النرجس', '09:30–10:00', 'verified', 64], ['#B-4228', 'عبدالله الدوسري', 'غسلة كاملة', 'حي الصحافة', '09:00–09:30', 'verified', 69], ['#B-4227', 'ريم المطيري', 'غسلة خارجية', 'حي حطين', '08:30–09:00', 'verified', 49]];
const SUBS = [['نورة العتيبي', 'بلس', '6 / 8', '10 سبتمبر', 199, 'active'], ['محمد الحربي', 'أساسي', '2 / 4', '14 سبتمبر', 149, 'active'], ['فهد العنزي', 'بلس', '8 / 8', '2 سبتمبر', 199, 'active'], ['لطيفة السبيعي', 'أساسي', '1 / 4', '22 سبتمبر', 149, 'paused'], ['تركي الغامدي', 'ماكس', '9 / 12', '5 سبتمبر', 279, 'active'], ['هند الزهراني', 'أساسي', '4 / 4', '—', 149, 'cancelled']];
const INVOICES = [['INV-2026-0841', 'نورة العتيبي', 'اشتراك — بلس', '10 أغسطس', 199, 'paid'], ['INV-2026-0840', 'خالد الشمري', 'غسلة واحدة', '10 أغسطس', 49, 'paid'], ['INV-2026-0839', 'سارة القحطاني', 'غسلة + إضافات', '9 أغسطس', 64, 'paid'], ['INV-2026-0838', 'بدر السهلي', 'باقة 5 غسلات', '9 أغسطس', 219, 'pending'], ['INV-2026-0837', 'ريم المطيري', 'غسلة واحدة', '8 أغسطس', 49, 'refunded'], ['INV-2026-0836', 'تركي الغامدي', 'اشتراك — ماكس', '8 أغسطس', 279, 'paid']];
function OverviewView() {
  const {
    StatusBadge,
    Card
  } = DS;
  const days = [['س', 62], ['أ', 78], ['ن', 71], ['ث', 84], ['ر', 92], ['خ', 100], ['ج', 55]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: "\u0646\u0638\u0631\u0629 \u0639\u0627\u0645\u0629",
    sub: "\u0627\u0644\u064A\u0648\u0645 \u2014 \u0627\u0644\u062B\u0644\u0627\u062B\u0627\u0621 10 \u0623\u063A\u0633\u0637\u0633 2026"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    label: "\u062D\u062C\u0648\u0632\u0627\u062A \u0627\u0644\u064A\u0648\u0645",
    value: "46",
    delta: "+8 \u0639\u0646 \u0623\u0645\u0633"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "\u0627\u0634\u062A\u0631\u0627\u0643\u0627\u062A \u0646\u0634\u0637\u0629",
    value: "312",
    delta: "+14 \u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "\u0625\u064A\u0631\u0627\u062F\u0627\u062A \u0627\u0644\u0634\u0647\u0631",
    value: "84,320 \u0631.\u0633",
    delta: "+11% \u0639\u0646 \u064A\u0648\u0644\u064A\u0648"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "\u0645\u062A\u0648\u0633\u0637 \u0627\u0644\u062A\u0642\u064A\u064A\u0645",
    value: "4.9",
    delta: "\u0622\u062E\u0631 30 \u064A\u0648\u0645"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr',
      gap: 16,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
    title: "\u062D\u062C\u0648\u0632\u0627\u062A \u0627\u0644\u0635\u0628\u0627\u062D",
    sub: "\u0623\u062D\u062F\u062B 5 \u062D\u062C\u0648\u0632\u0627\u062A"
  }), /*#__PURE__*/React.createElement(Table, {
    cols: ['الحجز', 'العميل', 'الخدمة', 'الموعد', 'الحالة'],
    rows: BOOKINGS.map(b => [/*#__PURE__*/React.createElement("span", {
      dir: "ltr",
      style: {
        fontWeight: 600
      }
    }, b[0]), b[1], b[2], /*#__PURE__*/React.createElement("span", {
      dir: "ltr"
    }, b[4]), /*#__PURE__*/React.createElement(StatusBadge, {
      status: b[5],
      size: "sm"
    })])
  })), /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14.5,
      fontWeight: 700,
      marginBottom: 16
    }
  }, "\u0627\u0644\u062D\u062C\u0648\u0632\u0627\u062A \u2014 \u0622\u062E\u0631 7 \u0623\u064A\u0627\u0645"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 10,
      height: 150
    }
  }, days.map(([d, h], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      height: '100%',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: h + '%',
      borderRadius: 6,
      background: i === 5 ? 'var(--violet)' : 'var(--violet-100)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--text-muted)'
    }
  }, d)))))));
}
function BookingsView() {
  const {
    StatusBadge,
    Button
  } = DS;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
    title: "\u0627\u0644\u062D\u062C\u0648\u0632\u0627\u062A",
    sub: "46 \u062D\u062C\u0632\u064B\u0627 \u0627\u0644\u064A\u0648\u0645 \u2014 3 \u0642\u064A\u062F \u0627\u0644\u062A\u0646\u0641\u064A\u0630",
    actions: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary"
    }, "\u062A\u0635\u062F\u064A\u0631 CSV")
  }), /*#__PURE__*/React.createElement(Table, {
    cols: ['الحجز', 'العميل', 'الخدمة', 'الحي', 'الموعد', 'المبلغ', 'الحالة'],
    rows: BOOKINGS.map(b => [/*#__PURE__*/React.createElement("span", {
      dir: "ltr",
      style: {
        fontWeight: 600
      }
    }, b[0]), b[1], b[2], b[3], /*#__PURE__*/React.createElement("span", {
      dir: "ltr"
    }, b[4]), fmtSAR(b[6]), /*#__PURE__*/React.createElement(StatusBadge, {
      status: b[5],
      size: "sm"
    })])
  }));
}
function SubsView() {
  const {
    Button,
    Card
  } = DS;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: "\u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643\u0627\u062A \u2014 \u0646\u0627\u062F\u064A \u0633\u0645\u0627",
    sub: "312 \u0645\u0634\u062A\u0631\u0643\u064B\u0627 \u0646\u0634\u0637\u064B\u0627 \xB7 \u062A\u062C\u062F\u064A\u062F \u062A\u0644\u0642\u0627\u0626\u064A \u0634\u0647\u0631\u064A",
    actions: /*#__PURE__*/React.createElement(Button, {
      size: "sm"
    }, "\u0625\u0636\u0627\u0641\u0629 \u0645\u0634\u062A\u0631\u0643")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16
    }
  }, [['أساسي', '149 ر.س', '164 مشترك', '4 غسلات/شهر'], ['بلس', '199 ر.س', '118 مشترك', '8 غسلات/شهر'], ['ماكس', '279 ر.س', '30 مشترك', '12 غسلة/شهر']].map(([n, p, c, w]) => /*#__PURE__*/React.createElement(Card, {
    key: n,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 14.5,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("span", null, n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontVariantNumeric: 'tabular-nums'
    }
  }, p)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-muted)'
    }
  }, c, " \xB7 ", w)))), /*#__PURE__*/React.createElement(Table, {
    cols: ['المشترك', 'الخطة', 'الرصيد المستخدم', 'التجديد القادم', 'الاشتراك الشهري', 'الحالة'],
    rows: SUBS.map(s => [/*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600
      }
    }, s[0]), s[1], /*#__PURE__*/React.createElement("span", {
      dir: "ltr"
    }, s[2]), s[3], fmtSAR(s[4]), /*#__PURE__*/React.createElement(SubBadge, {
      s: s[5]
    })])
  }));
}
function InvoicesView() {
  const {
    Button
  } = DS;
  const total = INVOICES.filter(i => i[5] === 'paid').reduce((a, i) => a + i[4], 0);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: "\u0627\u0644\u0641\u0648\u0627\u062A\u064A\u0631",
    sub: 'محصّل هذا الأسبوع: ' + fmtSAR(total) + ' · تشمل ضريبة القيمة المضافة 15%',
    actions: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary"
    }, "\u062A\u0635\u062F\u064A\u0631 CSV")
  }), /*#__PURE__*/React.createElement(Table, {
    cols: ['رقم الفاتورة', 'العميل', 'النوع', 'التاريخ', 'المبلغ', 'الحالة'],
    rows: INVOICES.map(i => [/*#__PURE__*/React.createElement("span", {
      dir: "ltr",
      style: {
        fontWeight: 600
      }
    }, i[0]), i[1], i[2], i[3], fmtSAR(i[4]), /*#__PURE__*/React.createElement(PayBadge, {
      s: i[5]
    })])
  }));
}
Object.assign(window, {
  OverviewView,
  BookingsView,
  SubsView,
  InvoicesView,
  AdminIconReady: true
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/AdminViews.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app-ar/BookingsScreen.jsx
try { (() => {
const BK_STEPS = [{
  key: 'arrived',
  title: 'وصل',
  copy: 'الفنّي عند البوابة.',
  time: '10:31'
}, {
  key: 'washed',
  title: 'الغسيل',
  copy: 'اكتمل الغسيل — التجفيف جارٍ.',
  time: '10:52'
}, {
  key: 'verified',
  title: 'تأكد',
  copy: 'فُحصت الجودة — أُرسلت لك صورة.',
  time: '10:58'
}];
const BK_HISTORY = [{
  slot: '09:00–09:30',
  date: 'الأحد 2 أغسطس',
  service: 'غسلة خارجية',
  rated: 5
}, {
  slot: '16:00–16:30',
  date: 'الخميس 23 يوليو',
  service: 'غسلة خارجية + واكس',
  rated: 4
}];
function BookingsScreen({
  upcoming,
  stage,
  advance,
  openSingle,
  initialTab
}) {
  const {
    Button,
    Card,
    Tabs,
    Badge,
    StatusBadge,
    BeatIcon,
    BookingTicket,
    IconButton,
    Checkbox
  } = window.BubblesDesignSystem_9de8ef;
  const [rating, setRating] = React.useState(0);
  const [useTech, setUseTech] = React.useState(true);
  const [sent, setSent] = React.useState(false);
  const [tab, setTab] = React.useState(initialTab || (upcoming ? 'النشطة' : 'القادمة'));
  const empty = msg => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14,
      padding: '56px 24px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/bubbles-illustration.svg",
    style: {
      width: 110,
      opacity: 0.9
    },
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700
    }
  }, msg), /*#__PURE__*/React.createElement(Button, {
    onClick: openSingle
  }, "\u0627\u062D\u062C\u0632 \u063A\u0633\u0644\u0629"));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      padding: '18px 20px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 700
    }
  }, "\u062D\u062C\u0648\u0632\u0627\u062A\u064A"), /*#__PURE__*/React.createElement(Tabs, {
    tabs: ['القادمة', 'النشطة', 'السابقة'],
    value: tab,
    onChange: setTab
  }), tab === 'القادمة' && (upcoming ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(BookingTicket, {
    label: "\u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u062D\u062C\u0632",
    time: upcoming.slot,
    meta: upcoming.day + ' · ' + upcoming.service + ' · المنزل',
    stub: /*#__PURE__*/React.createElement(BeatIcon, {
      size: "sm",
      active: 0
    })
  }), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement(LRow, {
    label: "\u0627\u0644\u0633\u064A\u0627\u0631\u0629",
    amount: "\u0644\u0643\u0632\u0633 LX \u2014 \u0623\u0628\u064A\u0636",
    muted: true
  }), /*#__PURE__*/React.createElement(LRow, {
    label: "\u0627\u0644\u0645\u0648\u0642\u0639",
    amount: "\u0641\u064A\u0644\u0627 12\u060C \u062D\u064A \u0627\u0644\u0646\u062E\u064A\u0644",
    muted: true
  }), /*#__PURE__*/React.createElement(LRow, {
    label: "\u0627\u0644\u062F\u0641\u0639",
    amount: upcoming.usedCredit ? 'رصيد الباقة' : 'مدى •••• 6011',
    muted: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    style: {
      flex: 1
    }
  }, "\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u062C\u062F\u0648\u0644\u0629"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    style: {
      flex: 1
    }
  }, "\u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u062D\u062C\u0632")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-muted)'
    }
  }, "\u0627\u0644\u0625\u0644\u063A\u0627\u0621 \u0645\u062C\u0627\u0646\u064A \u062D\u062A\u0649 12 \u0633\u0627\u0639\u0629 \u0642\u0628\u0644 \u0627\u0644\u0645\u0648\u0639\u062F.")) : empty('لا حجوزات قادمة بعد')), tab === 'النشطة' && (upcoming ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(BookingTicket, {
    label: "\u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u062D\u062C\u0632",
    time: upcoming.slot,
    meta: upcoming.service + ' · فيلا 12، حي النخيل',
    stub: /*#__PURE__*/React.createElement(BeatIcon, {
      size: "sm",
      active: stage
    })
  }), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 44,
      borderRadius: '50%',
      background: 'var(--violet-100)',
      color: 'var(--violet)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 15,
      fontWeight: 700
    }
  }, "\u0645"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700
    }
  }, "\u0645\u062D\u0645\u062F \u0627\u0644\u0639. ", /*#__PURE__*/React.createElement(Badge, {
    style: {
      marginInlineStart: 4
    }
  }, stage === 0 ? 'في الطريق' : 'في الموقع')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, stage === 0 ? 'يصل خلال 12 دقيقة تقريبًا' : 'بدأ العمل على سيارتك')), /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": "\u0627\u062A\u0635\u0627\u0644"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Phone",
    size: 17
  }))), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    style: {
      margin: 0
    }
  }, "\u062D\u0627\u0644\u0629 \u0627\u0644\u063A\u0633\u0644\u0629"), /*#__PURE__*/React.createElement(BeatIcon, {
    size: "md",
    active: stage,
    animate: stage < 3
  })), BK_STEPS.map((s, i) => {
    const done = i < stage;
    return /*#__PURE__*/React.createElement("div", {
      key: s.key,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        opacity: done ? 1 : 0.38
      }
    }, /*#__PURE__*/React.createElement(StatusBadge, {
      status: s.key,
      size: "sm"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600
      }
    }, s.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: 'var(--text-secondary)'
      }
    }, done ? s.copy : 'بالانتظار…')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: 'var(--text-muted)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, /*#__PURE__*/React.createElement(T, null, done ? s.time : '—')));
  })), stage >= 3 && /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700
    }
  }, "\u0635\u0648\u0631 \u0627\u0644\u062A\u0648\u062B\u064A\u0642"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      height: 130
    }
  }, /*#__PURE__*/React.createElement("image-slot", {
    id: "wash-photo-1",
    shape: "rounded",
    radius: "14",
    placeholder: "\u0635\u0648\u0631\u0629 \u0627\u0644\u0633\u064A\u0627\u0631\u0629 \u0628\u0639\u062F \u0627\u0644\u063A\u0633\u064A\u0644"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      height: 130
    }
  }, /*#__PURE__*/React.createElement("image-slot", {
    id: "wash-photo-2",
    shape: "rounded",
    radius: "14",
    placeholder: "\u0635\u0648\u0631\u0629 \u0625\u0636\u0627\u0641\u064A\u0629"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-muted)'
    }
  }, "\u0627\u0644\u062A\u0642\u0637\u0647\u0627 \u0627\u0644\u0641\u0646\u0651\u064A \u0645\u062D\u0645\u062F \u0639\u0646\u062F \u0625\u0643\u0645\u0627\u0644 \u0627\u0644\u063A\u0633\u0644\u0629 \u2014 \u0644\u0644\u0639\u0631\u0636 \u0641\u0642\u0637.")), stage >= 3 && (sent ? /*#__PURE__*/React.createElement(Card, {
    style: {
      background: 'var(--yellow-100)',
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: "verified",
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700
    }
  }, "\u0634\u0643\u0631\u064B\u0627 \u0644\u0643!"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, "\u0648\u0635\u0644 \u062A\u0642\u064A\u064A\u0645\u0643 \u0648\u0633\u064A\u0637\u0651\u0644\u0639 \u0639\u0644\u064A\u0647 \u0641\u0631\u064A\u0642 \u0627\u0644\u062C\u0648\u062F\u0629."))) : /*#__PURE__*/React.createElement(Card, {
    style: {
      background: 'var(--yellow-100)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      borderRadius: '50%',
      background: 'var(--white)',
      color: 'var(--violet)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      fontWeight: 700
    }
  }, "\u0645"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700
    }
  }, "\u0642\u064A\u0651\u0645 \u0627\u0644\u0641\u0646\u0651\u064A \u0645\u062D\u0645\u062F")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => setRating(i),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 2,
      color: i <= rating ? 'var(--violet)' : 'var(--ink-40)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Star",
    size: 26
  })))), /*#__PURE__*/React.createElement("textarea", {
    placeholder: "\u0627\u0643\u062A\u0628 \u062A\u0639\u0644\u064A\u0642\u064B\u0627 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)\u2026",
    rows: "3",
    style: {
      font: 'inherit',
      fontSize: 14,
      fontFamily: 'var(--font-arabic)',
      padding: '11px 14px',
      borderRadius: 14,
      border: '1.5px solid var(--border-strong)',
      background: 'var(--white)',
      resize: 'none',
      outline: 'none'
    }
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "\u0625\u0631\u0641\u0627\u0642 \u0635\u0648\u0631 \u0627\u0644\u0641\u0646\u0651\u064A \u0645\u0639 \u0627\u0644\u062A\u0642\u064A\u064A\u0645",
    checked: useTech,
    onChange: e => setUseTech(e.target.checked)
  }), /*#__PURE__*/React.createElement("image-slot", {
    id: "rating-photo",
    shape: "rounded",
    radius: "14",
    placeholder: "\u0623\u0648 \u0627\u0631\u0641\u0639 \u0635\u0648\u0631\u0629 \u0645\u0646 \u0639\u0646\u062F\u0643",
    style: {
      width: '100%',
      height: 96
    }
  }), /*#__PURE__*/React.createElement(Button, {
    disabled: !rating,
    style: {
      opacity: rating ? 1 : 0.45
    },
    onClick: () => rating && setSent(true)
  }, "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062A\u0642\u064A\u064A\u0645"))), stage < 3 ? /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: advance
  }, "\u0645\u062D\u0627\u0643\u0627\u0629 \u0627\u0644\u062E\u0637\u0648\u0629 \u0627\u0644\u062A\u0627\u0644\u064A\u0629") : /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: advance
  }, "\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0639\u0631\u0636")) : empty('لا غسلة نشطة الآن')), tab === 'السابقة' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, BK_HISTORY.map(h => /*#__PURE__*/React.createElement(Card, {
    key: h.date,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: "verified",
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14.5,
      fontWeight: 700
    }
  }, h.service), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, h.date, " \xB7 ", /*#__PURE__*/React.createElement(T, null, h.slot))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 13,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Star",
    size: 14
  }), " ", h.rated)))));
}
Object.assign(window, {
  BookingsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app-ar/BookingsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app-ar/ClubFlow.jsx
try { (() => {
const PLANS = [{
  id: 'basic',
  name: 'أساسي',
  price: 149,
  credits: 4,
  weekly: 1,
  roll: 1,
  renews: '10 سبتمبر'
}, {
  id: 'plus',
  name: 'بلس',
  price: 199,
  credits: 8,
  weekly: 2,
  roll: 2,
  renews: '10 سبتمبر',
  best: true
}];
function ClubFlow({
  club,
  onActivated,
  onBook,
  onClose,
  initialStep,
  frozen
}) {
  const {
    Button,
    Card,
    Badge,
    Checkbox,
    Select,
    BeatIcon
  } = window.BubblesDesignSystem_9de8ef;
  const [step, setStep] = React.useState(initialStep || (club ? 'dash' : 'plans'));
  const [plan, setPlan] = React.useState(club || PLANS[1]);
  const [consent, setConsent] = React.useState(false);
  React.useEffect(() => {
    if (frozen) return;
    if (step === 'processing') {
      const t = setTimeout(() => {
        onActivated(plan);
        setStep('dash');
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [step]);
  const back = () => step === 'plans' || step === 'dash' ? onClose() : setStep('plans');
  const wrap = {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: '6px 20px 24px'
  };
  if (step === 'processing') return /*#__PURE__*/React.createElement(Processing, {
    title: "\u0646\u0641\u0639\u0651\u0644 \u0627\u0634\u062A\u0631\u0627\u0643\u0643\u2026",
    sub: "\u0646\u0624\u0643\u062F \u062A\u0641\u0648\u064A\u0636 \u0627\u0644\u062F\u0641\u0639 \u0627\u0644\u0645\u062A\u0643\u0631\u0631 \u0645\u0639 \u0627\u0644\u0628\u0646\u0643."
  });
  if (step === 'dash') return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FlowHeader, {
    title: "\u0646\u0627\u062F\u064A \u0633\u0645\u0627",
    onBack: onClose
  }), /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "dark",
    style: {
      padding: 22,
      display: 'flex',
      flexDirection: 'column',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: 'var(--yellow)'
    }
  }, "\u0646\u0627\u062F\u064A \u0633\u0645\u0627 \xB7 ", plan.name), /*#__PURE__*/React.createElement(BeatIcon, {
    size: "sm"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-inverse-soft)'
    }
  }, "\u0639\u0636\u0648"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 700
    }
  }, "\u0641\u064A\u0635\u0644 \u0627\u0644\u0639. ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400,
      color: 'var(--text-inverse-soft)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "\xB7 N\xBA 10100"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-inverse-soft)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "\u0627\u0644\u062A\u062C\u062F\u064A\u062F ", plan.renews, " \xB7 ", plan.price, " \u0631.\u0633/\u0634\u0647\u0631"), /*#__PURE__*/React.createElement(Badge, {
    tone: "yellow"
  }, plan.credits, " \u063A\u0633\u0644\u0627\u062A \u0645\u062A\u0627\u062D\u0629"))), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    style: {
      margin: 0
    }
  }, "\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0647\u0630\u0627 \u0627\u0644\u0623\u0633\u0628\u0648\u0639"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 10,
      borderRadius: 999,
      background: 'var(--surface-booking-soft)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '0%',
      height: '100%',
      background: 'var(--violet)',
      borderRadius: 999
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      fontVariantNumeric: 'tabular-nums'
    }
  }, "0 \u0645\u0646 ", plan.weekly)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement(LRow, {
    label: "\u0631\u0635\u064A\u062F \u0627\u0644\u062F\u0648\u0631\u0629 \u0627\u0644\u062D\u0627\u0644\u064A\u0629",
    amount: plan.credits + ' غسلات'
  }), /*#__PURE__*/React.createElement(LRow, {
    label: "\u0631\u0635\u064A\u062F \u0645\u0631\u062D\u064E\u0651\u0644",
    amount: "0",
    muted: true
  }), /*#__PURE__*/React.createElement(LRow, {
    label: "\u0627\u0644\u0645\u0648\u0639\u062F \u0627\u0644\u0645\u0641\u0636\u0651\u0644",
    amount: "\u0627\u0644\u062B\u0644\u0627\u062B\u0627\u0621 10:00",
    muted: true
  }))), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: onBook
  }, "\u0627\u062D\u062C\u0632 \u063A\u0633\u0644\u0629"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643")));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FlowHeader, {
    title: step === 'plans' ? 'نادي سما' : 'المراجعة والتفعيل',
    onBack: back
  }), step === 'plans' && /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-secondary)'
    }
  }, "\u0627\u0634\u062A\u0631\u0627\u0643 \u0634\u0647\u0631\u064A \u0645\u062A\u062C\u062F\u062F \u2014 \u0631\u0635\u064A\u062F \u063A\u0633\u0644\u0627\u062A \u0643\u0644 \u062F\u0648\u0631\u0629\u060C \u0648\u0623\u0648\u0644\u0648\u064A\u0629 \u0628\u0645\u0648\u0627\u0639\u064A\u062F 10:00."), PLANS.map(p => /*#__PURE__*/React.createElement(Card, {
    key: p.id,
    onClick: () => setPlan(p),
    style: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      boxShadow: plan.id === p.id ? '0 0 0 2px var(--violet)' : undefined
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 700
    }
  }, p.name, " ", p.best && /*#__PURE__*/React.createElement(Badge, {
    tone: "yellow",
    style: {
      marginInlineStart: 4
    }
  }, "\u0627\u0644\u0623\u0634\u0647\u0631")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 700,
      fontVariantNumeric: 'tabular-nums'
    }
  }, p.price, " \u0631.\u0633", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      color: 'var(--text-muted)'
    }
  }, "/\u0634\u0647\u0631"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontSize: 13.5,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("span", null, p.credits, " \u063A\u0633\u0644\u0627\u062A \u0641\u064A \u0643\u0644 \u062F\u0648\u0631\u0629"), /*#__PURE__*/React.createElement("span", null, "\u062D\u062A\u0649 ", p.weekly === 1 ? 'غسلة واحدة' : 'غسلتين', " \u0623\u0633\u0628\u0648\u0639\u064A\u064B\u0627"), /*#__PURE__*/React.createElement("span", null, "\u062A\u0631\u062D\u064A\u0644 \u062D\u062A\u0649 ", p.roll === 1 ? 'غسلة واحدة' : 'غسلتين', " \u0644\u062F\u0648\u0631\u0629 \u0648\u0627\u062D\u062F\u0629 \u0641\u0642\u0637")))), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => setStep('review')
  }, "\u0645\u062A\u0627\u0628\u0639\u0629 \u2014 ", plan.name)), step === 'review' && /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(LRow, {
    label: "\u0627\u0644\u0641\u0648\u062A\u0631\u0629",
    amount: plan.price + ' ر.س / شهر'
  }), /*#__PURE__*/React.createElement(LRow, {
    label: "\u0631\u0635\u064A\u062F \u0627\u0644\u062F\u0648\u0631\u0629",
    amount: plan.credits + ' غسلات'
  }), /*#__PURE__*/React.createElement(LRow, {
    label: "\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0633\u0628\u0648\u0639\u064A",
    amount: plan.weekly === 1 ? 'غسلة واحدة' : 'غسلتان'
  }), /*#__PURE__*/React.createElement(LRow, {
    label: "\u0627\u0644\u062A\u0631\u062D\u064A\u0644",
    amount: 'حتى ' + (plan.roll === 1 ? 'غسلة' : 'غسلتين') + ' لدورة واحدة',
    muted: true
  }), /*#__PURE__*/React.createElement(LRow, {
    label: "\u0627\u0644\u0633\u064A\u0627\u0631\u0629",
    amount: "\u0644\u0643\u0632\u0633 LX \u2014 \u0623\u0628\u064A\u0636",
    muted: true
  }), /*#__PURE__*/React.createElement(LRow, {
    label: "\u0627\u0644\u0628\u0637\u0627\u0642\u0629",
    amount: "\u0645\u062F\u0649 \u2022\u2022\u2022\u2022 6011",
    muted: true
  })), /*#__PURE__*/React.createElement(Select, {
    label: "\u0627\u0644\u0645\u0648\u0639\u062F \u0627\u0644\u0645\u0641\u0636\u0651\u0644 \u0627\u0644\u0623\u0633\u0628\u0648\u0639\u064A (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)",
    defaultValue: "\u0627\u0644\u062B\u0644\u0627\u062B\u0627\u0621 10:00\u201310:30"
  }, /*#__PURE__*/React.createElement("option", null, "\u0627\u0644\u062B\u0644\u0627\u062B\u0627\u0621 10:00\u201310:30"), /*#__PURE__*/React.createElement("option", null, "\u0627\u0644\u0633\u0628\u062A 09:00\u201309:30"), /*#__PURE__*/React.createElement("option", null, "\u0628\u062F\u0648\u0646 \u0645\u0648\u0639\u062F \u0645\u0641\u0636\u0651\u0644")), /*#__PURE__*/React.createElement(Card, {
    style: {
      background: 'var(--surface-booking-soft)'
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "\u0623\u0648\u0627\u0641\u0642 \u0639\u0644\u0649 \u062A\u062C\u062F\u064A\u062F \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643 \u062A\u0644\u0642\u0627\u0626\u064A\u064B\u0627 \u0643\u0644 \u0634\u0647\u0631 \u062D\u062A\u0649 \u0627\u0644\u0625\u0644\u063A\u0627\u0621\u060C \u0648\u062E\u0635\u0645 \u0627\u0644\u0645\u0628\u0644\u063A \u0645\u0646 \u0628\u0637\u0627\u0642\u062A\u064A \u0627\u0644\u0645\u062D\u0641\u0648\u0638\u0629.",
    checked: consent,
    onChange: e => setConsent(e.target.checked)
  })), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    disabled: !consent,
    style: {
      opacity: consent ? 1 : 0.45
    },
    onClick: () => consent && setStep('processing')
  }, "\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643 \u2014 ", plan.price, " \u0631.\u0633")));
}
Object.assign(window, {
  ClubFlow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app-ar/ClubFlow.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app-ar/HomeScreenAr.jsx
try { (() => {
function HomeScreenAr({
  wallet,
  club,
  upcoming,
  open,
  go
}) {
  const {
    Button,
    Card,
    Badge,
    Tag,
    BookingTicket,
    BeatIcon
  } = window.BubblesDesignSystem_9de8ef;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      padding: '18px 20px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {},
    style: {
      font: 'inherit',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      background: 'var(--white)',
      border: '1.5px solid var(--border-subtle)',
      borderRadius: 999,
      padding: '7px 13px',
      fontSize: 12.5,
      fontWeight: 700,
      cursor: 'pointer',
      color: 'var(--text-primary)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "MapPin",
    size: 14
  }), " \u0627\u0644\u0645\u0646\u0632\u0644 \xB7 \u062D\u064A \u0627\u0644\u0646\u062E\u064A\u0644 ", /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronDown",
    size: 13
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: 38,
      height: 38,
      borderRadius: '50%',
      background: 'var(--white)',
      border: '1.5px solid var(--border-subtle)',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--ink-72)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Bell",
    size: 17
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 700
    }
  }, "\u0635\u0628\u0627\u062D \u0627\u0644\u0646\u0648\u0631 \u064A\u0627 \u0641\u064A\u0635\u0644"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14.5,
      color: 'var(--text-secondary)',
      marginTop: 2
    }
  }, "\u0644\u0645\u0639\u0629 \u0641\u064A \u0648\u0642\u062A\u0647\u0627.")), upcoming && /*#__PURE__*/React.createElement("div", {
    onClick: () => go('bookings'),
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(BookingTicket, {
    label: "\u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u062D\u062C\u0632",
    time: upcoming.slot,
    meta: upcoming.day + ' · ' + upcoming.service,
    stub: /*#__PURE__*/React.createElement(BeatIcon, {
      size: "sm",
      active: 0
    })
  })), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => open('single')
  }, "\u0627\u062D\u062C\u0632 \u063A\u0633\u0644\u0629"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "\u0627\u062E\u062A\u0631 \u0645\u0627 \u064A\u0646\u0627\u0633\u0628\u0643"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Card, {
    onClick: () => open('single'),
    style: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 13,
      background: 'var(--surface-booking-soft)',
      color: 'var(--violet)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Droplets",
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700
    }
  }, "\u063A\u0633\u0644\u0629 \u0648\u0627\u062D\u062F\u0629"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, "\u0627\u0644\u0623\u0633\u0631\u0639 \u2014 \u0644\u0645\u0648\u0639\u062F \u0648\u0627\u062D\u062F \u064A\u0646\u0627\u0633\u0628\u0643")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 700,
      fontVariantNumeric: 'tabular-nums'
    }
  }, "\u0645\u0646 49 \u0631.\u0633"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--text-muted)'
    }
  }, "\u2248 45 \u062F\u0642\u064A\u0642\u0629")))), /*#__PURE__*/React.createElement(Card, {
    onClick: () => open('packages'),
    style: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 13,
      background: 'var(--yellow-100)',
      color: 'var(--ink)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Layers",
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700
    }
  }, "\u0627\u0644\u0628\u0627\u0642\u0627\u062A \u0627\u0644\u0645\u062F\u0641\u0648\u0639\u0629"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, wallet.credits > 0 ? /*#__PURE__*/React.createElement("span", null, "\u0631\u0635\u064A\u062F\u0643: ", /*#__PURE__*/React.createElement("b", null, wallet.credits, " \u0645\u0646 ", wallet.total, " \u063A\u0633\u0644\u0627\u062A"), " \xB7 \u062A\u0646\u062A\u0647\u064A ", wallet.expiry) : 'وفّر حتى 18% — رصيد غسلات بصلاحية 90 يومًا')), wallet.credits > 0 ? /*#__PURE__*/React.createElement(Badge, {
    tone: "yellow"
  }, wallet.credits, " \u0645\u062A\u0628\u0642\u064A\u0629") : /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronLeft",
    size: 18
  }))), /*#__PURE__*/React.createElement(Card, {
    variant: "dark",
    onClick: () => open('club'),
    style: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(BeatIcon, {
    size: "md"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15.5,
      fontWeight: 700
    }
  }, "\u0646\u0627\u062F\u064A \u0633\u0645\u0627"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-inverse-soft)'
    }
  }, club ? club.name + ' · التجديد ' + club.renews : 'اشتراك شهري — وأولوية بمواعيد 10:00')), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary"
  }, club ? 'لوحتي' : 'انضم')))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, [['Clock', 'في الموعد دائمًا'], ['ShieldCheck', 'إتمام موثّق بصورة'], ['MessageSquare', 'دعم سريع']].map(([ic, t]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      padding: '12px 6px',
      borderRadius: 16,
      background: 'var(--white)',
      border: '1.5px solid var(--border-subtle)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--violet)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      fontWeight: 600,
      color: 'var(--text-secondary)'
    }
  }, t)))));
}
Object.assign(window, {
  HomeScreenAr
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app-ar/HomeScreenAr.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app-ar/OnboardingFlow.jsx
try { (() => {
function OnboardingFlow({
  onDone,
  initialStep
}) {
  const {
    Button,
    Card,
    Input,
    Tag,
    Badge
  } = window.BubblesDesignSystem_9de8ef;
  const [step, setStep] = React.useState(initialStep || 'welcome');
  const [lang, setLang] = React.useState('ar');
  const [addrLabel, setAddrLabel] = React.useState('المنزل');
  const next = {
    welcome: 'phone',
    phone: 'otp',
    otp: 'permission',
    permission: 'map',
    map: 'address'
  };
  const go = () => step === 'address' ? onDone() : setStep(next[step]);
  const wrap = {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    padding: '24px 24px 28px',
    minHeight: '92vh',
    boxSizing: 'border-box'
  };
  if (step === 'welcome') return /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      gap: 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/bubbles-illustration.svg",
    style: {
      width: 150,
      marginBottom: 28
    },
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 36,
      fontWeight: 800,
      color: 'var(--violet)',
      marginBottom: 14,
      letterSpacing: '-0.5px'
    }
  }, "\u0633\u0645\u0627 ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-muted)'
    }
  }, "Sama Car Wash")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 27,
      fontWeight: 700
    }
  }, "\u0644\u0645\u0639\u0629 \u0641\u064A \u0648\u0642\u062A\u0647\u0627"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      color: 'var(--text-secondary)',
      marginTop: 8,
      maxWidth: 280
    }
  }, "\u063A\u0633\u064A\u0644 \u0633\u064A\u0627\u0631\u062A\u0643 \u0639\u0646\u062F \u0628\u0627\u0628\u0643 \u2014 \u0627\u062D\u062C\u0632 \u0645\u0648\u0639\u062F\u0643\u060C \u0648\u062A\u0627\u0628\u0639 \u0643\u0644 \u062E\u0637\u0648\u0629 \u062D\u062A\u0649 \u062A\u0644\u0645\u0639 \u0633\u064A\u0627\u0631\u062A\u0643."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      margin: '26px 0 18px'
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    selected: lang === 'ar',
    onClick: () => setLang('ar')
  }, "\u0627\u0644\u0639\u0631\u0628\u064A\u0629"), /*#__PURE__*/React.createElement(Tag, {
    selected: lang === 'en',
    onClick: () => setLang('en')
  }, /*#__PURE__*/React.createElement("span", {
    dir: "ltr"
  }, "English"))), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    style: {
      width: '100%'
    },
    onClick: go
  }, "\u0627\u0628\u062F\u0623 \u0627\u0644\u0622\u0646"), /*#__PURE__*/React.createElement("button", {
    onClick: onDone,
    style: {
      font: 'inherit',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-muted)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      marginTop: 14
    }
  }, "\u062A\u062E\u0637\u064A \u0625\u0644\u0649 \u0627\u0644\u062A\u0637\u0628\u064A\u0642"));
  if (step === 'phone') return /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/bubbles-mark.svg",
    style: {
      height: 22,
      alignSelf: 'flex-start'
    },
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      fontWeight: 700
    }
  }, "\u0633\u062C\u0651\u0644 \u062F\u062E\u0648\u0644\u0643 \u0628\u0631\u0642\u0645 \u062C\u0648\u0627\u0644\u0643"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--text-secondary)',
      marginTop: 6
    }
  }, "\u0633\u0646\u0631\u0633\u0644 \u0644\u0643 \u0631\u0645\u0632 \u062A\u062D\u0642\u0642 \u0639\u0628\u0631 \u0631\u0633\u0627\u0644\u0629 \u0646\u0635\u064A\u0629.")), /*#__PURE__*/React.createElement("div", {
    dir: "ltr",
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '0 14px',
      borderRadius: 14,
      border: '1.5px solid var(--border-strong)',
      background: 'var(--white)',
      fontSize: 15,
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums'
    }
  }, "+966"), /*#__PURE__*/React.createElement(Input, {
    placeholder: "5X XXX XXXX",
    defaultValue: "55 123 4567",
    style: {
      flex: 1
    },
    inputMode: "tel"
  })), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: go
  }, "\u0625\u0631\u0633\u0627\u0644 \u0631\u0645\u0632 \u0627\u0644\u062A\u062D\u0642\u0642"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-muted)'
    }
  }, "\u0628\u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629 \u0623\u0646\u062A \u062A\u0648\u0627\u0641\u0642 \u0639\u0644\u0649 \u0627\u0644\u0634\u0631\u0648\u0637 \u0648\u0633\u064A\u0627\u0633\u0629 \u0627\u0644\u062E\u0635\u0648\u0635\u064A\u0629."));
  if (step === 'otp') return /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/bubbles-mark.svg",
    style: {
      height: 22,
      alignSelf: 'flex-start'
    },
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      fontWeight: 700
    }
  }, "\u0623\u062F\u062E\u0644 \u0631\u0645\u0632 \u0627\u0644\u062A\u062D\u0642\u0642"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--text-secondary)',
      marginTop: 6
    }
  }, "\u0623\u0631\u0633\u0644\u0646\u0627 \u0627\u0644\u0631\u0645\u0632 \u0625\u0644\u0649 ", /*#__PURE__*/React.createElement(T, {
    style: {
      fontWeight: 600
    }
  }, "+966 55 123 4567"))), /*#__PURE__*/React.createElement("div", {
    dir: "ltr",
    style: {
      display: 'flex',
      gap: 10,
      justifyContent: 'center',
      margin: '8px 0'
    }
  }, ['4', '8', '2', '1'].map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 56,
      height: 62,
      borderRadius: 16,
      background: 'var(--white)',
      border: '1.5px solid var(--violet)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 24,
      fontWeight: 700,
      fontVariantNumeric: 'tabular-nums'
    }
  }, d))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)',
      textAlign: 'center'
    }
  }, "\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0625\u0631\u0633\u0627\u0644 \u062E\u0644\u0627\u0644 ", /*#__PURE__*/React.createElement(T, null, "00:24")), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: go
  }, "\u062A\u062D\u0642\u0642"));
  if (step === 'permission') return /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 84,
      height: 84,
      borderRadius: '50%',
      background: 'var(--violet-100)',
      color: 'var(--violet)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "MapPin",
    size: 38
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      fontWeight: 700
    }
  }, "\u0623\u064A\u0646 \u0633\u064A\u0627\u0631\u062A\u0643\u061F"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14.5,
      color: 'var(--text-secondary)',
      maxWidth: 280
    }
  }, "\u0646\u0633\u062A\u062E\u062F\u0645 \u0645\u0648\u0642\u0639\u0643 \u0644\u0646\u0639\u0631\u0636 \u0644\u0643 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0648\u0627\u0644\u0645\u0648\u0627\u0639\u064A\u062F \u0627\u0644\u0645\u062A\u0627\u062D\u0629 \u0641\u0639\u0644\u064B\u0627 \u0641\u064A \u0645\u0646\u0637\u0642\u062A\u0643 \u2014 \u0642\u0628\u0644 \u0623\u064A \u0627\u0644\u062A\u0632\u0627\u0645."), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    style: {
      width: '100%'
    },
    onClick: go
  }, "\u0627\u0644\u0633\u0645\u0627\u062D \u0628\u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0645\u0648\u0642\u0639"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: go
  }, "\u0625\u062F\u062E\u0627\u0644 \u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u064A\u062F\u0648\u064A\u064B\u0627"));
  if (step === 'map') return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '92vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: 1,
      minHeight: 380,
      background: 'var(--ice-100)',
      backgroundImage: 'linear-gradient(var(--ice) 1px, transparent 1px), linear-gradient(90deg, var(--ice) 1px, transparent 1px)',
      backgroundSize: '44px 44px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 18,
      insetInlineStart: 20,
      insetInlineEnd: 20
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "\u0627\u0628\u062D\u062B \u0639\u0646 \u062D\u064A \u0623\u0648 \u0634\u0627\u0631\u0639\u2026",
    style: {
      width: '100%',
      boxSizing: 'border-box'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '48%',
      insetInlineStart: '50%',
      transform: 'translate(50%,-100%)',
      color: 'var(--violet)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "MapPin",
    size: 44
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 14,
      insetInlineStart: 20,
      fontSize: 11.5,
      fontWeight: 600,
      color: 'var(--text-muted)'
    }
  }, "\u062E\u0631\u064A\u0637\u0629 \u062A\u0648\u0636\u064A\u062D\u064A\u0629")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 24px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "MapPin",
    size: 18
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15.5,
      fontWeight: 700
    }
  }, "\u0641\u064A\u0644\u0627 12\u060C \u0634\u0627\u0631\u0639 \u0627\u0644\u064A\u0627\u0633\u0645\u064A\u0646"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, "\u062D\u064A \u0627\u0644\u0646\u062E\u064A\u0644\u060C \u0627\u0644\u0631\u064A\u0627\u0636")), /*#__PURE__*/React.createElement(Badge, null, "\u0627\u0644\u062E\u062F\u0645\u0629 \u0645\u062A\u0627\u062D\u0629 \u0647\u0646\u0627")), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: go
  }, "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0645\u0648\u0642\u0639")));
  return /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      fontWeight: 700
    }
  }, "\u0627\u062D\u0641\u0638 \u0639\u0646\u0648\u0627\u0646\u0643"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--text-secondary)',
      marginTop: 6
    }
  }, "\u0641\u064A\u0644\u0627 12\u060C \u0634\u0627\u0631\u0639 \u0627\u0644\u064A\u0627\u0633\u0645\u064A\u0646\u060C \u062D\u064A \u0627\u0644\u0646\u062E\u064A\u0644 \u2014 \u0627\u0644\u0631\u064A\u0627\u0636")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "\u062A\u0633\u0645\u064A\u0629 \u0627\u0644\u0639\u0646\u0648\u0627\u0646"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, ['المنزل', 'العمل', 'آخر'].map(l => /*#__PURE__*/React.createElement(Tag, {
    key: l,
    selected: addrLabel === l,
    onClick: () => setAddrLabel(l)
  }, l)))), /*#__PURE__*/React.createElement(Input, {
    label: "\u0645\u0644\u0627\u062D\u0638\u0627\u062A \u0644\u0644\u0648\u0635\u0648\u0644 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)",
    placeholder: "\u0627\u0644\u0628\u0648\u0627\u0628\u0629 \u0627\u0644\u0632\u0631\u0642\u0627\u0621\u060C \u0628\u062C\u0648\u0627\u0631 \u0627\u0644\u0645\u0633\u062C\u062F"
  }), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: go
  }, "\u062D\u0641\u0638 \u0648\u0645\u062A\u0627\u0628\u0639\u0629"));
}
Object.assign(window, {
  OnboardingFlow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app-ar/OnboardingFlow.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app-ar/PackagesFlow.jsx
try { (() => {
const PKGS = [{
  id: 3,
  washes: 3,
  price: 139,
  per: 46,
  save: '5%',
  expiry: '8 نوفمبر 2026'
}, {
  id: 5,
  washes: 5,
  price: 219,
  per: 44,
  save: '12%',
  best: true,
  expiry: '8 نوفمبر 2026'
}, {
  id: 10,
  washes: 10,
  price: 399,
  per: 40,
  save: '18%',
  expiry: '8 نوفمبر 2026'
}];
function PackagesFlow({
  onPurchased,
  onBook,
  onClose,
  initialStep,
  frozen
}) {
  const {
    Button,
    Card,
    Badge,
    BookingTicket
  } = window.BubblesDesignSystem_9de8ef;
  const [step, setStep] = React.useState(initialStep || 'list');
  const [pkg, setPkg] = React.useState(PKGS[1]);
  const [method, setMethod] = React.useState('mada');
  React.useEffect(() => {
    if (frozen) return;
    if (step === 'processing') {
      const t = setTimeout(() => {
        onPurchased(pkg);
        setStep('done');
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [step]);
  const back = () => step === 'list' ? onClose() : setStep(step === 'details' ? 'list' : 'details');
  const wrap = {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: '6px 20px 24px'
  };
  if (step === 'processing') return /*#__PURE__*/React.createElement(Processing, {
    title: "\u0646\u0639\u0627\u0644\u062C \u0627\u0644\u062F\u0641\u0639 \u0628\u0623\u0645\u0627\u0646\u2026",
    sub: "\u0644\u0627 \u062A\u063A\u0644\u0642 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u2014 \u0644\u0646 \u064A\u064F\u062E\u0635\u0645 \u0627\u0644\u0645\u0628\u0644\u063A \u0645\u0631\u062A\u064A\u0646."
  });
  if (step === 'done') return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      padding: '64px 24px 24px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 92,
      height: 92,
      borderRadius: '50%',
      background: 'var(--yellow)',
      color: 'var(--ink)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Check",
    size: 44
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      fontWeight: 700
    }
  }, "\u0623\u064F\u0636\u064A\u0641\u062A ", pkg.washes, " \u063A\u0633\u0644\u0627\u062A \u0625\u0644\u0649 \u0631\u0635\u064A\u062F\u0643"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--text-secondary)'
    }
  }, "\u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629 \u062D\u062A\u0649 ", pkg.expiry, " \u2014 \u064A\u064F\u062E\u0635\u0645 \u0627\u0644\u0631\u0635\u064A\u062F \u0639\u0646\u062F \u062A\u0623\u0643\u064A\u062F \u0643\u0644 \u062D\u062C\u0632."), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    style: {
      width: '100%'
    },
    onClick: onBook
  }, "\u0627\u062D\u062C\u0632 \u0627\u0644\u0622\u0646"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onClose
  }, "\u0644\u0627\u062D\u0642\u064B\u0627"));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FlowHeader, {
    title: step === 'list' ? 'الباقات المدفوعة' : step === 'details' ? 'باقة ' + pkg.washes + ' غسلات' : 'الدفع',
    onBack: back
  }), step === 'list' && /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-secondary)'
    }
  }, "\u0631\u0635\u064A\u062F \u063A\u0633\u0644\u0627\u062A \u0645\u0633\u0628\u0642 \u0627\u0644\u062F\u0641\u0639 \u2014 \u0633\u0639\u0631 \u0623\u0642\u0644 \u0644\u0644\u063A\u0633\u0644\u0629\u060C \u0648\u0635\u0644\u0627\u062D\u064A\u0629 90 \u064A\u0648\u0645\u064B\u0627."), PKGS.map(p => /*#__PURE__*/React.createElement(Card, {
    key: p.id,
    onClick: () => {
      setPkg(p);
      setStep('details');
    },
    style: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      boxShadow: p.best ? '0 0 0 2px var(--violet)' : undefined
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 52,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 700,
      fontVariantNumeric: 'tabular-nums',
      lineHeight: 1
    }
  }, p.washes), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--text-muted)'
    }
  }, "\u063A\u0633\u0644\u0627\u062A")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      fontVariantNumeric: 'tabular-nums'
    }
  }, p.price, " \u0631.\u0633 ", p.best && /*#__PURE__*/React.createElement(Badge, {
    tone: "yellow",
    style: {
      marginInlineStart: 4
    }
  }, "\u0627\u0644\u0623\u0643\u062B\u0631 \u062A\u0648\u0641\u064A\u0631\u064B\u0627")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, p.per, " \u0631.\u0633 \u0644\u0644\u063A\u0633\u0644\u0629 \xB7 \u062A\u0648\u0641\u064A\u0631 ", p.save, " \xB7 \u0635\u0644\u0627\u062D\u064A\u0629 90 \u064A\u0648\u0645\u064B\u0627")), /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronLeft",
    size: 18
  })))), step === 'details' && /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 22,
      background: 'var(--surface-booking)',
      padding: '20px',
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 21,
      fontWeight: 700
    }
  }, pkg.washes, " \u063A\u0633\u0644\u0627\u062A \u062E\u0627\u0631\u062C\u064A\u0629"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-72)'
    }
  }, pkg.per, " \u0631.\u0633 \u0644\u0644\u063A\u0633\u0644\u0629 \u2014 \u062A\u0648\u0641\u064A\u0631 ", pkg.save)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      fontWeight: 700,
      fontVariantNumeric: 'tabular-nums'
    }
  }, pkg.price, " \u0631.\u0633")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "\u0642\u0648\u0627\u0639\u062F \u0627\u0644\u0628\u0627\u0642\u0629"), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 11
    }
  }, ['الصلاحية 90 يومًا من تاريخ الشراء', 'تصلح للغسلة الخارجية الكاملة', 'لسيارة واحدة مسجلة في حسابك', 'الإضافات تُدفع على حدة عند الحجز', 'يعود الرصيد عند الإلغاء قبل الموعد بـ 12 ساعة'].map(x => /*#__PURE__*/React.createElement("div", {
    key: x,
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: 'var(--violet-100)',
      color: 'var(--violet)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none',
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Check",
    size: 11
  })), x)))), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => setStep('pay')
  }, "\u0634\u0631\u0627\u0621 \u0627\u0644\u0628\u0627\u0642\u0629 \u2014 ", pkg.price, " \u0631.\u0633")), step === 'pay' && /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    style: {
      margin: 0
    }
  }, "\u0627\u062E\u062A\u0631 \u0648\u0633\u064A\u0644\u0629 \u0627\u0644\u062F\u0641\u0639"), /*#__PURE__*/React.createElement(PayMethods, {
    selected: method,
    onSelect: setMethod
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(LRow, {
    label: 'باقة ' + pkg.washes + ' غسلات',
    amount: pkg.price + ' ر.س'
  }), /*#__PURE__*/React.createElement(LRow, {
    label: "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A \u0634\u0627\u0645\u0644 \u0627\u0644\u0636\u0631\u064A\u0628\u0629",
    amount: pkg.price + ' ر.س',
    strong: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-muted)',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ShieldCheck",
    size: 14
  }), " \u064A\u064F\u0636\u0627\u0641 \u0627\u0644\u0631\u0635\u064A\u062F \u0628\u0639\u062F \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062F\u0641\u0639 \u0645\u0628\u0627\u0634\u0631\u0629."), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => setStep('processing')
  }, "\u0627\u062F\u0641\u0639 ", pkg.price, " \u0631.\u0633")));
}
Object.assign(window, {
  PackagesFlow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app-ar/PackagesFlow.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app-ar/ProfileScreen.jsx
try { (() => {
function ProfileScreen({
  wallet,
  club,
  open
}) {
  const {
    Button,
    Card,
    Badge,
    BeatIcon
  } = window.BubblesDesignSystem_9de8ef;
  const ROWS = [['Car', 'سياراتي', 'لكزس LX — أبيض'], ['MapPin', 'عناويني', 'المنزل · العمل'], ['CreditCard', 'بطاقات الدفع', 'مدى •••• 6011'], ['Receipt', 'الإيصالات والفواتير', ''], ['Globe', 'اللغة', 'العربية'], ['Bell', 'الإشعارات', 'مفعّلة'], ['MessageSquare', 'المساعدة والدعم', ''], ['FileText', 'الشروط والخصوصية', '']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      padding: '18px 20px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 54,
      height: 54,
      borderRadius: '50%',
      background: 'var(--violet-100)',
      color: 'var(--violet)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 18,
      fontWeight: 700
    }
  }, "\u0641"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 700
    }
  }, "\u0641\u064A\u0635\u0644 \u0627\u0644\u0639\u062A\u064A\u0628\u064A"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement(T, null, "+966 55 123 4567"), " \xB7 \u0645\u0648\u062B\u0651\u0642"))), (wallet.credits > 0 || club) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, wallet.credits > 0 && /*#__PURE__*/React.createElement(Card, {
    onClick: () => open('packages'),
    style: {
      flex: 1,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      fontWeight: 700,
      color: 'var(--text-muted)'
    }
  }, "\u0631\u0635\u064A\u062F \u0627\u0644\u0628\u0627\u0642\u0629"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 21,
      fontWeight: 700,
      fontVariantNumeric: 'tabular-nums'
    }
  }, wallet.credits, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      color: 'var(--text-muted)'
    }
  }, "\u0645\u0646 ", wallet.total)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: 'var(--text-muted)'
    }
  }, "\u062A\u0646\u062A\u0647\u064A ", wallet.expiry)), club && /*#__PURE__*/React.createElement(Card, {
    variant: "dark",
    onClick: () => open('club'),
    style: {
      flex: 1,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      fontWeight: 700,
      color: 'var(--yellow)'
    }
  }, "\u0646\u0627\u062F\u064A \u0633\u0645\u0627 \xB7 ", club.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 21,
      fontWeight: 700,
      fontVariantNumeric: 'tabular-nums'
    }
  }, club.credits, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      color: 'var(--text-inverse-soft)'
    }
  }, "\u063A\u0633\u0644\u0627\u062A")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: 'var(--text-inverse-soft)'
    }
  }, "\u0627\u0644\u062A\u062C\u062F\u064A\u062F ", club.renews))), /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: '6px 16px',
      display: 'flex',
      flexDirection: 'column'
    }
  }, ROWS.map(([ic, t, sub], i) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '13px 0',
      borderTop: i ? '1px solid var(--border-subtle)' : 'none',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-72)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 14.5,
      fontWeight: 600
    }
  }, t), sub && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-muted)'
    }
  }, sub), /*#__PURE__*/React.createElement(Icon, {
    name: "ChevronLeft",
    size: 16
  })))), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontSize: 11.5,
      color: 'var(--text-muted)'
    }
  }, "Sama Car Wash \xB7 \u0627\u0644\u0625\u0635\u062F\u0627\u0631 1.0 \xB7 \u0644\u0645\u0639\u0629 \u0641\u064A \u0648\u0642\u062A\u0647\u0627"));
}
Object.assign(window, {
  ProfileScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app-ar/ProfileScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app-ar/SingleVisitFlow.jsx
try { (() => {
const SV_SLOTS = ['08:00–08:30', '08:30–09:00', '09:00–09:30', '10:30–11:00', '11:00–11:30', '16:00–16:30'];
const SV_DAYS = ['اليوم الاثنين', 'غدًا الثلاثاء', 'الأربعاء 12', 'الخميس 13'];
function SingleVisitFlow({
  wallet,
  onConfirm,
  onClose,
  initialStep,
  frozen
}) {
  const {
    Button,
    Card,
    Tag,
    Badge,
    Checkbox,
    Switch,
    Input,
    BookingTicket,
    BeatIcon
  } = window.BubblesDesignSystem_9de8ef;
  const [step, setStep] = React.useState(initialStep != null ? initialStep : 0);
  const [day, setDay] = React.useState(SV_DAYS[1]);
  const [slot, setSlot] = React.useState('10:30–11:00');
  const [wax, setWax] = React.useState(false);
  const [tire, setTire] = React.useState(false);
  const [promo, setPromo] = React.useState(false);
  const [useCredit, setUseCredit] = React.useState(wallet.credits > 0);
  const [method, setMethod] = React.useState('mada');
  const extras = (wax ? 20 : 0) + (tire ? 10 : 0);
  const base = 49;
  const discount = promo && !useCredit ? 10 : 0;
  const total = (useCredit ? 0 : base - discount) + extras;
  const back = () => step === 0 ? onClose() : setStep(step - 1);
  React.useEffect(() => {
    if (frozen) return;
    if (step === 5) {
      const t = setTimeout(() => setStep(6), 1700);
      return () => clearTimeout(t);
    }
  }, [step]);
  const wrap = {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    padding: '6px 20px 24px'
  };
  const TITLES = ['غسلة خارجية', 'السيارة والموقع', 'الموعد', 'المراجعة', 'الدفع'];
  if (step === 5) return /*#__PURE__*/React.createElement(Processing, {
    title: "\u0646\u0639\u0627\u0644\u062C \u0627\u0644\u062F\u0641\u0639 \u0628\u0623\u0645\u0627\u0646\u2026",
    sub: "\u0644\u0627 \u062A\u063A\u0644\u0642 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u2014 \u0644\u0646 \u064A\u064F\u062E\u0635\u0645 \u0627\u0644\u0645\u0628\u0644\u063A \u0645\u0631\u062A\u064A\u0646."
  });
  if (step === 6) return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      padding: '64px 24px 24px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 92,
      height: 92,
      borderRadius: '50%',
      background: 'var(--yellow)',
      color: 'var(--ink)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Check",
    size: 44
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      fontWeight: 700
    }
  }, useCredit ? 'تم الحجز — خُصمت غسلة من رصيدك' : 'تم الدفع، حجزك مؤكد!'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--text-secondary)'
    }
  }, "\u0633\u0646\u0631\u0633\u0644 \u0625\u0634\u0639\u0627\u0631\u064B\u0627 \u0639\u0646\u062F \u062A\u0639\u064A\u064A\u0646 \u0627\u0644\u0641\u0646\u0651\u064A \u0648\u0642\u0628\u0644 \u0648\u0635\u0648\u0644\u0647."), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(BookingTicket, {
    label: "\u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u062D\u062C\u0632",
    time: slot,
    meta: day + ' · فيلا 12، حي النخيل'
  })), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    style: {
      width: '100%'
    },
    onClick: () => onConfirm({
      slot,
      day,
      service: 'غسلة خارجية',
      total,
      usedCredit: useCredit
    })
  }, "\u062A\u062A\u0628\u0639 \u0627\u0644\u063A\u0633\u0644\u0629"));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FlowHeader, {
    title: TITLES[step],
    onBack: back,
    step: step + 1,
    steps: 5
  }), step === 0 && /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 22,
      background: 'var(--surface-booking)',
      padding: '22px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--violet)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Droplets",
    size: 26
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 21,
      fontWeight: 700,
      marginTop: 4
    }
  }, "\u063A\u0633\u0644\u0629 \u062E\u0627\u0631\u062C\u064A\u0629 \u0643\u0627\u0645\u0644\u0629"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--ink-72)'
    }
  }, "\u0639\u0646\u062F \u0628\u0627\u0628\u0643\u060C \u0628\u062F\u0648\u0646 \u062E\u0631\u0637\u0648\u0645 \u0648\u0644\u0627 \u0641\u0648\u0636\u0649 \u2014 \u0645\u0627\u0621 \u0645\u0639\u0627\u0644\u062C \u0648\u0645\u0646\u0627\u0634\u0641 \u0645\u0627\u064A\u0643\u0631\u0648\u0641\u0627\u064A\u0628\u0631."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      marginTop: 8,
      fontSize: 13.5,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontVariantNumeric: 'tabular-nums'
    }
  }, "\u0645\u0646 49 \u0631.\u0633"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: 'var(--ink-72)'
    }
  }, "\u2248 45 \u062F\u0642\u064A\u0642\u0629"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "\u0645\u0627\u0630\u0627 \u062A\u0634\u0645\u0644"), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 11
    }
  }, ['رغوة نشطة وشطف كامل للهيكل', 'تنظيف الجنوط والإطارات', 'تجفيف بمناشف مايكروفايبر', 'تلميع الزجاج الخارجي'].map(x => /*#__PURE__*/React.createElement("div", {
    key: x,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: 'var(--violet-100)',
      color: 'var(--violet)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Check",
    size: 12
  })), x)))), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => setStep(1)
  }, "\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u062D\u062C\u0632")), step === 1 && /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "\u0627\u0644\u0633\u064A\u0627\u0631\u0629"), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      boxShadow: '0 0 0 2px var(--violet)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 42,
      height: 42,
      borderRadius: 13,
      background: 'var(--violet-100)',
      color: 'var(--violet)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Car",
    size: 21
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700
    }
  }, "\u0644\u0643\u0632\u0633 LX \u2014 \u0623\u0628\u064A\u0636"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, "\u0627\u0644\u0644\u0648\u062D\u0629 ", /*#__PURE__*/React.createElement(T, null, "8241"), " \u062F \u062D \u0628 \xB7 \u0633\u064A\u0627\u0631\u062A\u064A \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629")), /*#__PURE__*/React.createElement(Badge, null, "\u0645\u062D\u062F\u062F\u0629")), /*#__PURE__*/React.createElement("button", {
    style: {
      font: 'inherit',
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--violet)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '10px 0 0',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Plus",
    size: 15
  }), " \u0625\u0636\u0627\u0641\u0629 \u0633\u064A\u0627\u0631\u0629 \u0623\u062E\u0631\u0649")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "\u0627\u0644\u0645\u0648\u0642\u0639"), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "MapPin",
    size: 19
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700
    }
  }, "\u0627\u0644\u0645\u0646\u0632\u0644"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, "\u0641\u064A\u0644\u0627 12\u060C \u0634\u0627\u0631\u0639 \u0627\u0644\u064A\u0627\u0633\u0645\u064A\u0646\u060C \u062D\u064A \u0627\u0644\u0646\u062E\u064A\u0644")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--violet)',
      cursor: 'pointer'
    }
  }, "\u062A\u063A\u064A\u064A\u0631"))), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => setStep(2)
  }, "\u062A\u0623\u0643\u064A\u062F \u0648\u0645\u062A\u0627\u0628\u0639\u0629")), step === 2 && /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "\u0627\u0644\u064A\u0648\u0645"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, SV_DAYS.map(d => /*#__PURE__*/React.createElement(Tag, {
    key: d,
    selected: day === d,
    onClick: () => setDay(d)
  }, d)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "\u0627\u0644\u0645\u0648\u0627\u0639\u064A\u062F \u0627\u0644\u0645\u062A\u0627\u062D\u0629 ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500
    }
  }, "\u2014 \u0646\u0639\u0631\u0636 \u0627\u0644\u0645\u062A\u0627\u062D \u0641\u0639\u0644\u064B\u0627 \u0641\u0642\u0637")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 8
    }
  }, SV_SLOTS.map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    dir: "ltr",
    onClick: () => setSlot(s),
    style: {
      font: 'inherit',
      fontSize: 13,
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums',
      padding: '10px 0',
      borderRadius: 12,
      border: 'none',
      cursor: 'pointer',
      background: slot === s ? 'var(--violet)' : 'var(--surface-booking-soft)',
      color: slot === s ? '#fff' : 'var(--ink)',
      boxShadow: slot === s ? 'none' : 'inset 0 0 0 1.5px var(--ice)',
      transition: 'all 120ms'
    }
  }, s)))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-muted)',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Clock",
    size: 14
  }), " \u0646\u062D\u062C\u0632 \u0644\u0643 \u0627\u0644\u0645\u0648\u0639\u062F \u0645\u0624\u0642\u062A\u064B\u0627 \u0623\u062B\u0646\u0627\u0621 \u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062F\u0641\u0639."), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => setStep(3)
  }, "\u0645\u062A\u0627\u0628\u0639\u0629")), step === 3 && /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement(BookingTicket, {
    label: "\u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u062D\u062C\u0632",
    time: slot,
    meta: day + ' · لكزس LX · المنزل'
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "\u0625\u0636\u0627\u0641\u0627\u062A \u0627\u062E\u062A\u064A\u0627\u0631\u064A\u0629"), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "\u0637\u0628\u0642\u0629 \u0648\u0627\u0643\u0633 \u062D\u0645\u0627\u064A\u0629 (+20 \u0631.\u0633)",
    checked: wax,
    onChange: e => setWax(e.target.checked)
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "\u0644\u0645\u0639\u0629 \u0625\u0637\u0627\u0631\u0627\u062A (+10 \u0631.\u0633)",
    checked: tire,
    onChange: e => setTire(e.target.checked)
  }))), wallet.credits > 0 && /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: 'var(--surface-booking-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14.5,
      fontWeight: 700
    }
  }, "\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0631\u0635\u064A\u062F \u0627\u0644\u0628\u0627\u0642\u0629"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, "\u0644\u062F\u064A\u0643 ", wallet.credits, " \u063A\u0633\u0644\u0627\u062A \u2014 \u062A\u064F\u062E\u0635\u0645 \u063A\u0633\u0644\u0629 \u0648\u0627\u062D\u062F\u0629")), /*#__PURE__*/React.createElement(Switch, {
    checked: useCredit,
    onChange: e => setUseCredit(e.target.checked)
  })), !useCredit && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "\u0631\u0645\u0632 \u062A\u0631\u0648\u064A\u062C\u064A",
    defaultValue: promo ? 'WELCOME' : '',
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => setPromo(true)
  }, promo ? 'مطبَّق' : 'تطبيق')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, useCredit ? /*#__PURE__*/React.createElement(LRow, {
    label: "\u063A\u0633\u0644\u0629 \u062E\u0627\u0631\u062C\u064A\u0629 \u2014 \u0645\u0646 \u0631\u0635\u064A\u062F \u0627\u0644\u0628\u0627\u0642\u0629",
    amount: "\u063A\u0633\u0644\u0629 1"
  }) : /*#__PURE__*/React.createElement(LRow, {
    label: "\u063A\u0633\u0644\u0629 \u062E\u0627\u0631\u062C\u064A\u0629",
    amount: "49 \u0631.\u0633"
  }), wax && /*#__PURE__*/React.createElement(LRow, {
    label: "\u0648\u0627\u0643\u0633 \u062D\u0645\u0627\u064A\u0629",
    amount: "20 \u0631.\u0633"
  }), tire && /*#__PURE__*/React.createElement(LRow, {
    label: "\u0644\u0645\u0639\u0629 \u0625\u0637\u0627\u0631\u0627\u062A",
    amount: "10 \u0631.\u0633"
  }), discount > 0 && /*#__PURE__*/React.createElement(LRow, {
    label: "\u062E\u0635\u0645 WELCOME",
    amount: "-10 \u0631.\u0633",
    muted: true
  }), /*#__PURE__*/React.createElement(LRow, {
    label: "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A",
    amount: total + ' ر.س',
    strong: true
  })), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => total === 0 ? setStep(5) : setStep(4)
  }, total === 0 ? 'تأكيد الحجز' : 'المتابعة للدفع')), step === 4 && /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    style: {
      margin: 0
    }
  }, "\u0627\u062E\u062A\u0631 \u0648\u0633\u064A\u0644\u0629 \u0627\u0644\u062F\u0641\u0639"), /*#__PURE__*/React.createElement(PayMethods, {
    selected: method,
    onSelect: setMethod
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(LRow, {
    label: "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A \u0634\u0627\u0645\u0644 \u0627\u0644\u0636\u0631\u064A\u0628\u0629",
    amount: total + ' ر.س',
    strong: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-muted)',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ShieldCheck",
    size: 14
  }), " \u062F\u0641\u0639 \u0622\u0645\u0646 \u0639\u0628\u0631 \u0628\u0648\u0627\u0628\u0629 \u0645\u0639\u062A\u0645\u062F\u0629 \u2014 \u0644\u0627 \u0646\u062D\u0641\u0638 \u0628\u064A\u0627\u0646\u0627\u062A \u0628\u0637\u0627\u0642\u062A\u0643."), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => setStep(5)
  }, "\u0627\u062F\u0641\u0639 ", total, " \u0631.\u0633")));
}
Object.assign(window, {
  SingleVisitFlow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app-ar/SingleVisitFlow.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app-ar/image-slot.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever a design needs an image.
 * You control the slot's shape; it sizes to its container by default. When the search_stock_photos tool
 * is available, prefill the slot by default — write the photo's URL into
 * src (with credit/credit-href); the user can still fill or replace it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The sidecar is a SIBLING of the HTML file that uses this component: the
 * read is a document-relative fetch, and the host resolves the bridge's
 * sidecar writes into the previewed file's directory to match (same
 * contract as design_canvas.jsx). Pages in the same directory share one
 * sidecar; keep slot ids distinct across them.
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          Initial framing baseline: cover | contain.   (default 'cover')
 *                cover starts the image filling the frame (overflow cropped);
 *                contain starts it fully visible (letterboxed). Either way the
 *                user can always pan/scale from there — double-click, or the
 *                Edit control, enters reframe mode (drag to move, scroll or
 *                corner-handles to scale; Escape / click-out commits). The
 *                crop persists alongside the image in the sidecar.
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. Prefill it with a real
 *                photo via search_stock_photos when that tool is available
 *                (set credit/credit-href from the result). A user drop
 *                overrides it; clearing the drop reveals src again.
 *   credit       Attribution text shown as a small overlay at the
 *                bottom-left of the filled slot. REQUIRED whenever src
 *                points at any Unsplash host (images.unsplash.com,
 *                plus.unsplash.com, …): an Unsplash src with no credit
 *                renders an error tile INSTEAD of the photo (Unsplash
 *                terms forbid showing their photos unattributed). Use the
 *                exact form 'Photo by {photographer name} on Unsplash' —
 *                the overlay then links the name to credit-href and
 *                'Unsplash' to the Unsplash homepage, and links back to
 *                unsplash.com automatically get the required utm referral
 *                params appended at render time. The credit belongs to
 *                the src image, so it only shows while src is what's
 *                displayed — a user-dropped image hides it.
 *   credit-href  Link for the photographer's name in the credit overlay
 *                (their Unsplash profile URL from the stock-photo search
 *                results). http(s) URLs only — anything else renders the
 *                name as plain text.
 *
 * Sizing: the slot fills its container by default (width/height 100%).
 * Put it in a sized wrapper — absolutely positioned, a grid cell, a fixed
 * frame — and it takes exactly that box. When the parent's height is
 * indefinite (ordinary flow), it falls back to full width at a 3:2 aspect
 * ratio instead of collapsing. In a shrink-to-fit parent (a float,
 * width:max-content, an unsized absolute wrapper), percentages have
 * nothing to resolve against — size the slot or its wrapper explicitly
 * there. For a fixed-size slot, set
 * width/height on the element itself (inline style), which overrides the
 * default. When
 * layering content above a slot (full-bleed layouts), make the overlay
 * click-through — pointer-events: none on scrims/text plates, re-enabled
 * on interactive children — so the slot's hover controls stay reachable.
 * Keep the slot's bottom-left corner visually clear as well: the credit
 * overlay renders there, and a dark fade or text plate covering it hides
 * the attribution Unsplash's terms require — end the fade above that
 * corner, or keep it nearly transparent where the credit sits.
 *
 * Usage:
 *   <div style="position:relative;width:100%;height:100%">      <!-- full-bleed: -->
 *     <image-slot id="bg" shape="rect"></image-slot>            <!-- fills the wrapper -->
 *   </div>
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.image-slots.state.json';

  // Unsplash terms require visible attribution wherever their photos
  // display, and every link back to unsplash.com must carry utm referral
  // params. Two render-time rules enforce that here:
  //  - an Unsplash-src slot with NO credit attribute renders an error
  //    tile INSTEAD of the photo (an uncredited Unsplash photo on screen
  //    is itself the terms violation, so it never renders bare);
  //  - rendered credit links pointing at unsplash.com get the referral
  //    params appended when absent (credit-href values live in page
  //    content that can't be edited after the fact).
  // Keep the utm_source value in sync with UTM_SOURCE in
  // platform/web-agent/unsplash.ts — this file is a project-local
  // artifact and cannot import it (equality is pinned by tests).
  const UNSPLASH_HOMEPAGE_HREF = 'https://unsplash.com/?utm_source=claude_design&utm_medium=referral';
  // Host rule mirrors the hotlink validator that admits Unsplash srcs into
  // pages in the first place (cdn$ in unsplash.ts: apex or any subdomain)
  // — Unsplash+ results serve from plus.unsplash.com, not just images.*,
  // and an admitted-but-uncredited photo must error whatever unsplash
  // host it rides on.
  // Trailing-dot FQDNs (images.unsplash.com.) are the same host to the
  // browser but would miss the regex — strip one dot so the check fails
  // CLOSED (unrecognized-but-real Unsplash srcs must error, not render).
  const isUnsplashHost = u => {
    try {
      return /(^|\.)unsplash\.com$/.test(new URL(u, document.baseURI).hostname.replace(/\.$/, ''));
    } catch {
      return false;
    }
  };
  // Render-time referral normalization for links back to Unsplash:
  // appends utm_source/utm_medium when absent, preserves every existing
  // query param, never overwrites an existing utm_source, and passes
  // non-Unsplash URLs through untouched. Input is an ABSOLUTE validated
  // http(s) URL (the credit render funnel resolves + validates first).
  const withReferral = href => {
    try {
      const u = new URL(href);
      if (!/(^|\.)unsplash\.com$/.test(u.hostname.replace(/\.$/, ''))) {
        return href;
      }
      if (!u.searchParams.has('utm_source')) {
        u.searchParams.set('utm_source', 'claude_design');
      }
      if (!u.searchParams.has('utm_medium')) {
        u.searchParams.set('utm_medium', 'referral');
      }
      return u.toString();
    } catch (e) {
      return href;
    }
  };
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  // Unload-time flush: save()'s serialization defers a mid-RTT re-fire to a
  // .then that never runs in an unloading document, silently dropping a
  // pagehide commit. Post the current slots immediately instead — content
  // is a superset snapshot of any in-flight save's, the write is a
  // whole-file last-writer-wins replace, and postMessage FIFO delivers it
  // to the host after the in-flight one, so a backend-side reorder at
  // worst reproduces the dropped-commit outcome this flush improves on.
  // Guarded on the initial sidecar read: pre-hydration slots can miss
  // other slots' persisted entries, and flushing it would clobber them —
  // that narrow case stays best-effort (the in-memory merge in load()
  // cannot happen in an unloading document anyway).
  function flushNow() {
    if (!loaded) return;
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    try {
      Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {});
    } catch (e) {}
  }
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet =
  // Fill the container by default: slots are usually placed inside a
  // sized wrapper (a hero frame, a grid cell, an inset:0 layer) and are
  // expected to take that box — a fixed intrinsic size would render as
  // a small tile in the corner of a full-bleed wrapper instead.
  // aspect-ratio is the companion fallback that keeps a bare slot
  // visible when the parent's height is indefinite: height:100%
  // resolves to auto there, and the ratio then derives height from
  // width instead of letting the slot collapse to zero height.
  // Explicit width/height on the element override all of this.
  // color:inherit (not a fixed near-black): the placeholder chrome —
  // empty-state icon/caption (currentColor) and the dashed ring — must
  // read on dark decks too, and the slide's own text color is the one
  // color guaranteed to contrast with the slide background. The soft
  // look comes from opacity on those parts, not from a baked-in alpha.
  ':host{display:block;position:relative;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;' + '  width:100%;height:100%;aspect-ratio:3/2}' + '.empty .cap,.empty .sub{opacity:.75}' + '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(127,127,127,.08)}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  // popover=manual promotes the spill to the top layer on reframe, so it is
  // not clipped by any overflow:hidden / clip-path / scroll-container
  // ancestor (a plain z-index can't escape overflow clipping). UA popover
  // defaults (inset:0;margin:auto) are reset; _applyView sets viewport px.
  '.spill{position:fixed;margin:0;inset:auto;border:0;padding:0;background:transparent;' + '  overflow:visible;transform:translate(-50%,-50%);z-index:1;cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px}' + '.empty:hover .sub{opacity:1}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed currentColor;' + '  opacity:.35;transition:border-color .12s,opacity .12s}' + ':host([data-over]) .ring{border-color:#c96442;opacity:1}' + ':host([data-filled]) .ring{display:none}' +
  // Controls overlay INSIDE the frame, pinned to the top-right corner, so
  // a full-bleed slot in an overflow:hidden container still shows them
  // (the old below-mask placement got clipped). Credit sits bottom-left,
  // so top-right avoids collision. The blurred pill background keeps them
  // legible over the image.
  // The UA [popover] base rule styles the element in EVERY state (only
  // display:none is gated on :not(:popover-open), and the display:flex
  // below overrides that) — so the UA resets live HERE, like .spill's,
  // or the ordinary hover-state strip renders as a bordered Canvas box
  // centered by margin:auto. inset:auto precedes top/right (shorthand).
  '.ctl{position:absolute;inset:auto;top:8px;right:8px;margin:0;border:0;padding:0;' + '  background:transparent;overflow:visible;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' +
  // While reframing, the spill owns the top layer and would swallow every
  // click on the in-frame controls. Promoting .ctl into the top layer
  // ABOVE the spill (shown after it — later popovers stack higher) keeps
  // Edit-as-toggle and Replace clickable mid-reframe. _applyView pins it
  // to the frame's top-right in viewport px (translateX(-100%)
  // right-aligns against the computed left edge); inset:auto clears the
  // base rule's top/right so the inline left/top position it alone.
  '.ctl:popover-open{position:fixed;inset:auto;transform:translateX(-100%)}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}' +
  // Replacement in flight: after a src swap the browser keeps painting
  // the PREVIOUS image until the new one decodes, so a Replace would
  // flash the old photo and then pop. Hide the stale frame (visibility,
  // not display — _applyView geometry still applies) and spin until the
  // new image reports in (load/error clears data-swapping).
  ':host([data-swapping]) .frame img{visibility:hidden}' + '.loading{position:absolute;inset:0;display:none;align-items:center;' + '  justify-content:center;pointer-events:none}' + ':host([data-swapping]) .loading{display:flex}' + '.loading::after{content:"";width:22px;height:22px;border-radius:50%;' + '  border:2px solid rgba(127,127,127,.25);border-top-color:currentColor;' + '  animation:om-slot-spin .7s linear infinite}' + '@keyframes om-slot-spin{to{transform:rotate(360deg)}}' +
  // Reduced motion: the static two-tone ring still reads as "working".
  '@media (prefers-reduced-motion:reduce){.loading::after{animation:none}}' + '.credit{position:absolute;left:6px;bottom:6px;max-width:calc(100% - 12px);display:none;' + '  padding:3px 7px;border-radius:5px;background:rgba(0,0,0,.55);color:#fff;' + '  font:10px/1.2 system-ui,-apple-system,sans-serif;text-decoration:none;' + '  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;backdrop-filter:blur(6px)}' +
  // The credit is a SPAN holding one or two <a>s (Unsplash's prescribed
  // form links the photographer AND Unsplash) — anchors style inline so
  // the overlay reads as one line of text.
  '.credit a{color:inherit;text-decoration:none}' + '.credit a:hover,.credit a:focus-visible{text-decoration:underline}' + ':host([data-filled][data-credit]) .credit{display:block}' +
  // Exports must ship JUST the image — no hover controls, no credit chip
  // (the host marks <html data-om-exporting> for the capture window; the
  // page-level hide script can't reach shadow DOM, this rule can).
  ':host-context([data-om-exporting]) .ctl,' + ':host-context([data-om-exporting]) .credit{display:none !important}' +
  // Print must ship just the image too: the hover-gated controls can be
  // mid-hover when print() fires, and the credit chip is screen chrome —
  // the same rule the capture window gets, keyed on print media instead
  // of the host's data-om-exporting mark (the print path sets no mark).
  '@media print{.ctl,.credit{display:none !important}}' +
  // No export-window mask rules here on purpose: the export capture
  // releases the replacement mask by REMOVING data-swapping (the
  // shadow-root pass in pages/export/shared.ts HIDE_EXPORT_CHROME_SCRIPT)
  // — attribute removal works in every engine (:host-context is
  // Chromium-only), is scoped by construction to slots actually
  // mid-swap, and hides the spinner through the same gate. A masked img
  // would otherwise be silently dropped from PPTX decks (the capture
  // walk skips visibility:hidden imgs).
  // Attribution error tile: REPLACES the photo when an Unsplash src has
  // no credit attribute — rendering the photo uncredited is the terms
  // violation, so the photo must not appear at all.
  // Calm and neutral on purpose (review feedback): the tile informs the
  // user; the fix instructions are machine-facing (usage docblock, tool
  // description, and the turn-end scan's bounce copy name the attributes
  // for the agent).
  '.attr-error{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  background:#f2f1ef;color:#6e6c66;user-select:none;' + '  font:13px/1.45 system-ui,-apple-system,sans-serif}' + '.attr-error svg{opacity:.55}' + '.attr-error .cap{max-width:92%;font-weight:500;letter-spacing:.01em}' + ':host([data-attribution-error]) .attr-error{display:flex}' + ':host([data-attribution-error]) .ring{display:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  const warnIcon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>' + '<path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'placeholder', 'src', 'id', 'credit', 'credit-href'];
    }

    /** Duplicate-slide hook (called by deck-stage, see its
     *  _remintDuplicateIds): copy this id's stored image, if any, under a
     *  freshly minted key and return that key — so a duplicated slide's
     *  slot keeps its dropped photo instead of reverting to the
     *  placeholder. 'isFree' is the caller's uniqueness check (document
     *  ids); candidates must ALSO be unused in the sidecar, which can
     *  hold keys from other pages sharing the project root. (An EMPTY
     *  slot on another page leaves no sidecar entry, so its id is not
     *  detectable here — a minted key can collide with it and that slot
     *  would show this photo. Same blast radius as two pages reusing an
     *  id by hand, which the shared sidecar already permits.) Returns null
     *  when no id could be minted (caller strips the id, today's
     *  behavior). */
    static cloneSlot(fromId, isFree) {
      if (typeof fromId !== 'string' || !fromId) return null;
      // Pre-hydration the store can't veto candidates or source the copy
      // — degrade to the strip (today's behavior) rather than mint
      // against keys we can't see yet. Any rendered (= droppable) slot
      // means load() has already settled.
      if (!loaded) return null;
      const stem = fromId.replace(/-\d+$/, '') || fromId;
      for (let n = 2; n < 100; n++) {
        const toId = stem + '-' + n;
        if (toId === fromId) continue;
        if (slots[toId] !== undefined) {
          // Reuse a key holding this exact value (bytes AND crop) if no
          // live element here owns it — a duplicate op the host refused
          // after minting leaves such a key behind, and reusing keeps
          // refused retries from accumulating one orphaned copy per
          // attempt. Full equality (not just bytes) so a byte-identical
          // key another PAGE owns with its own crop is stepped past, not
          // adopted or rewritten. (Entries without .u never match.)
          const prev = getSlot(toId);
          const cur = getSlot(fromId);
          if (!(prev && cur && prev.u && prev.u === cur.u && prev.s === cur.s && prev.x === cur.x && prev.y === cur.y && (typeof isFree !== 'function' || isFree(toId)))) continue;
          return toId;
        }
        if (typeof isFree === 'function' && !isFree(toId)) continue;
        const v = getSlot(fromId);
        if (v) setSlot(toId, Object.assign({}, v));
        return toId;
      }
      return null;
    }
    constructor() {
      super();
      // clonable: rail thumbnails deep-clone slides and carry this shadow
      // along; reuse an already-cloned root so upgrade-after-clone works.
      // (Deliberately NOT serializable — a getHTML consumer would embed
      // multi-MB sidecar data-URLs into serialized page HTML.)
      const root = this.shadowRoot || this.attachShadow({
        mode: 'open',
        clonable: true
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="attr-error" part="attribution-error">' + warnIcon + '    <div class="cap">This photo needs attribution</div></div>' + '  <div class="loading" part="loading"></div>' + '  <div class="ring" part="ring"></div>' + '</div>' +
      // Outside .frame, like .spill/.ctl — the frame's overflow:hidden +
      // border-radius/clip-path would cut the credit off on circle/pill/mask.
      // A SPAN, not an <a>: the prescribed Unsplash credit holds two links
      // (photographer + Unsplash), built per-render in _render().
      '<span class="credit" part="credit"></span>' + '<div class="spill" popover="manual" data-dc-edit-transparent>' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' +
      // data-dc-edit-transparent: the DC editor's edit-mode picker lets
      // clicks through for chrome marked with it (EDIT_TRANSPARENT_SEL)
      // — without it, Replace/Edit clicks in Edit mode are swallowed by
      // element selection and the controls look dead.
      '<div class="ctl" popover="manual" data-dc-edit-transparent><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="edit" title="Reframe image">Edit</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ctl = root.querySelector('.ctl');
      this._credit = root.querySelector('.credit');
      this._attrError = root.querySelector('.attr-error');
      // Credit clicks open the link, not browse/reframe.
      this._credit.addEventListener('click', e => e.stopPropagation());
      this._credit.addEventListener('dblclick', e => e.stopPropagation());
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      // Encode-in-flight marker (the owning _ingest generation): while set,
      // the same-src "nothing in flight" clear in _render must not fire —
      // the stored value still points at the OLD image until the encode
      // lands, so that clear would unmask the stale image mid-replace.
      this._swapGen = 0;
      // Render-owned swap in flight: set when _render assigns a new src,
      // cleared only by the img's own load/error (or the empty branch).
      // img.complete CANNOT stand in for this — setting src only QUEUES
      // the current-request swap (a microtask), so synchronously after an
      // assignment, complete still reports the OLD settled request. The
      // pick path does exactly that: the host sets src, credit, and
      // credit-href back-to-back in one task, and renders #2/#3 would
      // read the stale complete === true and drop the mask one render
      // after it was set.
      this._loadPending = false;
      // See _render's empty branch: a transient attribution-error wipe of a
      // showing image must make the follow-up render a replacement (spinner),
      // not a first fill (blank frame).
      this._hidShowing = false;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (!act) return;
        // The hidden controls are opacity-0 but still tabbable — without
        // this gate a keyboard user could drive them on a read-only share
        // link (mirrors the dblclick handler's editable gate).
        if (!this.hasAttribute('data-editable')) return;
        if (act === 'replace') {
          this._exitReframe(true);
          // Host-owned picker (Unsplash modal; it also offers local import).
          this.dispatchEvent(new CustomEvent('image-slot:pick', {
            bubbles: true,
            composed: true,
            detail: {
              id: this.id || null
            }
          }));
        }
        if (act === 'edit') {
          if (!this._reframes()) return;
          if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      // load/error also release the replacement-in-flight mask (via the
      // single discipline in _releaseMask): the swap is only revealed once
      // the new image can actually paint (on error the frame shows its
      // background, same as a fresh slot with a broken src).
      this._img.addEventListener('load', () => {
        this._loadPending = false;
        this._releaseMask(true);
        this._applyView();
      });
      this._img.addEventListener('error', () => {
        this._loadPending = false;
        this._releaseMask(true);
      });
      // Gated only on editable — any filled slot can be repositioned/scaled,
      // regardless of fit. Share links (no writeFile) stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
          const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // The host may inject window.omelette.writeFile AFTER the first render;
      // re-render on hover so the editable-gated controls reliably appear.
      this.addEventListener('pointerenter', this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('pointerenter', this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      // commit=false: a disconnect is not a user intent — committing here
      // would persist whatever half-finished drag a React remount or DOM
      // splice happened to interrupt. Deliberate exits commit on their own
      // paths (Escape/click-out/toggle), and unloads commit via pagehide.
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._signalReframe(true);
      // Best-effort commit when the document unloads mid-reframe (a host
      // navigation racing the enter signal, a manual reload, tab close):
      // the sidecar write rides the host bridge, which outlives this
      // document, so the crop survives even though the mode dies with the
      // DOM. Held on the instance so _exitReframe detaches exactly what
      // was attached.
      this._pagehide = () => {
        this._exitReframe(true);
        flushNow();
      };
      window.addEventListener('pagehide', this._pagehide);
      // Promote spill to the top layer, then keep it pinned over the frame:
      // scroll/resize cover the common cases, and a per-frame rect check
      // catches layout shifts that fire neither (an image above finishing
      // load, streamed DOM pushing the slot down, an ancestor transform
      // change) so the overlay can't detach from the frame.
      try {
        this._spill.showPopover();
      } catch {}
      // After the spill, so the controls stack above it in the top layer.
      try {
        this._ctl.showPopover();
      } catch {}
      this._reposition = () => {
        if (this.hasAttribute('data-reframe')) this._applyView();
      };
      window.addEventListener('scroll', this._reposition, true);
      window.addEventListener('resize', this._reposition);
      this._lastRect = '';
      this._watch = () => {
        if (!this.hasAttribute('data-reframe')) return;
        const r = this.getBoundingClientRect();
        const key = r.left + ',' + r.top + ',' + r.width + ',' + r.height;
        if (key !== this._lastRect) {
          this._lastRect = key;
          this._applyView();
        }
        this._watchId = requestAnimationFrame(this._watch);
      };
      this._watchId = requestAnimationFrame(this._watch);
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (this._reposition) {
        window.removeEventListener('scroll', this._reposition, true);
        window.removeEventListener('resize', this._reposition);
        this._reposition = null;
      }
      if (this._watchId) {
        cancelAnimationFrame(this._watchId);
        this._watchId = 0;
      }
      if (this._pagehide) {
        window.removeEventListener('pagehide', this._pagehide);
        this._pagehide = null;
      }
      try {
        this._spill.hidePopover();
      } catch {}
      try {
        this._ctl.hidePopover();
      } catch {}
      this._ctl.style.left = '';
      this._ctl.style.top = '';
      if (commit) this._commitView();
      this._signalReframe(false);
    }

    // Reframe state lives only in this DOM until commit, invisible to the
    // host's dirty signals — announce enter/exit so the host can hold
    // auto-reloads for exactly the gesture (the guest bundle forwards
    // image-slot:reframe to the host as imageSlotReframe). Dispatched on
    // the element (composed, so it escapes shadow roots) while connected;
    // a disconnected exit (disconnectedCallback) falls back to document so
    // the host still hears it.
    _signalReframe(active) {
      const target = this.isConnected ? this : document;
      target.dispatchEvent(new CustomEvent('image-slot:reframe', {
        bubbles: true,
        composed: true,
        detail: {
          active: active,
          id: this.id || null
        }
      }));
    }

    // Public: host's "Import from computer" calls this to run local browse.
    openFilePicker() {
      this._exitReframe(true);
      this._input.click();
    }

    // A src write is a newer intent for this slot's content — the host
    // pick path (setImageSlotImage) or an agent edit — so it must win
    // over any encode still in flight from an earlier drop: left live,
    // that encode lands later, passes _ingest's gen guard, and its
    // setSlot silently overwrites the pick (the stored value shadows
    // src in _render). Bumping _gen kills the encode before its own
    // _swapGen clear runs, so clear the dead claim here too — otherwise
    // _releaseMask (gated on !_swapGen) never fires and the pick's
    // spinner is stranded. src ONLY: the pick sets credit/credit-href
    // in the same task, and clearing _swapGen on those would let the
    // same-src branch unmask the old image mid-encode.
    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'src' && oldVal !== newVal) {
        this._gen++;
        this._swapGen = 0;
      }
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      // Replacing a shown image: surface the swap through the encode too,
      // not just the decode — otherwise the old photo sits there with no
      // feedback while the canvas re-encode runs. An empty slot keeps its
      // placeholder (no spinner) until the encode lands, as before.
      // _swapGen guards the mask against re-renders DURING the encode
      // (pointerenter, ResizeObserver, another slot's store write): the
      // stored value still resolves to the old image there, so _render's
      // same-src clear would otherwise unmask it mid-replace.
      if (this.hasAttribute('data-filled')) {
        this.setAttribute('data-swapping', '');
        this._swapGen = gen;
      }
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        // Clear BEFORE setSlot: its synchronous re-render must see no
        // pending encode, so a byte-identical re-upload (same data URL, no
        // load event coming) still clears the mask via the complete branch.
        this._swapGen = 0;
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._swapGen = 0;
        // Reveal the kept old image — unless another replacement (a
        // remote pick's src swap) is still in flight, in which case the
        // mask stays until THAT image settles (its load/error releases).
        this._releaseMask();
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is available on any filled slot — the user can
    // always reposition/scale. `fit` only sets the initial baseline (see
    // _geom): contain starts fully-visible, cover starts frame-filling.
    _reframes() {
      return this.hasAttribute('data-filled');
    }

    // The single release discipline for the replacement-in-flight mask
    // (data-swapping). The mask comes off only when BOTH hold:
    //  - no encode is pending (_swapGen) — mid-encode the stored value
    //    still resolves to the old image, so any reveal paints it;
    //  - the frame img has settled on its current src — an unsettled src
    //    means some replacement is still in flight (e.g. a remote pick),
    //    whoever started it, and revealing would paint the previous
    //    frame. The load/error listeners pass settled=true (the event IS
    //    the settlement signal, per spec complete is true by then);
    //    other callers rely on the complete flag (covers loaded AND
    //    failed).
    // Every release path funnels through here EXCEPT _render's empty
    // branch (the img is being cleared — nothing will ever settle).
    _releaseMask(settled) {
      if (!this._swapGen && !this._loadPending && (settled || this._img.complete)) {
        this.removeAttribute('data-swapping');
      }
    }

    // Baseline geometry, shared by clamp/apply/resize. `base` is the scale at
    // view-scale s=1: cover = fill the frame (overflow on the looser axis),
    // contain = fit fully inside (letterboxed). Zooming a contain image past
    // s where it overflows naturally becomes a crop. Null until the img has
    // loaded (naturalWidth is 0 before that) or when the slot has no layout
    // box — ResizeObserver fires with a 0×0 rect under display:none, and
    // clamping against a degenerate 1×1 frame would silently pull the stored
    // pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
      const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
      return {
        iw,
        ih,
        fw,
        fh,
        base
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      // Top-layer controls: pin to the frame's top-right in viewport px
      // (the same 8px inset as the in-frame layout; unscaled — top-layer UI
      // reads as chrome, not page content). BEFORE the geometry branch:
      // placement needs only the frame rect, and a not-yet-loaded or broken
      // src must not leave the promoted strip floating unpositioned. Gated
      // on the popover actually being open: without the Popover API,
      // showPopover() threw (swallowed in _enterReframe), .ctl stays in
      // its in-frame absolute layout, and viewport-px coordinates would
      // shove it off-frame — and matches(':popover-open') itself throws
      // there (unknown pseudo-class), hence the try/catch.
      if (this.hasAttribute('data-reframe')) {
        let onTop = false;
        try {
          onTop = this._ctl.matches(':popover-open');
        } catch {}
        if (onTop) {
          const r = this.getBoundingClientRect();
          this._ctl.style.left = r.right - 8 + 'px';
          this._ctl.style.top = r.top + 8 + 'px';
        }
      }
      if (!g) {
        // Dimensions not known yet (before img load) — centered fit so there
        // is no flash of an unpositioned image before the geometry lands.
        const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = contain ? 'contain' : 'cover';
        return;
      }
      // Baseline (cover-fill or contain-fit) × view scale. Width/height and
      // left/top are all frame-% — depends only on the frame aspect ratio, so
      // a responsive resize keeps the same crop. The spill layer mirrors the
      // same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      if (this.hasAttribute('data-reframe')) {
        // Top-layer spill: position in viewport px over the frame. The top
        // layer escapes ancestor transforms entirely, so EVERY term must be
        // in viewport units: getBoundingClientRect gives the frame's scaled
        // origin AND size, and the rect/layout ratio rescales the ghost —
        // sizing from layout px alone renders it 1/scale too large under a
        // scaled deck slide. Inner ghost + handles stay box-relative.
        const r = this.getBoundingClientRect();
        const sx = g.fw ? r.width / g.fw : 1;
        const sy = g.fh ? r.height / g.fh : 1;
        this._spill.style.width = g.iw * k * sx + 'px';
        this._spill.style.height = g.ih * k * sy + 'px';
        this._spill.style.left = r.left + (50 + this._view.x) / 100 * r.width + 'px';
        this._spill.style.top = r.top + (50 + this._view.y) / 100 * r.height + 'px';
      }
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      // An Unsplash src with no credit attribute must NOT render — showing
      // the photo uncredited is the Unsplash-terms violation itself. The
      // error tile replaces the photo until the credit is written. A
      // user-dropped image is the user's own content and always renders.
      // Trimmed: credit is agent/user-editable content, and a whitespace-
      // only value must count as missing — otherwise it would suppress the
      // error tile AND render an empty credit box (no text, no links),
      // exactly the unattributed state this gate exists to prevent.
      const credit = (this.getAttribute('credit') || '').trim();
      const attrError = !!(!credit && !this._userUrl && srcAttr && isUnsplashHost(srcAttr));
      this.toggleAttribute('data-attribution-error', attrError);
      if (url && !attrError) {
        const prev = this._img.getAttribute('src');
        if (prev !== url) {
          // Replacing an already-shown image: mark the swap BEFORE setting
          // src so the stale frame is never revealed (see the data-swapping
          // stylesheet rules). First fill (prev empty) keeps the existing
          // placeholder-until-load behavior — no spinner. _hidShowing
          // covers the pick path's transient attribution-error wipe: prev
          // is gone, but an image WAS showing, so this is a replacement.
          if (prev || this._hidShowing) this.setAttribute('data-swapping', '');
          // Mark the swap BEFORE assigning src: complete keeps reporting
          // the old settled request until the browser's
          // update-the-image-data microtask runs, so same-task re-renders
          // (the pick path's credit/credit-href setAttributes) need this
          // flag, not complete, to know a load is in flight.
          this._loadPending = true;
          this._img.src = url;
          this._ghost.src = url;
        } else {
          // Same-src re-render — release if settled, so an ingest-set
          // spinner can't stick after a byte-identical re-upload (same
          // data URL, no further load event ever fires).
          this._releaseMask();
        }
        this._hidShowing = false;
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this.removeAttribute('data-swapping');
        // The src is being removed — no load/error will ever fire for it.
        this._loadPending = false;
        // A transient attribution-error wipe of a showing image happens on
        // the pick path: the host sets src one setAttribute before credit,
        // so render N hides the old image (attrError) and render N+1
        // restores a URL. Remember the wipe so that restore renders as a
        // replacement (spinner), not a first fill (blank frame).
        this._hidShowing = attrError && !!this._img.getAttribute('src');
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        // The error tile owns the blocked-photo state; .empty stays for
        // the genuinely-empty slot.
        this._empty.style.display = attrError ? 'none' : 'flex';
        this.removeAttribute('data-filled');
      }

      // Credit belongs to the author src, so a user drop hides it.
      // textContent + the http(s)-only funnel keep external strings inert.
      const showCredit = !!(url && credit && !this._userUrl && !attrError);
      this._credit.textContent = '';
      if (showCredit) {
        // Validate once (resolved against the document, http(s) only),
        // then append the terms-required utm referral params to links
        // that point back at unsplash.com.
        let href = '';
        const rawHref = this.getAttribute('credit-href') || '';
        if (rawHref) {
          try {
            const u = new URL(rawHref, document.baseURI);
            if (u.protocol === 'http:' || u.protocol === 'https:') {
              href = withReferral(u.href);
            }
          } catch {}
        }
        const mkLink = (text, linkHref) => {
          const a = document.createElement('a');
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          a.setAttribute('href', linkHref);
          a.textContent = text;
          return a;
        };
        // Unsplash's prescribed credit is TWO links — the photographer's
        // name to their profile (credit-href) and 'Unsplash' to the
        // homepage. Render that split whenever the text has the canonical
        // shape; other text keeps the legacy single-link rendering.
        const m = /^Photo by (.+) on Unsplash$/.exec(credit);
        if (m) {
          this._credit.appendChild(document.createTextNode('Photo by '));
          this._credit.appendChild(href ? mkLink(m[1], href) : document.createTextNode(m[1]));
          this._credit.appendChild(document.createTextNode(' on '));
          this._credit.appendChild(mkLink('Unsplash', UNSPLASH_HOMEPAGE_HREF));
        } else if (href) {
          this._credit.appendChild(mkLink(credit, href));
        } else {
          this._credit.textContent = credit;
        }
      }
      this.toggleAttribute('data-credit', showCredit);
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app-ar/image-slot.js", error: String((e && e.message) || e) }); }

// ui_kits/app/BookScreen.jsx
try { (() => {
const SLOTS = ['08:00–08:30', '08:30–09:00', '09:00–09:30', '10:30–11:00', '11:00–11:30', '16:00–16:30'];
function BookScreen({
  onConfirm
}) {
  const {
    Button,
    Tag,
    Select,
    Input,
    Checkbox,
    Badge
  } = window.BubblesDesignSystem_9de8ef;
  const [service, setService] = React.useState('Exterior');
  const [slot, setSlot] = React.useState('10:30–11:00');
  const price = service === 'Full wash' ? 79 : service === 'Interior' ? 59 : 49;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      padding: '18px 20px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: '-0.02em'
    }
  }, "Book a wash"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "Service"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, ['Exterior', 'Interior', 'Full wash'].map(s => /*#__PURE__*/React.createElement(Tag, {
    key: s,
    selected: service === s,
    onClick: () => setService(s)
  }, s)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Car size",
    style: {
      flex: 1
    },
    defaultValue: "SUV"
  }, /*#__PURE__*/React.createElement("option", null, "Sedan"), /*#__PURE__*/React.createElement("option", null, "SUV"), /*#__PURE__*/React.createElement("option", null, "Pickup")), /*#__PURE__*/React.createElement(Input, {
    label: "Gate notes",
    placeholder: "Villa 12, blue gate",
    style: {
      flex: 1.4
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "Tomorrow's slots ", /*#__PURE__*/React.createElement(Badge, {
    style: {
      marginLeft: 6
    }
  }, "Members first")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 8
    }
  }, SLOTS.map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    onClick: () => setSlot(s),
    style: {
      font: 'inherit',
      fontSize: 13,
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums',
      padding: '10px 0',
      borderRadius: 12,
      border: 'none',
      cursor: 'pointer',
      background: slot === s ? 'var(--violet)' : 'var(--surface-booking-soft)',
      color: slot === s ? '#fff' : 'var(--ink)',
      boxShadow: slot === s ? 'none' : 'inset 0 0 0 1.5px var(--ice)',
      transition: 'all 120ms'
    }
  }, s)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "Wax finish (+SAR 20)"
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Tire shine (+SAR 10)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, "Total"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 30,
      fontWeight: 700,
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.01em'
    }
  }, "SAR ", price)), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => onConfirm({
      service,
      slot
    })
  }, "Confirm booking")));
}
Object.assign(window, {
  BookScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/BookScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ClubScreen.jsx
try { (() => {
function ClubScreen() {
  const {
    Button,
    Card,
    Badge,
    Switch,
    BeatIcon
  } = window.BubblesDesignSystem_9de8ef;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      padding: '18px 20px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: '-0.02em'
    }
  }, "Bubbles Club"), /*#__PURE__*/React.createElement(Card, {
    variant: "dark",
    style: {
      padding: 22,
      display: 'flex',
      flexDirection: 'column',
      gap: 26
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'var(--yellow)'
    }
  }, "Bubbles Club"), /*#__PURE__*/React.createElement(BeatIcon, {
    size: "sm"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-inverse-soft)'
    }
  }, "Member"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 700
    }
  }, "Faisal A. ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400,
      color: 'var(--text-inverse-soft)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "\xB7 N\xBA 10100"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-inverse-soft)'
    }
  }, "Renews 1 Sep \xB7 SAR 199/mo"), /*#__PURE__*/React.createElement(Badge, {
    tone: "yellow"
  }, "2 washes left"))), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, ['10:00 slots released to members first', '2 full washes every week', 'Verification photo after every wash'].map(p => /*#__PURE__*/React.createElement("div", {
    key: p,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: 'var(--violet-100)',
      color: 'var(--violet)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  }))), p))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(Switch, {
    label: "Auto-renew",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "dark",
    size: "sm"
  }, "Manage plan")));
}
Object.assign(window, {
  ClubScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ClubScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/HomeScreen.jsx
try { (() => {
function HomeScreen({
  booking,
  go
}) {
  const {
    Button,
    Card,
    Badge,
    Tag,
    BookingTicket,
    BeatIcon
  } = window.BubblesDesignSystem_9de8ef;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      padding: '18px 20px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/bubbles-logo.svg",
    style: {
      height: 24
    },
    alt: "Bubbles"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: '50%',
      background: 'var(--violet-100)',
      color: 'var(--violet)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 13,
      fontWeight: 700
    }
  }, "FA")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: '-0.02em'
    }
  }, "Good morning, Faisal"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14.5,
      color: 'var(--text-secondary)',
      marginTop: 2
    }
  }, "Shine, right on time.")), /*#__PURE__*/React.createElement("div", {
    onClick: () => go('track'),
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(BookingTicket, {
    time: booking.slot,
    meta: booking.when + ' · ' + booking.address
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "Services"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    onClick: () => go('book')
  }, "Exterior"), /*#__PURE__*/React.createElement(Tag, {
    onClick: () => go('book')
  }, "Interior"), /*#__PURE__*/React.createElement(Tag, {
    onClick: () => go('book')
  }, "Full wash"), /*#__PURE__*/React.createElement(Tag, {
    onClick: () => go('book')
  }, "Wax"))), /*#__PURE__*/React.createElement(Card, {
    variant: "dark",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(BeatIcon, {
    size: "md"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600
    }
  }, "Bubbles Club"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-inverse-soft)'
    }
  }, "Members get 10:00 slots first.")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary",
    onClick: () => go('club')
  }, "Join")), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => go('book')
  }, "Book a wash"));
}
Object.assign(window, {
  HomeScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/TrackScreen.jsx
try { (() => {
const STEPS = [{
  key: 'arrived',
  title: 'Arrived',
  copy: 'Your technician is at the gate.',
  time: '10:31'
}, {
  key: 'washed',
  title: 'Washed',
  copy: 'Washed. Drying now.',
  time: '10:52'
}, {
  key: 'verified',
  title: 'Verified',
  copy: 'Quality checked — photo sent to you.',
  time: '10:58'
}];
function TrackScreen({
  booking,
  stage,
  advance
}) {
  const {
    Button,
    Card,
    StatusBadge,
    BeatIcon,
    BookingTicket
  } = window.BubblesDesignSystem_9de8ef;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      padding: '18px 20px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      fontWeight: 700,
      letterSpacing: '-0.02em'
    }
  }, "Today's wash"), /*#__PURE__*/React.createElement(BookingTicket, {
    time: booking.slot,
    meta: booking.service + ' · ' + booking.address,
    stub: /*#__PURE__*/React.createElement(BeatIcon, {
      size: "sm",
      active: stage
    })
  }), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    style: {
      margin: 0
    }
  }, "Three-beat status"), /*#__PURE__*/React.createElement(BeatIcon, {
    size: "md",
    active: stage,
    animate: stage < 3
  })), STEPS.map((s, i) => {
    const done = i < stage;
    return /*#__PURE__*/React.createElement("div", {
      key: s.key,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        opacity: done ? 1 : 0.38
      }
    }, /*#__PURE__*/React.createElement(StatusBadge, {
      status: s.key,
      size: "sm"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600
      }
    }, s.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: 'var(--text-secondary)'
      }
    }, done ? s.copy : 'Waiting…')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: 'var(--text-muted)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, done ? s.time : '—'));
  })), stage < 3 ? /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: advance
  }, "Simulate next beat") : /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: advance
  }, "Restart demo"));
}
Object.assign(window, {
  TrackScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/TrackScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tech-ar/DaySummary.jsx
try { (() => {
const SUM_RATES = [['فيصل الدوسري', 5, 'شغل نظيف وسريع — شكرًا محمد.'], ['سارة الحربي', 5, ''], ['نورة القحطاني', 4, '']];
function DaySummary({
  jobs,
  onBack,
  pop
}) {
  const {
    Card,
    Button,
    StatusBadge,
    BeatIcon
  } = window.BubblesDesignSystem_9de8ef;
  const [closed, setClosed] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      padding: '0 20px 24px'
    }
  }, /*#__PURE__*/React.createElement(FlowHeader, {
    title: "\u0645\u0644\u062E\u0635 \u0627\u0644\u064A\u0648\u0645",
    onBack: onBack
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      padding: '18px 0 6px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(BeatIcon, {
    size: "lg",
    active: 3
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 700
    }
  }, "\u0627\u0643\u062A\u0645\u0644 \u064A\u0648\u0645\u0643 \u064A\u0627 \u0645\u062D\u0645\u062F"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)'
    }
  }, "\u0627\u0644\u0623\u062D\u062F 23 \u0623\u063A\u0633\u0637\u0633 \xB7 ", /*#__PURE__*/React.createElement(T, null, "09:00\u201316:40"))), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement(LRow, {
    label: "\u0627\u0644\u063A\u0633\u0644\u0627\u062A \u0627\u0644\u0645\u0643\u062A\u0645\u0644\u0629",
    amount: jobs.length + ' من ' + jobs.length
  }), /*#__PURE__*/React.createElement(LRow, {
    label: "\u0641\u064A \u0627\u0644\u0645\u0648\u0639\u062F",
    amount: jobs.length + '/' + jobs.length,
    muted: true
  }), /*#__PURE__*/React.createElement(LRow, {
    label: "\u0627\u0644\u0635\u0648\u0631 \u0627\u0644\u0645\u0648\u062B\u0642\u0629",
    amount: "16",
    muted: true
  }), /*#__PURE__*/React.createElement(LRow, {
    label: "\u0645\u062A\u0648\u0633\u0637 \u0645\u062F\u0629 \u0627\u0644\u063A\u0633\u0644\u0629",
    amount: "42 \u062F\u0642\u064A\u0642\u0629",
    muted: true
  }), /*#__PURE__*/React.createElement(LRow, {
    label: "\u0627\u0644\u0645\u0633\u0627\u0641\u0629 \u0627\u0644\u0645\u0642\u0637\u0648\u0639\u0629",
    amount: "26 \u0643\u0645",
    muted: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "\u062A\u0642\u064A\u064A\u0645\u0627\u062A \u0648\u0635\u0644\u062A \u0627\u0644\u064A\u0648\u0645"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, SUM_RATES.map(([name, stars, note]) => /*#__PURE__*/React.createElement(Card, {
    key: name,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      borderRadius: '50%',
      background: 'var(--violet-100)',
      color: 'var(--violet)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 13.5,
      fontWeight: 700,
      flex: 'none'
    }
  }, name[0]), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700
    }
  }, name), note && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, note)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 13,
      fontWeight: 700,
      color: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Star",
    size: 14
  }), " ", /*#__PURE__*/React.createElement(T, null, stars, ".0")))))), closed ? /*#__PURE__*/React.createElement(Card, {
    style: {
      background: 'var(--yellow-100)',
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: "verified",
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700
    }
  }, "\u0623\u064F\u063A\u0644\u0642 \u0627\u0644\u064A\u0648\u0645"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, "\u0646\u0631\u0627\u0643 \u063A\u062F\u064B\u0627 ", /*#__PURE__*/React.createElement(T, null, "08:00"), " \u2014 \u062A\u0635\u0628\u062D \u0639\u0644\u0649 \u062E\u064A\u0631."))) : /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => {
      setClosed(true);
      pop && pop('أُغلق اليوم — أُبلغت العمليات');
    }
  }, "\u0625\u0646\u0647\u0627\u0621 \u0627\u0644\u064A\u0648\u0645 \u0648\u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0641\u0627\u0646"));
}
Object.assign(window, {
  DaySummary
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tech-ar/DaySummary.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tech-ar/JobFlow.jsx
try { (() => {
const JF_CHK = ['الهيكل الخارجي', 'الزجاج والمرايا', 'الإطارات والجنوط', 'التجفيف النهائي'];
const JF_BEAT = {
  brief: 0,
  enroute: 0,
  arrived: 1,
  washing: 1,
  after: 2,
  done: 3
};
const JF_TITLE = {
  brief: 'تفاصيل المهمة',
  enroute: 'في الطريق',
  arrived: 'قبل الغسيل',
  washing: 'الغسيل جارٍ',
  after: 'التوثيق',
  done: 'اكتملت المهمة'
};
function JobFlow({
  job,
  onClose,
  onDone,
  pop,
  hasMore,
  initialStage,
  frozen,
  reportOpen
}) {
  const {
    Button,
    Card,
    Badge,
    StatusBadge,
    BeatIcon,
    BookingTicket,
    IconButton,
    Checkbox
  } = window.BubblesDesignSystem_9de8ef;
  const [stage, setStage] = React.useState(initialStage || 'brief');
  const [report, setReport] = React.useState(!!reportOpen);
  const [checks, setChecks] = React.useState(frozen ? {
    'الهيكل الخارجي': true,
    'الزجاج والمرايا': true
  } : {});
  const [sec, setSec] = React.useState(frozen ? 760 : 0);
  React.useEffect(() => {
    if (frozen || stage !== 'washing') return;
    const t = setInterval(() => setSec(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [stage]);
  const mmss = String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
  const allChecked = JF_CHK.every(c => checks[c]);
  const go = (s, msg) => {
    setStage(s);
    msg && pop && pop(msg);
  };
  const CustomerCard = ({
    note
  }) => /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 44,
      borderRadius: '50%',
      background: 'var(--violet-100)',
      color: 'var(--violet)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 15,
      fontWeight: 700,
      flex: 'none'
    }
  }, job.customer[0]), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700
    }
  }, job.customer), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, job.addr)), /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": "\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0639\u0645\u064A\u0644"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Phone",
    size: 17
  }))), note && job.gate && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      fontSize: 12.5,
      color: 'var(--text-secondary)',
      background: 'var(--ice-100)',
      borderRadius: 12,
      padding: '9px 12px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "KeyRound",
    size: 14
  }), " ", job.gate));
  const Photos = ({
    kind,
    labels,
    caption
  }) => /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 15,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Camera",
    size: 17
  }), " \u0635\u0648\u0631 ", kind), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, labels.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      flex: 1,
      minWidth: 0,
      height: 130
    }
  }, /*#__PURE__*/React.createElement("image-slot", {
    id: job.id + '-' + kind + '-' + (i + 1),
    shape: "rounded",
    radius: "14",
    placeholder: l
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-muted)'
    }
  }, caption));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      padding: '0 20px 24px'
    }
  }, /*#__PURE__*/React.createElement(FlowHeader, {
    title: JF_TITLE[stage],
    onBack: onClose,
    trailing: /*#__PURE__*/React.createElement(BeatIcon, {
      size: "sm",
      active: JF_BEAT[stage],
      animate: !frozen && stage !== 'done' && stage !== 'brief'
    })
  }), stage === 'brief' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BookingTicket, {
    label: "\u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u0645\u0647\u0645\u0629",
    time: job.slot,
    meta: job.service + ' · ' + job.addr,
    stub: /*#__PURE__*/React.createElement(BeatIcon, {
      size: "sm",
      active: 0
    })
  }), /*#__PURE__*/React.createElement(JobMap, {
    height: 170,
    frozen: frozen
  }), /*#__PURE__*/React.createElement(CustomerCard, {
    note: true
  }), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement(LRow, {
    label: "\u0627\u0644\u0633\u064A\u0627\u0631\u0629",
    amount: job.car,
    muted: true
  }), /*#__PURE__*/React.createElement(LRow, {
    label: "\u0627\u0644\u0644\u0648\u062D\u0629",
    amount: job.plate,
    muted: true
  }), /*#__PURE__*/React.createElement(LRow, {
    label: "\u0627\u0644\u062E\u062F\u0645\u0629",
    amount: job.service,
    muted: true
  }), /*#__PURE__*/React.createElement(LRow, {
    label: "\u0627\u0644\u0645\u062F\u0629 \u0627\u0644\u0645\u062A\u0648\u0642\u0639\u0629",
    amount: '~' + job.mins + ' دقيقة',
    muted: true
  }), /*#__PURE__*/React.createElement(LRow, {
    label: "\u0627\u0644\u062F\u0641\u0639",
    amount: "\u0645\u062F\u0641\u0648\u0639\u0629 \u0645\u0633\u0628\u0642\u064B\u0627",
    muted: true
  })), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "Navigation",
      size: 17
    }),
    onClick: () => go('enroute', 'بدأت التوجه — أبلغنا العميل')
  }, "\u0627\u0628\u062F\u0623 \u0627\u0644\u062A\u0648\u062C\u0647"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: () => setReport(true)
  }, "\u0627\u0644\u0625\u0628\u0644\u0627\u063A \u0639\u0646 \u0645\u0634\u0643\u0644\u0629")), stage === 'enroute' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(JobMap, {
    height: 300,
    route: true,
    eta: '12 د · ' + job.dist,
    frozen: frozen
  }), /*#__PURE__*/React.createElement(CustomerCard, {
    note: true
  }), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => go('arrived', 'وصل — تحدّثت حالة الحجز للعميل')
  }, "\u0648\u0635\u0644\u062A \u2014 \u0639\u0646\u062F \u0627\u0644\u0628\u0648\u0627\u0628\u0629"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: () => setReport(true)
  }, "\u062A\u0639\u0630\u0651\u0631 \u0627\u0644\u0648\u0635\u0648\u0644\u061F \u0623\u0628\u0644\u063A \u0627\u0644\u0639\u0645\u0644\u064A\u0627\u062A")), stage === 'arrived' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: "arrived",
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700
    }
  }, "\u0633\u064F\u062C\u0651\u0644 \u0648\u0635\u0648\u0644\u0643 ", /*#__PURE__*/React.createElement(T, null, "10:31")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, "\u0648\u062B\u0651\u0642 \u062D\u0627\u0644\u0629 \u0627\u0644\u0633\u064A\u0627\u0631\u0629 \u0642\u0628\u0644 \u0627\u0644\u0628\u062F\u0621."))), /*#__PURE__*/React.createElement(Photos, {
    kind: "\u0642\u0628\u0644",
    labels: ['قبل — أمامية', 'قبل — جانبية'],
    caption: "\u0635\u0648\u0631 \xAB\u0642\u0628\u0644\xBB \u062A\u062D\u0645\u064A\u0643 \u0639\u0646\u062F \u0623\u064A \u0645\u0644\u0627\u062D\u0638\u0629 \u0645\u0646 \u0627\u0644\u0639\u0645\u064A\u0644 \u2014 \u0644\u0627 \u062A\u0638\u0647\u0631 \u0625\u0644\u0627 \u0644\u0644\u062C\u0648\u062F\u0629."
  }), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "Droplets",
      size: 17
    }),
    onClick: () => go('washing')
  }, "\u0627\u0628\u062F\u0623 \u0627\u0644\u063A\u0633\u064A\u0644"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: () => setReport(true)
  }, "\u0627\u0644\u0625\u0628\u0644\u0627\u063A \u0639\u0646 \u0645\u0634\u0643\u0644\u0629")), stage === 'washing' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      padding: '26px 16px'
    }
  }, /*#__PURE__*/React.createElement(BeatIcon, {
    size: "md",
    active: 1,
    animate: !frozen
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 34,
      fontWeight: 700,
      fontVariantNumeric: 'tabular-nums'
    }
  }, /*#__PURE__*/React.createElement(T, null, mmss)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-muted)'
    }
  }, job.service, " \xB7 \u0627\u0644\u0645\u062A\u0648\u0642\u0639 ", /*#__PURE__*/React.createElement(T, null, "~", job.mins), " \u062F\u0642\u064A\u0642\u0629")), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    style: {
      margin: 0
    }
  }, "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0625\u0646\u0647\u0627\u0621"), JF_CHK.map(c => /*#__PURE__*/React.createElement(Checkbox, {
    key: c,
    label: c,
    checked: !!checks[c],
    onChange: e => setChecks(k => ({
      ...k,
      [c]: e.target.checked
    }))
  }))), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    disabled: !allChecked,
    style: {
      opacity: allChecked ? 1 : 0.45
    },
    onClick: () => allChecked && go('after', 'الغسيل اكتمل — باقي التوثيق')
  }, "\u0627\u0643\u062A\u0645\u0644 \u0627\u0644\u063A\u0633\u064A\u0644")), stage === 'after' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: "washed",
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700
    }
  }, "\u0627\u0643\u062A\u0645\u0644 \u0627\u0644\u063A\u0633\u064A\u0644 ", /*#__PURE__*/React.createElement(T, null, "10:52")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, "\u0627\u0644\u062A\u0642\u0637 \u0635\u0648\u0631 \u0627\u0644\u0646\u062A\u064A\u062C\u0629 \u0644\u0625\u0631\u0633\u0627\u0644\u0647\u0627 \u0644\u0644\u0639\u0645\u064A\u0644."))), /*#__PURE__*/React.createElement(Photos, {
    kind: "\u0628\u0639\u062F",
    labels: ['بعد — أمامية', 'بعد — جانبية'],
    caption: "\u062A\u064F\u0631\u0633\u0644 \u0644\u0644\u0639\u0645\u064A\u0644 \u0645\u0639 \u062E\u062A\u0645 \u0627\u0644\u062C\u0648\u062F\u0629 \u0639\u0646\u062F \u0627\u0644\u062A\u0623\u0643\u064A\u062F."
  }), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "BadgeCheck",
      size: 17
    }),
    onClick: () => go('done', 'تأكد — أُرسل التوثيق للعميل')
  }, "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0635\u0648\u0631 \u0648\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062C\u0648\u062F\u0629")), stage === 'done' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, {
    style: {
      background: 'var(--yellow-100)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: "verified",
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700
    }
  }, "\u062A\u0623\u0643\u062F\u062A \u0627\u0644\u063A\u0633\u0644\u0629"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, "\u0648\u0635\u0644\u062A \u0627\u0644\u0635\u0648\u0631 \u0644\u0644\u0639\u0645\u064A\u0644 \u2014 \u0634\u0643\u0631\u064B\u0627 \u064A\u0627 \u0645\u062D\u0645\u062F.")))), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement(LRow, {
    label: "\u0627\u0644\u0645\u062F\u0629 \u0627\u0644\u0641\u0639\u0644\u064A\u0629",
    amount: "38 \u062F\u0642\u064A\u0642\u0629",
    muted: true
  }), /*#__PURE__*/React.createElement(LRow, {
    label: "\u0627\u0644\u0635\u0648\u0631 \u0627\u0644\u0645\u0631\u0641\u0648\u0639\u0629",
    amount: "4",
    muted: true
  }), /*#__PURE__*/React.createElement(LRow, {
    label: "\u0627\u0644\u0645\u0648\u0639\u062F",
    amount: "\u0641\u064A \u0627\u0644\u0648\u0642\u062A",
    muted: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-muted)'
    }
  }, "\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0639\u0645\u064A\u0644 \u0633\u064A\u0636\u0627\u0641 \u0625\u0644\u0649 \u0645\u0644\u0641\u0643 \u0639\u0646\u062F \u0648\u0635\u0648\u0644\u0647."), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => onDone(job.id)
  }, hasMore ? 'المهمة التالية' : 'عرض ملخص اليوم')), /*#__PURE__*/React.createElement(ReportDialog, {
    open: report,
    onClose: () => setReport(false),
    pop: pop
  }));
}
Object.assign(window, {
  JobFlow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tech-ar/JobFlow.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tech-ar/OpsChat.jsx
try { (() => {
function OpsChat({
  onBack
}) {
  const {
    IconButton
  } = window.BubblesDesignSystem_9de8ef;
  const [msgs, setMsgs] = React.useState([{
    who: 'ops',
    t: '08:12',
    text: 'صباح الخير محمد — موعد 12:00 انتقل إلى 12:30 بطلب العميل.'
  }, {
    who: 'me',
    t: '08:14',
    text: 'تمام، وصلني.'
  }, {
    who: 'ops',
    t: '10:05',
    text: 'تذكير: رمز بوابة عميل 10:30 هو 4321.'
  }]);
  const [draft, setDraft] = React.useState('');
  const send = text => {
    if (!text.trim()) return;
    setMsgs(m => [...m, {
      who: 'me',
      t: 'الآن',
      text
    }]);
    setDraft('');
    setTimeout(() => setMsgs(m => [...m, {
      who: 'ops',
      t: 'الآن',
      text: 'وصلنا — نتابع معك الآن.'
    }]), 1100);
  };
  const QUICK = ['تأخرت 10 دقائق عن الموعد التالي', 'أحتاج تعبئة مواد', 'مشكلة في الفان'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - 24px)',
      padding: '0 20px'
    }
  }, /*#__PURE__*/React.createElement(FlowHeader, {
    title: "\u0639\u0645\u0644\u064A\u0627\u062A \u0633\u0645\u0627",
    onBack: onBack,
    trailing: /*#__PURE__*/React.createElement(IconButton, {
      "aria-label": "\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0639\u0645\u0644\u064A\u0627\u062A"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "Phone",
      size: 17
    }))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      color: 'var(--text-muted)',
      padding: '0 6px 12px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--violet)'
    }
  }), " \u0645\u062A\u0635\u0644\u0648\u0646 \u0627\u0644\u0622\u0646 \xB7 \u064A\u0631\u062F\u0648\u0646 \u062E\u0644\u0627\u0644 \u062F\u0642\u0627\u0626\u0642"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, msgs.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      alignSelf: m.who === 'me' ? 'flex-end' : 'flex-start',
      maxWidth: '80%',
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 14px',
      borderRadius: 18,
      fontSize: 13.5,
      lineHeight: 1.6,
      background: m.who === 'me' ? 'var(--violet)' : 'var(--white)',
      color: m.who === 'me' ? 'var(--white)' : 'var(--text-primary)',
      border: m.who === 'me' ? 'none' : '1.5px solid var(--border-subtle)',
      borderStartStartRadius: m.who === 'me' ? 18 : 6,
      borderStartEndRadius: m.who === 'me' ? 6 : 18
    }
  }, m.text), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10.5,
      color: 'var(--text-muted)',
      padding: '0 6px',
      alignSelf: m.who === 'me' ? 'flex-end' : 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(T, null, m.t))))), /*#__PURE__*/React.createElement("div", {
    className: "hscroll",
    style: {
      display: 'flex',
      gap: 7,
      overflowX: 'auto',
      padding: '14px 0 10px',
      scrollbarWidth: 'none'
    }
  }, QUICK.map(q => /*#__PURE__*/React.createElement("button", {
    key: q,
    onClick: () => send(q),
    style: {
      font: 'inherit',
      fontFamily: 'var(--font-arabic)',
      flex: 'none',
      fontSize: 12.5,
      fontWeight: 600,
      padding: '8px 13px',
      borderRadius: 999,
      border: '1.5px solid var(--border-strong)',
      background: 'var(--white)',
      cursor: 'pointer',
      color: 'var(--text-primary)'
    }
  }, q))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      paddingBottom: 18
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: draft,
    onChange: e => setDraft(e.target.value),
    onKeyDown: e => e.key === 'Enter' && send(draft),
    placeholder: "\u0627\u0643\u062A\u0628 \u0631\u0633\u0627\u0644\u0629 \u0644\u0644\u0639\u0645\u0644\u064A\u0627\u062A\u2026",
    style: {
      flex: 1,
      font: 'inherit',
      fontFamily: 'var(--font-arabic)',
      fontSize: 13.5,
      padding: '11px 15px',
      borderRadius: 999,
      border: '1.5px solid var(--border-strong)',
      background: 'var(--white)',
      outline: 'none'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => send(draft),
    "aria-label": "\u0625\u0631\u0633\u0627\u0644",
    style: {
      width: 42,
      height: 42,
      borderRadius: '50%',
      border: 'none',
      background: 'var(--violet)',
      color: 'var(--white)',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Send",
    size: 17
  }))));
}
Object.assign(window, {
  OpsChat
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tech-ar/OpsChat.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tech-ar/ScheduleScreen.jsx
try { (() => {
const WK = [['السبت', '22', 3], ['الأحد', '23', 4], ['الاثنين', '24', 4], ['الثلاثاء', '25', 2], ['الأربعاء', '26', 5], ['الخميس', '27', 6], ['الجمعة', '28', 0]];
const WK_OTHER = [['09:30–10:00', 'حي الربيع', 'غسلة خارجية'], ['13:00–13:30', 'حي الصحافة', 'غسلة خارجية + داخلية']];
function ScheduleScreen({
  jobs,
  pop
}) {
  const {
    Card,
    Button,
    Switch,
    Badge
  } = window.BubblesDesignSystem_9de8ef;
  const [day, setDay] = React.useState('الأحد');
  const [shifts, setShifts] = React.useState({
    m: true,
    n: true,
    e: true
  });
  const count = (WK.find(w => w[0] === day) || [])[2];
  const rows = day === 'الأحد' ? jobs.map(j => [j.slot, j.district, j.service]) : count === 0 ? [] : WK_OTHER.slice(0, Math.min(count, 2));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      padding: '18px 20px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 700
    }
  }, "\u0627\u0644\u062C\u062F\u0648\u0644"), /*#__PURE__*/React.createElement("div", {
    className: "hscroll",
    style: {
      display: 'flex',
      gap: 7,
      overflowX: 'auto',
      margin: '0 -20px',
      padding: '0 20px 4px',
      scrollbarWidth: 'none'
    }
  }, WK.map(([d, n, c]) => {
    const on = d === day;
    return /*#__PURE__*/React.createElement("button", {
      key: d,
      onClick: () => setDay(d),
      style: {
        font: 'inherit',
        fontFamily: 'var(--font-arabic)',
        flex: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        padding: '10px 13px',
        borderRadius: 16,
        border: on ? 'none' : '1.5px solid var(--border-subtle)',
        background: on ? 'var(--violet)' : 'var(--white)',
        color: on ? 'var(--white)' : 'var(--text-primary)',
        cursor: 'pointer',
        minWidth: 62
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 700
      }
    }, d), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 15,
        fontWeight: 700,
        fontVariantNumeric: 'tabular-nums'
      }
    }, /*#__PURE__*/React.createElement(T, null, n)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10.5,
        fontWeight: 600,
        opacity: 0.75
      }
    }, c === 0 ? 'إجازة' : c + ' غسلات'));
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "\u0645\u0647\u0627\u0645 ", day, " ", day === 'الأحد' && /*#__PURE__*/React.createElement(Badge, {
    tone: "violet"
  }, "\u0627\u0644\u064A\u0648\u0645")), rows.length === 0 ? /*#__PURE__*/React.createElement(Card, {
    style: {
      textAlign: 'center',
      color: 'var(--text-muted)',
      fontSize: 13.5
    }
  }, "\u064A\u0648\u0645 \u0625\u062C\u0627\u0632\u0629 \u2014 \u0627\u0633\u062A\u0631\u062D \u0648\u0627\u0631\u062C\u0639 \u0628\u0646\u0634\u0627\u0637.") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, rows.map(([slot, dist, srv], i) => /*#__PURE__*/React.createElement(Card, {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      fontWeight: 700,
      fontVariantNumeric: 'tabular-nums'
    }
  }, /*#__PURE__*/React.createElement(T, null, slot)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, srv), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, dist)))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "\u062A\u0648\u0641\u0631\u064A \u0641\u064A ", day), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, [['m', 'الفترة الصباحية', '08:00–12:00'], ['n', 'فترة الظهيرة', '12:00–16:00'], ['e', 'الفترة المسائية', '16:00–20:00']].map(([k, t, h]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14.5,
      fontWeight: 600
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, /*#__PURE__*/React.createElement(T, null, h))), /*#__PURE__*/React.createElement(Switch, {
    checked: shifts[k],
    onChange: e => {
      setShifts(s => ({
        ...s,
        [k]: e.target.checked
      }));
      pop && pop('حُدّث توفرك — أُبلغت العمليات');
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u062A\u0648\u0641\u0631 \u064A\u064F\u0642\u0641\u0644 \u0642\u0628\u0644 48 \u0633\u0627\u0639\u0629 \u0645\u0646 \u0627\u0644\u064A\u0648\u0645."))), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: () => pop && pop('أُرسل طلب الإجازة للعمليات')
  }, "\u0637\u0644\u0628 \u0625\u062C\u0627\u0632\u0629"));
}
Object.assign(window, {
  ScheduleScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tech-ar/ScheduleScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tech-ar/Shared.jsx
try { (() => {
function Icon({
  name,
  size = 20
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !window.lucide) return;
    ref.current.innerHTML = '';
    const node = lucide.icons && lucide.icons[name] || lucide[name];
    if (!node) return;
    const el = lucide.createElement(node);
    el.setAttribute('width', size);
    el.setAttribute('height', size);
    ref.current.appendChild(el);
  }, [name, size]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      flex: 'none'
    }
  });
}
function SectionLabel({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: 'var(--text-muted)',
      margin: '0 0 10px',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      ...style
    }
  }, children);
}
function T({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    dir: "ltr",
    style: {
      fontVariantNumeric: 'tabular-nums',
      unicodeBidi: 'isolate',
      ...style
    }
  }, children);
}
function LRow({
  label,
  amount,
  muted,
  strong
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      fontSize: strong ? 17 : 14.5,
      fontWeight: strong ? 700 : muted ? 400 : 500,
      color: muted ? 'var(--text-muted)' : 'var(--text-primary)',
      paddingTop: strong ? 10 : 0,
      borderTop: strong ? '1.5px solid var(--border-subtle)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontVariantNumeric: 'tabular-nums'
    }
  }, amount));
}
function FlowHeader({
  title,
  onBack,
  trailing
}) {
  const {
    IconButton
  } = window.BubblesDesignSystem_9de8ef;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '14px 16px 4px'
    }
  }, onBack && /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": "\u0631\u062C\u0648\u0639",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "ArrowRight",
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 19,
      fontWeight: 700,
      flex: 1
    }
  }, title), trailing);
}
function Bar({
  value,
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      borderRadius: 999,
      background: 'var(--ink-06)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: (value || 0) + '%',
      height: '100%',
      borderRadius: 999,
      background: color || 'var(--violet)',
      transition: 'width 400ms cubic-bezier(.2,.8,.2,1)'
    }
  }));
}
function JobMap({
  height = 180,
  route,
  eta,
  frozen
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !window.L) return;
    const map = L.map(ref.current, {
      zoomControl: false,
      dragging: !frozen,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: !frozen
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    const from = [24.7402, 46.6338],
      to = [24.7523, 46.6210];
    const path = [from, [24.7431, 46.6312], [24.7468, 46.6296], [24.7489, 46.6259], to];
    if (route) {
      L.polyline(path, {
        color: '#5A42FF',
        weight: 4,
        opacity: 0.9
      }).addTo(map);
      L.circleMarker(from, {
        radius: 8,
        color: '#fff',
        weight: 3,
        fillColor: '#5A42FF',
        fillOpacity: 1
      }).addTo(map);
    }
    L.circleMarker(to, {
      radius: 9,
      color: '#fff',
      weight: 3,
      fillColor: '#17162E',
      fillOpacity: 1
    }).addTo(map);
    if (route) map.fitBounds(L.latLngBounds(path).pad(0.2));else map.setView(to, 15);
    setTimeout(() => map.invalidateSize(), 150);
    return () => map.remove();
  }, [route]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height,
      borderRadius: 18,
      overflow: 'hidden',
      border: '1.5px solid var(--border-subtle)',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 0
    }
  }), eta && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 10,
      insetInlineStart: 10,
      zIndex: 500,
      background: 'var(--ink)',
      color: 'var(--white)',
      borderRadius: 999,
      padding: '6px 12px',
      fontSize: 12.5,
      fontWeight: 700,
      display: 'inline-flex',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Navigation",
    size: 13
  }), /*#__PURE__*/React.createElement(T, null, eta)));
}
function ReportDialog({
  open,
  onClose,
  pop
}) {
  const {
    Dialog,
    Radio,
    Button
  } = window.BubblesDesignSystem_9de8ef;
  const [reason, setReason] = React.useState('gate');
  const RS = [['gate', 'البوابة مغلقة — لا أستطيع الدخول'], ['noshow', 'العميل لا يرد على الاتصال'], ['car', 'السيارة غير موجودة في الموقع'], ['supply', 'نقص مواد أو عطل بالأدوات'], ['other', 'سبب آخر']];
  return /*#__PURE__*/React.createElement(Dialog, {
    open: open,
    title: "\u0627\u0644\u0625\u0628\u0644\u0627\u063A \u0639\u0646 \u0645\u0634\u0643\u0644\u0629",
    onClose: onClose,
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: onClose
    }, "\u0625\u0644\u063A\u0627\u0621"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => {
        onClose();
        pop && pop('وصل بلاغك — سترد العمليات خلال دقائق');
      }
    }, "\u0625\u0631\u0633\u0627\u0644 \u0644\u0644\u0639\u0645\u0644\u064A\u0627\u062A"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, RS.map(([k, t]) => /*#__PURE__*/React.createElement(Radio, {
    key: k,
    name: "rep",
    label: t,
    checked: reason === k,
    onChange: () => setReason(k)
  })), /*#__PURE__*/React.createElement("textarea", {
    placeholder: "\u062A\u0641\u0627\u0635\u064A\u0644 \u0625\u0636\u0627\u0641\u064A\u0629 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)\u2026",
    rows: "2",
    style: {
      font: 'inherit',
      fontSize: 13.5,
      fontFamily: 'var(--font-arabic)',
      padding: '10px 13px',
      borderRadius: 14,
      border: '1.5px solid var(--border-strong)',
      background: 'var(--white)',
      resize: 'none',
      outline: 'none'
    }
  })));
}
const TECH = {
  name: 'محمد العتيبي',
  short: 'م',
  role: 'فنّي أول · شمال الرياض',
  van: 'فان 12',
  rating: '4.9'
};
const TECH_JOBS = [{
  id: 'j1',
  slot: '09:00–09:30',
  customer: 'سارة الحربي',
  service: 'غسلة خارجية',
  car: 'تويوتا كامري — رمادي',
  plate: 'ح ن د 8172',
  district: 'حي الياسمين',
  addr: 'فيلا 44، شارع الأمير سعود',
  dist: '3.1 كم',
  mins: 30,
  status: 'done'
}, {
  id: 'j2',
  slot: '10:30–11:00',
  customer: 'فيصل الدوسري',
  service: 'غسلة خارجية + واكس',
  car: 'لكزس LX — أبيض',
  plate: 'أ ب ج 4519',
  district: 'حي النخيل',
  addr: 'فيلا 12، حي النخيل',
  dist: '4.8 كم',
  mins: 45,
  gate: 'البوابة الرمادية يسار المدخل — السيارة داخل المظلة، رمز البوابة 4321.',
  status: 'next'
}, {
  id: 'j3',
  slot: '12:30–13:00',
  customer: 'نورة القحطاني',
  service: 'غسلة خارجية',
  car: 'هيونداي توسان — أسود',
  plate: 'د ل م 2210',
  district: 'حي الملقا',
  addr: 'برج الواحة، موقف B2',
  dist: '7.2 كم',
  mins: 30,
  status: 'queued'
}, {
  id: 'j4',
  slot: '16:00–16:30',
  customer: 'عبدالله السبيعي',
  service: 'غسلة خارجية + داخلية',
  car: 'جي إم سي يوكن — أسود',
  plate: 'ط ع ف 9954',
  district: 'حي حطين',
  addr: 'فيلا 8، شارع التوت',
  dist: '6.1 كم',
  mins: 50,
  status: 'queued'
}];
Object.assign(window, {
  Icon,
  SectionLabel,
  T,
  LRow,
  FlowHeader,
  Bar,
  JobMap,
  ReportDialog,
  TECH,
  TECH_JOBS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tech-ar/Shared.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tech-ar/TechProfile.jsx
try { (() => {
function TechProfile({
  pop,
  onOps
}) {
  const {
    Card,
    Button,
    Switch,
    Badge,
    IconButton
  } = window.BubblesDesignSystem_9de8ef;
  const [report, setReport] = React.useState(false);
  const [notif, setNotif] = React.useState(true);
  const [sms, setSms] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      padding: '18px 20px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 700
    }
  }, "\u062D\u0633\u0627\u0628\u064A"), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 54,
      height: 54,
      borderRadius: '50%',
      background: 'var(--violet-100)',
      color: 'var(--violet)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 19,
      fontWeight: 700,
      flex: 'none'
    }
  }, TECH.short), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16.5,
      fontWeight: 700
    }
  }, TECH.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, TECH.role)), /*#__PURE__*/React.createElement(Badge, {
    tone: "yellow"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Star",
    size: 12
  }), " ", /*#__PURE__*/React.createElement(T, null, TECH.rating))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, [['غسلات الأسبوع', '32'], ['في الموعد', '98%'], ['صور موثقة', '128']].map(([t, v]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4,
      padding: '14px 6px',
      borderRadius: 16,
      background: 'var(--white)',
      border: '1.5px solid var(--border-subtle)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 19,
      fontWeight: 700,
      fontVariantNumeric: 'tabular-nums'
    }
  }, /*#__PURE__*/React.createElement(T, null, v)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--text-muted)'
    }
  }, t)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "\u0627\u0644\u0641\u0627\u0646 \u0648\u0627\u0644\u0645\u0648\u0627\u062F"), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 13,
      background: 'var(--surface-booking-soft)',
      color: 'var(--violet)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Truck",
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700
    }
  }, TECH.van, " \xB7 \u0633\u0645\u0627"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, "\u0627\u0644\u0641\u062D\u0635 \u0627\u0644\u062F\u0648\u0631\u064A \u0627\u0644\u0642\u0627\u062F\u0645: 4 \u0633\u0628\u062A\u0645\u0628\u0631"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: 12.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      fontWeight: 600
    }
  }, "\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0645\u0648\u0627\u062F"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement(T, null, "35%"))), /*#__PURE__*/React.createElement(Bar, {
    value: 35,
    color: "var(--guava)"
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary",
    onClick: () => pop && pop('أُرسل طلب التعبئة — تستلمها صباح الغد')
  }, "\u0627\u0637\u0644\u0628 \u062A\u0639\u0628\u0626\u0629 \u0645\u0648\u0627\u062F"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "\u0639\u0645\u0644\u064A\u0627\u062A \u0633\u0645\u0627"), /*#__PURE__*/React.createElement(Card, {
    style: {
      background: 'var(--violet-100)',
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: 'var(--white)',
      color: 'var(--violet)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Headphones",
    size: 19
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14.5,
      fontWeight: 700
    }
  }, "\u0641\u0631\u064A\u0642 \u0627\u0644\u0639\u0645\u0644\u064A\u0627\u062A"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-secondary)'
    }
  }, "\u0645\u062A\u0635\u0644\u0648\u0646 \u064A\u0648\u0645\u064A\u064B\u0627 ", /*#__PURE__*/React.createElement(T, null, "07:00\u201323:00"))), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: onOps
  }, "\u0645\u062D\u0627\u062F\u062B\u0629"), /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": "\u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0639\u0645\u0644\u064A\u0627\u062A"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Phone",
    size: 17
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A"), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14.5,
      fontWeight: 600
    }
  }, "\u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u0647\u0627\u0645 \u0627\u0644\u062C\u062F\u064A\u062F\u0629"), /*#__PURE__*/React.createElement(Switch, {
    checked: notif,
    onChange: e => setNotif(e.target.checked)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14.5,
      fontWeight: 600
    }
  }, "\u062A\u0646\u0628\u064A\u0647 \u0631\u0633\u0627\u0626\u0644 \u0646\u0635\u064A\u0629"), /*#__PURE__*/React.createElement(Switch, {
    checked: sms,
    onChange: e => setSms(e.target.checked)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: 14.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, "\u0627\u0644\u0644\u063A\u0629"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "\u0627\u0644\u0639\u0631\u0628\u064A\u0629")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: 14.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600
    }
  }, "\u0627\u0644\u062C\u0648\u0627\u0644"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, /*#__PURE__*/React.createElement(T, null, "+966 5\u2022 \u2022\u2022\u2022 \u2022\u202241"))))), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => setReport(true)
  }, "\u0627\u0644\u0625\u0628\u0644\u0627\u063A \u0639\u0646 \u0645\u0634\u0643\u0644\u0629"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C"), /*#__PURE__*/React.createElement(ReportDialog, {
    open: report,
    onClose: () => setReport(false),
    pop: pop
  }));
}
Object.assign(window, {
  TechProfile
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tech-ar/TechProfile.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tech-ar/TodayScreen.jsx
try { (() => {
function TodayScreen({
  jobs,
  avail,
  setAvail,
  onStart,
  onSummary,
  onOps
}) {
  const {
    Button,
    Card,
    Badge,
    StatusBadge,
    BookingTicket,
    BeatIcon,
    Switch,
    IconButton
  } = window.BubblesDesignSystem_9de8ef;
  const done = jobs.filter(j => j.status === 'done').length;
  const next = jobs.find(j => j.status === 'next');
  const rest = jobs.filter(j => j !== next);
  const allDone = done === jobs.length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      padding: '18px 20px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'var(--white)',
      border: '1.5px solid var(--border-subtle)',
      borderRadius: 999,
      padding: '7px 13px',
      fontSize: 12.5,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "CalendarDays",
    size: 14
  }), " \u0627\u0644\u0623\u062D\u062F 23 \u0623\u063A\u0633\u0637\u0633"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Switch, {
    label: "\u0645\u062A\u0627\u062D",
    checked: avail,
    onChange: e => setAvail(e.target.checked)
  }), /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": "\u0639\u0645\u0644\u064A\u0627\u062A \u0633\u0645\u0627",
    onClick: onOps
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Headphones",
    size: 18
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 700
    }
  }, "\u0635\u0628\u0627\u062D \u0627\u0644\u0646\u0648\u0631 \u064A\u0627 \u0645\u062D\u0645\u062F"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14.5,
      color: 'var(--text-secondary)',
      marginTop: 2
    }
  }, allDone ? 'اكتمل يومك — كل الغسلات تأكدت.' : 'عندك ' + jobs.length + ' غسلات اليوم — لمعة في وقتها.')), !avail && /*#__PURE__*/React.createElement(Card, {
    style: {
      background: 'var(--ink-06)',
      boxShadow: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 13.5,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Moon",
    size: 16
  }), " \u0623\u0646\u062A \u063A\u064A\u0631 \u0645\u062A\u0627\u062D \u2014 \u0644\u0646 \u062A\u064F\u0633\u0646\u062F \u0644\u0643 \u0645\u0647\u0627\u0645 \u062C\u062F\u064A\u062F\u0629."), /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    style: {
      margin: 0
    }
  }, "\u062A\u0642\u062F\u0645 \u0627\u0644\u064A\u0648\u0645"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement(T, null, done, "/", jobs.length), " \u0645\u0643\u062A\u0645\u0644\u0629")), /*#__PURE__*/React.createElement(Bar, {
    value: done / jobs.length * 100
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 11.5,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(T, null, "09:00"), " \u0627\u0644\u0628\u062F\u0627\u064A\u0629"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(T, null, "16:30"), " \u0622\u062E\u0631 \u0645\u0648\u0639\u062F"))), allDone ? /*#__PURE__*/React.createElement(Card, {
    style: {
      background: 'var(--yellow-100)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: "verified",
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15.5,
      fontWeight: 700
    }
  }, "\u064A\u0648\u0645\u0643 \u0627\u0643\u062A\u0645\u0644"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement(T, null, jobs.length), " \u063A\u0633\u0644\u0627\u062A \u062A\u0623\u0643\u062F\u062A \u2014 \u0643\u0644\u0647\u0627 \u0641\u064A \u0627\u0644\u0645\u0648\u0639\u062F."))), /*#__PURE__*/React.createElement(Button, {
    onClick: onSummary
  }, "\u0639\u0631\u0636 \u0645\u0644\u062E\u0635 \u0627\u0644\u064A\u0648\u0645")) : next && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "\u0645\u0647\u0645\u062A\u0643 \u0627\u0644\u062A\u0627\u0644\u064A\u0629"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(BookingTicket, {
    label: "\u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u0645\u0647\u0645\u0629",
    time: next.slot,
    meta: next.service + ' · ' + next.district,
    stub: /*#__PURE__*/React.createElement(BeatIcon, {
      size: "sm",
      active: 0
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      fontSize: 12.5,
      color: 'var(--text-secondary)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "MapPin",
    size: 14
  }), " ", /*#__PURE__*/React.createElement(T, null, next.dist)), "\xB7", /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "Clock",
    size: 14
  }), " ", /*#__PURE__*/React.createElement(T, null, "~", next.mins), " \u062F\u0642\u064A\u0642\u0629"), "\xB7", /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, next.car)), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "Navigation",
      size: 17
    }),
    onClick: () => onStart(next)
  }, "\u0627\u0628\u062F\u0623 \u0627\u0644\u0645\u0647\u0645\u0629"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, allDone ? 'غسلات اليوم' : 'بقية اليوم'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, rest.map(j => /*#__PURE__*/React.createElement(Card, {
    key: j.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      opacity: j.status === 'done' ? 0.82 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14.5,
      fontWeight: 700,
      fontVariantNumeric: 'tabular-nums',
      minWidth: 46
    }
  }, /*#__PURE__*/React.createElement(T, null, j.slot.split('–')[0])), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14.5,
      fontWeight: 700,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, j.service), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-secondary)'
    }
  }, j.district, " \xB7 ", j.car)), j.status === 'done' ? /*#__PURE__*/React.createElement(StatusBadge, {
    status: "verified",
    size: "sm"
  }) : /*#__PURE__*/React.createElement(Badge, {
    tone: "ice"
  }, "\u0642\u0627\u062F\u0645\u0629"))))));
}
Object.assign(window, {
  TodayScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tech-ar/TodayScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tech-ar/image-slot.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever a design needs an image.
 * You control the slot's shape; it sizes to its container by default. When the search_stock_photos tool
 * is available, prefill the slot by default — write the photo's URL into
 * src (with credit/credit-href); the user can still fill or replace it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The sidecar is a SIBLING of the HTML file that uses this component: the
 * read is a document-relative fetch, and the host resolves the bridge's
 * sidecar writes into the previewed file's directory to match (same
 * contract as design_canvas.jsx). Pages in the same directory share one
 * sidecar; keep slot ids distinct across them.
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          Initial framing baseline: cover | contain.   (default 'cover')
 *                cover starts the image filling the frame (overflow cropped);
 *                contain starts it fully visible (letterboxed). Either way the
 *                user can always pan/scale from there — double-click, or the
 *                Edit control, enters reframe mode (drag to move, scroll or
 *                corner-handles to scale; Escape / click-out commits). The
 *                crop persists alongside the image in the sidecar.
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. Prefill it with a real
 *                photo via search_stock_photos when that tool is available
 *                (set credit/credit-href from the result). A user drop
 *                overrides it; clearing the drop reveals src again.
 *   credit       Attribution text shown as a small overlay at the
 *                bottom-left of the filled slot. REQUIRED whenever src
 *                points at any Unsplash host (images.unsplash.com,
 *                plus.unsplash.com, …): an Unsplash src with no credit
 *                renders an error tile INSTEAD of the photo (Unsplash
 *                terms forbid showing their photos unattributed). Use the
 *                exact form 'Photo by {photographer name} on Unsplash' —
 *                the overlay then links the name to credit-href and
 *                'Unsplash' to the Unsplash homepage, and links back to
 *                unsplash.com automatically get the required utm referral
 *                params appended at render time. The credit belongs to
 *                the src image, so it only shows while src is what's
 *                displayed — a user-dropped image hides it.
 *   credit-href  Link for the photographer's name in the credit overlay
 *                (their Unsplash profile URL from the stock-photo search
 *                results). http(s) URLs only — anything else renders the
 *                name as plain text.
 *
 * Sizing: the slot fills its container by default (width/height 100%).
 * Put it in a sized wrapper — absolutely positioned, a grid cell, a fixed
 * frame — and it takes exactly that box. When the parent's height is
 * indefinite (ordinary flow), it falls back to full width at a 3:2 aspect
 * ratio instead of collapsing. In a shrink-to-fit parent (a float,
 * width:max-content, an unsized absolute wrapper), percentages have
 * nothing to resolve against — size the slot or its wrapper explicitly
 * there. For a fixed-size slot, set
 * width/height on the element itself (inline style), which overrides the
 * default. When
 * layering content above a slot (full-bleed layouts), make the overlay
 * click-through — pointer-events: none on scrims/text plates, re-enabled
 * on interactive children — so the slot's hover controls stay reachable.
 * Keep the slot's bottom-left corner visually clear as well: the credit
 * overlay renders there, and a dark fade or text plate covering it hides
 * the attribution Unsplash's terms require — end the fade above that
 * corner, or keep it nearly transparent where the credit sits.
 *
 * Usage:
 *   <div style="position:relative;width:100%;height:100%">      <!-- full-bleed: -->
 *     <image-slot id="bg" shape="rect"></image-slot>            <!-- fills the wrapper -->
 *   </div>
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.image-slots.state.json';

  // Unsplash terms require visible attribution wherever their photos
  // display, and every link back to unsplash.com must carry utm referral
  // params. Two render-time rules enforce that here:
  //  - an Unsplash-src slot with NO credit attribute renders an error
  //    tile INSTEAD of the photo (an uncredited Unsplash photo on screen
  //    is itself the terms violation, so it never renders bare);
  //  - rendered credit links pointing at unsplash.com get the referral
  //    params appended when absent (credit-href values live in page
  //    content that can't be edited after the fact).
  // Keep the utm_source value in sync with UTM_SOURCE in
  // platform/web-agent/unsplash.ts — this file is a project-local
  // artifact and cannot import it (equality is pinned by tests).
  const UNSPLASH_HOMEPAGE_HREF = 'https://unsplash.com/?utm_source=claude_design&utm_medium=referral';
  // Host rule mirrors the hotlink validator that admits Unsplash srcs into
  // pages in the first place (cdn$ in unsplash.ts: apex or any subdomain)
  // — Unsplash+ results serve from plus.unsplash.com, not just images.*,
  // and an admitted-but-uncredited photo must error whatever unsplash
  // host it rides on.
  // Trailing-dot FQDNs (images.unsplash.com.) are the same host to the
  // browser but would miss the regex — strip one dot so the check fails
  // CLOSED (unrecognized-but-real Unsplash srcs must error, not render).
  const isUnsplashHost = u => {
    try {
      return /(^|\.)unsplash\.com$/.test(new URL(u, document.baseURI).hostname.replace(/\.$/, ''));
    } catch {
      return false;
    }
  };
  // Render-time referral normalization for links back to Unsplash:
  // appends utm_source/utm_medium when absent, preserves every existing
  // query param, never overwrites an existing utm_source, and passes
  // non-Unsplash URLs through untouched. Input is an ABSOLUTE validated
  // http(s) URL (the credit render funnel resolves + validates first).
  const withReferral = href => {
    try {
      const u = new URL(href);
      if (!/(^|\.)unsplash\.com$/.test(u.hostname.replace(/\.$/, ''))) {
        return href;
      }
      if (!u.searchParams.has('utm_source')) {
        u.searchParams.set('utm_source', 'claude_design');
      }
      if (!u.searchParams.has('utm_medium')) {
        u.searchParams.set('utm_medium', 'referral');
      }
      return u.toString();
    } catch (e) {
      return href;
    }
  };
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  // Unload-time flush: save()'s serialization defers a mid-RTT re-fire to a
  // .then that never runs in an unloading document, silently dropping a
  // pagehide commit. Post the current slots immediately instead — content
  // is a superset snapshot of any in-flight save's, the write is a
  // whole-file last-writer-wins replace, and postMessage FIFO delivers it
  // to the host after the in-flight one, so a backend-side reorder at
  // worst reproduces the dropped-commit outcome this flush improves on.
  // Guarded on the initial sidecar read: pre-hydration slots can miss
  // other slots' persisted entries, and flushing it would clobber them —
  // that narrow case stays best-effort (the in-memory merge in load()
  // cannot happen in an unloading document anyway).
  function flushNow() {
    if (!loaded) return;
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    try {
      Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {});
    } catch (e) {}
  }
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet =
  // Fill the container by default: slots are usually placed inside a
  // sized wrapper (a hero frame, a grid cell, an inset:0 layer) and are
  // expected to take that box — a fixed intrinsic size would render as
  // a small tile in the corner of a full-bleed wrapper instead.
  // aspect-ratio is the companion fallback that keeps a bare slot
  // visible when the parent's height is indefinite: height:100%
  // resolves to auto there, and the ratio then derives height from
  // width instead of letting the slot collapse to zero height.
  // Explicit width/height on the element override all of this.
  // color:inherit (not a fixed near-black): the placeholder chrome —
  // empty-state icon/caption (currentColor) and the dashed ring — must
  // read on dark decks too, and the slide's own text color is the one
  // color guaranteed to contrast with the slide background. The soft
  // look comes from opacity on those parts, not from a baked-in alpha.
  ':host{display:block;position:relative;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;' + '  width:100%;height:100%;aspect-ratio:3/2}' + '.empty .cap,.empty .sub{opacity:.75}' + '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(127,127,127,.08)}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  // popover=manual promotes the spill to the top layer on reframe, so it is
  // not clipped by any overflow:hidden / clip-path / scroll-container
  // ancestor (a plain z-index can't escape overflow clipping). UA popover
  // defaults (inset:0;margin:auto) are reset; _applyView sets viewport px.
  '.spill{position:fixed;margin:0;inset:auto;border:0;padding:0;background:transparent;' + '  overflow:visible;transform:translate(-50%,-50%);z-index:1;cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px}' + '.empty:hover .sub{opacity:1}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed currentColor;' + '  opacity:.35;transition:border-color .12s,opacity .12s}' + ':host([data-over]) .ring{border-color:#c96442;opacity:1}' + ':host([data-filled]) .ring{display:none}' +
  // Controls overlay INSIDE the frame, pinned to the top-right corner, so
  // a full-bleed slot in an overflow:hidden container still shows them
  // (the old below-mask placement got clipped). Credit sits bottom-left,
  // so top-right avoids collision. The blurred pill background keeps them
  // legible over the image.
  // The UA [popover] base rule styles the element in EVERY state (only
  // display:none is gated on :not(:popover-open), and the display:flex
  // below overrides that) — so the UA resets live HERE, like .spill's,
  // or the ordinary hover-state strip renders as a bordered Canvas box
  // centered by margin:auto. inset:auto precedes top/right (shorthand).
  '.ctl{position:absolute;inset:auto;top:8px;right:8px;margin:0;border:0;padding:0;' + '  background:transparent;overflow:visible;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' +
  // While reframing, the spill owns the top layer and would swallow every
  // click on the in-frame controls. Promoting .ctl into the top layer
  // ABOVE the spill (shown after it — later popovers stack higher) keeps
  // Edit-as-toggle and Replace clickable mid-reframe. _applyView pins it
  // to the frame's top-right in viewport px (translateX(-100%)
  // right-aligns against the computed left edge); inset:auto clears the
  // base rule's top/right so the inline left/top position it alone.
  '.ctl:popover-open{position:fixed;inset:auto;transform:translateX(-100%)}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}' +
  // Replacement in flight: after a src swap the browser keeps painting
  // the PREVIOUS image until the new one decodes, so a Replace would
  // flash the old photo and then pop. Hide the stale frame (visibility,
  // not display — _applyView geometry still applies) and spin until the
  // new image reports in (load/error clears data-swapping).
  ':host([data-swapping]) .frame img{visibility:hidden}' + '.loading{position:absolute;inset:0;display:none;align-items:center;' + '  justify-content:center;pointer-events:none}' + ':host([data-swapping]) .loading{display:flex}' + '.loading::after{content:"";width:22px;height:22px;border-radius:50%;' + '  border:2px solid rgba(127,127,127,.25);border-top-color:currentColor;' + '  animation:om-slot-spin .7s linear infinite}' + '@keyframes om-slot-spin{to{transform:rotate(360deg)}}' +
  // Reduced motion: the static two-tone ring still reads as "working".
  '@media (prefers-reduced-motion:reduce){.loading::after{animation:none}}' + '.credit{position:absolute;left:6px;bottom:6px;max-width:calc(100% - 12px);display:none;' + '  padding:3px 7px;border-radius:5px;background:rgba(0,0,0,.55);color:#fff;' + '  font:10px/1.2 system-ui,-apple-system,sans-serif;text-decoration:none;' + '  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;backdrop-filter:blur(6px)}' +
  // The credit is a SPAN holding one or two <a>s (Unsplash's prescribed
  // form links the photographer AND Unsplash) — anchors style inline so
  // the overlay reads as one line of text.
  '.credit a{color:inherit;text-decoration:none}' + '.credit a:hover,.credit a:focus-visible{text-decoration:underline}' + ':host([data-filled][data-credit]) .credit{display:block}' +
  // Exports must ship JUST the image — no hover controls, no credit chip
  // (the host marks <html data-om-exporting> for the capture window; the
  // page-level hide script can't reach shadow DOM, this rule can).
  ':host-context([data-om-exporting]) .ctl,' + ':host-context([data-om-exporting]) .credit{display:none !important}' +
  // Print must ship just the image too: the hover-gated controls can be
  // mid-hover when print() fires, and the credit chip is screen chrome —
  // the same rule the capture window gets, keyed on print media instead
  // of the host's data-om-exporting mark (the print path sets no mark).
  '@media print{.ctl,.credit{display:none !important}}' +
  // No export-window mask rules here on purpose: the export capture
  // releases the replacement mask by REMOVING data-swapping (the
  // shadow-root pass in pages/export/shared.ts HIDE_EXPORT_CHROME_SCRIPT)
  // — attribute removal works in every engine (:host-context is
  // Chromium-only), is scoped by construction to slots actually
  // mid-swap, and hides the spinner through the same gate. A masked img
  // would otherwise be silently dropped from PPTX decks (the capture
  // walk skips visibility:hidden imgs).
  // Attribution error tile: REPLACES the photo when an Unsplash src has
  // no credit attribute — rendering the photo uncredited is the terms
  // violation, so the photo must not appear at all.
  // Calm and neutral on purpose (review feedback): the tile informs the
  // user; the fix instructions are machine-facing (usage docblock, tool
  // description, and the turn-end scan's bounce copy name the attributes
  // for the agent).
  '.attr-error{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  background:#f2f1ef;color:#6e6c66;user-select:none;' + '  font:13px/1.45 system-ui,-apple-system,sans-serif}' + '.attr-error svg{opacity:.55}' + '.attr-error .cap{max-width:92%;font-weight:500;letter-spacing:.01em}' + ':host([data-attribution-error]) .attr-error{display:flex}' + ':host([data-attribution-error]) .ring{display:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  const warnIcon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>' + '<path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'placeholder', 'src', 'id', 'credit', 'credit-href'];
    }

    /** Duplicate-slide hook (called by deck-stage, see its
     *  _remintDuplicateIds): copy this id's stored image, if any, under a
     *  freshly minted key and return that key — so a duplicated slide's
     *  slot keeps its dropped photo instead of reverting to the
     *  placeholder. 'isFree' is the caller's uniqueness check (document
     *  ids); candidates must ALSO be unused in the sidecar, which can
     *  hold keys from other pages sharing the project root. (An EMPTY
     *  slot on another page leaves no sidecar entry, so its id is not
     *  detectable here — a minted key can collide with it and that slot
     *  would show this photo. Same blast radius as two pages reusing an
     *  id by hand, which the shared sidecar already permits.) Returns null
     *  when no id could be minted (caller strips the id, today's
     *  behavior). */
    static cloneSlot(fromId, isFree) {
      if (typeof fromId !== 'string' || !fromId) return null;
      // Pre-hydration the store can't veto candidates or source the copy
      // — degrade to the strip (today's behavior) rather than mint
      // against keys we can't see yet. Any rendered (= droppable) slot
      // means load() has already settled.
      if (!loaded) return null;
      const stem = fromId.replace(/-\d+$/, '') || fromId;
      for (let n = 2; n < 100; n++) {
        const toId = stem + '-' + n;
        if (toId === fromId) continue;
        if (slots[toId] !== undefined) {
          // Reuse a key holding this exact value (bytes AND crop) if no
          // live element here owns it — a duplicate op the host refused
          // after minting leaves such a key behind, and reusing keeps
          // refused retries from accumulating one orphaned copy per
          // attempt. Full equality (not just bytes) so a byte-identical
          // key another PAGE owns with its own crop is stepped past, not
          // adopted or rewritten. (Entries without .u never match.)
          const prev = getSlot(toId);
          const cur = getSlot(fromId);
          if (!(prev && cur && prev.u && prev.u === cur.u && prev.s === cur.s && prev.x === cur.x && prev.y === cur.y && (typeof isFree !== 'function' || isFree(toId)))) continue;
          return toId;
        }
        if (typeof isFree === 'function' && !isFree(toId)) continue;
        const v = getSlot(fromId);
        if (v) setSlot(toId, Object.assign({}, v));
        return toId;
      }
      return null;
    }
    constructor() {
      super();
      // clonable: rail thumbnails deep-clone slides and carry this shadow
      // along; reuse an already-cloned root so upgrade-after-clone works.
      // (Deliberately NOT serializable — a getHTML consumer would embed
      // multi-MB sidecar data-URLs into serialized page HTML.)
      const root = this.shadowRoot || this.attachShadow({
        mode: 'open',
        clonable: true
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="attr-error" part="attribution-error">' + warnIcon + '    <div class="cap">This photo needs attribution</div></div>' + '  <div class="loading" part="loading"></div>' + '  <div class="ring" part="ring"></div>' + '</div>' +
      // Outside .frame, like .spill/.ctl — the frame's overflow:hidden +
      // border-radius/clip-path would cut the credit off on circle/pill/mask.
      // A SPAN, not an <a>: the prescribed Unsplash credit holds two links
      // (photographer + Unsplash), built per-render in _render().
      '<span class="credit" part="credit"></span>' + '<div class="spill" popover="manual" data-dc-edit-transparent>' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' +
      // data-dc-edit-transparent: the DC editor's edit-mode picker lets
      // clicks through for chrome marked with it (EDIT_TRANSPARENT_SEL)
      // — without it, Replace/Edit clicks in Edit mode are swallowed by
      // element selection and the controls look dead.
      '<div class="ctl" popover="manual" data-dc-edit-transparent><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="edit" title="Reframe image">Edit</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ctl = root.querySelector('.ctl');
      this._credit = root.querySelector('.credit');
      this._attrError = root.querySelector('.attr-error');
      // Credit clicks open the link, not browse/reframe.
      this._credit.addEventListener('click', e => e.stopPropagation());
      this._credit.addEventListener('dblclick', e => e.stopPropagation());
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      // Encode-in-flight marker (the owning _ingest generation): while set,
      // the same-src "nothing in flight" clear in _render must not fire —
      // the stored value still points at the OLD image until the encode
      // lands, so that clear would unmask the stale image mid-replace.
      this._swapGen = 0;
      // Render-owned swap in flight: set when _render assigns a new src,
      // cleared only by the img's own load/error (or the empty branch).
      // img.complete CANNOT stand in for this — setting src only QUEUES
      // the current-request swap (a microtask), so synchronously after an
      // assignment, complete still reports the OLD settled request. The
      // pick path does exactly that: the host sets src, credit, and
      // credit-href back-to-back in one task, and renders #2/#3 would
      // read the stale complete === true and drop the mask one render
      // after it was set.
      this._loadPending = false;
      // See _render's empty branch: a transient attribution-error wipe of a
      // showing image must make the follow-up render a replacement (spinner),
      // not a first fill (blank frame).
      this._hidShowing = false;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (!act) return;
        // The hidden controls are opacity-0 but still tabbable — without
        // this gate a keyboard user could drive them on a read-only share
        // link (mirrors the dblclick handler's editable gate).
        if (!this.hasAttribute('data-editable')) return;
        if (act === 'replace') {
          this._exitReframe(true);
          // Host-owned picker (Unsplash modal; it also offers local import).
          this.dispatchEvent(new CustomEvent('image-slot:pick', {
            bubbles: true,
            composed: true,
            detail: {
              id: this.id || null
            }
          }));
        }
        if (act === 'edit') {
          if (!this._reframes()) return;
          if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      // load/error also release the replacement-in-flight mask (via the
      // single discipline in _releaseMask): the swap is only revealed once
      // the new image can actually paint (on error the frame shows its
      // background, same as a fresh slot with a broken src).
      this._img.addEventListener('load', () => {
        this._loadPending = false;
        this._releaseMask(true);
        this._applyView();
      });
      this._img.addEventListener('error', () => {
        this._loadPending = false;
        this._releaseMask(true);
      });
      // Gated only on editable — any filled slot can be repositioned/scaled,
      // regardless of fit. Share links (no writeFile) stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
          const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // The host may inject window.omelette.writeFile AFTER the first render;
      // re-render on hover so the editable-gated controls reliably appear.
      this.addEventListener('pointerenter', this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('pointerenter', this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      // commit=false: a disconnect is not a user intent — committing here
      // would persist whatever half-finished drag a React remount or DOM
      // splice happened to interrupt. Deliberate exits commit on their own
      // paths (Escape/click-out/toggle), and unloads commit via pagehide.
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._signalReframe(true);
      // Best-effort commit when the document unloads mid-reframe (a host
      // navigation racing the enter signal, a manual reload, tab close):
      // the sidecar write rides the host bridge, which outlives this
      // document, so the crop survives even though the mode dies with the
      // DOM. Held on the instance so _exitReframe detaches exactly what
      // was attached.
      this._pagehide = () => {
        this._exitReframe(true);
        flushNow();
      };
      window.addEventListener('pagehide', this._pagehide);
      // Promote spill to the top layer, then keep it pinned over the frame:
      // scroll/resize cover the common cases, and a per-frame rect check
      // catches layout shifts that fire neither (an image above finishing
      // load, streamed DOM pushing the slot down, an ancestor transform
      // change) so the overlay can't detach from the frame.
      try {
        this._spill.showPopover();
      } catch {}
      // After the spill, so the controls stack above it in the top layer.
      try {
        this._ctl.showPopover();
      } catch {}
      this._reposition = () => {
        if (this.hasAttribute('data-reframe')) this._applyView();
      };
      window.addEventListener('scroll', this._reposition, true);
      window.addEventListener('resize', this._reposition);
      this._lastRect = '';
      this._watch = () => {
        if (!this.hasAttribute('data-reframe')) return;
        const r = this.getBoundingClientRect();
        const key = r.left + ',' + r.top + ',' + r.width + ',' + r.height;
        if (key !== this._lastRect) {
          this._lastRect = key;
          this._applyView();
        }
        this._watchId = requestAnimationFrame(this._watch);
      };
      this._watchId = requestAnimationFrame(this._watch);
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (this._reposition) {
        window.removeEventListener('scroll', this._reposition, true);
        window.removeEventListener('resize', this._reposition);
        this._reposition = null;
      }
      if (this._watchId) {
        cancelAnimationFrame(this._watchId);
        this._watchId = 0;
      }
      if (this._pagehide) {
        window.removeEventListener('pagehide', this._pagehide);
        this._pagehide = null;
      }
      try {
        this._spill.hidePopover();
      } catch {}
      try {
        this._ctl.hidePopover();
      } catch {}
      this._ctl.style.left = '';
      this._ctl.style.top = '';
      if (commit) this._commitView();
      this._signalReframe(false);
    }

    // Reframe state lives only in this DOM until commit, invisible to the
    // host's dirty signals — announce enter/exit so the host can hold
    // auto-reloads for exactly the gesture (the guest bundle forwards
    // image-slot:reframe to the host as imageSlotReframe). Dispatched on
    // the element (composed, so it escapes shadow roots) while connected;
    // a disconnected exit (disconnectedCallback) falls back to document so
    // the host still hears it.
    _signalReframe(active) {
      const target = this.isConnected ? this : document;
      target.dispatchEvent(new CustomEvent('image-slot:reframe', {
        bubbles: true,
        composed: true,
        detail: {
          active: active,
          id: this.id || null
        }
      }));
    }

    // Public: host's "Import from computer" calls this to run local browse.
    openFilePicker() {
      this._exitReframe(true);
      this._input.click();
    }

    // A src write is a newer intent for this slot's content — the host
    // pick path (setImageSlotImage) or an agent edit — so it must win
    // over any encode still in flight from an earlier drop: left live,
    // that encode lands later, passes _ingest's gen guard, and its
    // setSlot silently overwrites the pick (the stored value shadows
    // src in _render). Bumping _gen kills the encode before its own
    // _swapGen clear runs, so clear the dead claim here too — otherwise
    // _releaseMask (gated on !_swapGen) never fires and the pick's
    // spinner is stranded. src ONLY: the pick sets credit/credit-href
    // in the same task, and clearing _swapGen on those would let the
    // same-src branch unmask the old image mid-encode.
    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'src' && oldVal !== newVal) {
        this._gen++;
        this._swapGen = 0;
      }
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      // Replacing a shown image: surface the swap through the encode too,
      // not just the decode — otherwise the old photo sits there with no
      // feedback while the canvas re-encode runs. An empty slot keeps its
      // placeholder (no spinner) until the encode lands, as before.
      // _swapGen guards the mask against re-renders DURING the encode
      // (pointerenter, ResizeObserver, another slot's store write): the
      // stored value still resolves to the old image there, so _render's
      // same-src clear would otherwise unmask it mid-replace.
      if (this.hasAttribute('data-filled')) {
        this.setAttribute('data-swapping', '');
        this._swapGen = gen;
      }
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        // Clear BEFORE setSlot: its synchronous re-render must see no
        // pending encode, so a byte-identical re-upload (same data URL, no
        // load event coming) still clears the mask via the complete branch.
        this._swapGen = 0;
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._swapGen = 0;
        // Reveal the kept old image — unless another replacement (a
        // remote pick's src swap) is still in flight, in which case the
        // mask stays until THAT image settles (its load/error releases).
        this._releaseMask();
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is available on any filled slot — the user can
    // always reposition/scale. `fit` only sets the initial baseline (see
    // _geom): contain starts fully-visible, cover starts frame-filling.
    _reframes() {
      return this.hasAttribute('data-filled');
    }

    // The single release discipline for the replacement-in-flight mask
    // (data-swapping). The mask comes off only when BOTH hold:
    //  - no encode is pending (_swapGen) — mid-encode the stored value
    //    still resolves to the old image, so any reveal paints it;
    //  - the frame img has settled on its current src — an unsettled src
    //    means some replacement is still in flight (e.g. a remote pick),
    //    whoever started it, and revealing would paint the previous
    //    frame. The load/error listeners pass settled=true (the event IS
    //    the settlement signal, per spec complete is true by then);
    //    other callers rely on the complete flag (covers loaded AND
    //    failed).
    // Every release path funnels through here EXCEPT _render's empty
    // branch (the img is being cleared — nothing will ever settle).
    _releaseMask(settled) {
      if (!this._swapGen && !this._loadPending && (settled || this._img.complete)) {
        this.removeAttribute('data-swapping');
      }
    }

    // Baseline geometry, shared by clamp/apply/resize. `base` is the scale at
    // view-scale s=1: cover = fill the frame (overflow on the looser axis),
    // contain = fit fully inside (letterboxed). Zooming a contain image past
    // s where it overflows naturally becomes a crop. Null until the img has
    // loaded (naturalWidth is 0 before that) or when the slot has no layout
    // box — ResizeObserver fires with a 0×0 rect under display:none, and
    // clamping against a degenerate 1×1 frame would silently pull the stored
    // pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
      const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
      return {
        iw,
        ih,
        fw,
        fh,
        base
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      // Top-layer controls: pin to the frame's top-right in viewport px
      // (the same 8px inset as the in-frame layout; unscaled — top-layer UI
      // reads as chrome, not page content). BEFORE the geometry branch:
      // placement needs only the frame rect, and a not-yet-loaded or broken
      // src must not leave the promoted strip floating unpositioned. Gated
      // on the popover actually being open: without the Popover API,
      // showPopover() threw (swallowed in _enterReframe), .ctl stays in
      // its in-frame absolute layout, and viewport-px coordinates would
      // shove it off-frame — and matches(':popover-open') itself throws
      // there (unknown pseudo-class), hence the try/catch.
      if (this.hasAttribute('data-reframe')) {
        let onTop = false;
        try {
          onTop = this._ctl.matches(':popover-open');
        } catch {}
        if (onTop) {
          const r = this.getBoundingClientRect();
          this._ctl.style.left = r.right - 8 + 'px';
          this._ctl.style.top = r.top + 8 + 'px';
        }
      }
      if (!g) {
        // Dimensions not known yet (before img load) — centered fit so there
        // is no flash of an unpositioned image before the geometry lands.
        const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = contain ? 'contain' : 'cover';
        return;
      }
      // Baseline (cover-fill or contain-fit) × view scale. Width/height and
      // left/top are all frame-% — depends only on the frame aspect ratio, so
      // a responsive resize keeps the same crop. The spill layer mirrors the
      // same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      if (this.hasAttribute('data-reframe')) {
        // Top-layer spill: position in viewport px over the frame. The top
        // layer escapes ancestor transforms entirely, so EVERY term must be
        // in viewport units: getBoundingClientRect gives the frame's scaled
        // origin AND size, and the rect/layout ratio rescales the ghost —
        // sizing from layout px alone renders it 1/scale too large under a
        // scaled deck slide. Inner ghost + handles stay box-relative.
        const r = this.getBoundingClientRect();
        const sx = g.fw ? r.width / g.fw : 1;
        const sy = g.fh ? r.height / g.fh : 1;
        this._spill.style.width = g.iw * k * sx + 'px';
        this._spill.style.height = g.ih * k * sy + 'px';
        this._spill.style.left = r.left + (50 + this._view.x) / 100 * r.width + 'px';
        this._spill.style.top = r.top + (50 + this._view.y) / 100 * r.height + 'px';
      }
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      // An Unsplash src with no credit attribute must NOT render — showing
      // the photo uncredited is the Unsplash-terms violation itself. The
      // error tile replaces the photo until the credit is written. A
      // user-dropped image is the user's own content and always renders.
      // Trimmed: credit is agent/user-editable content, and a whitespace-
      // only value must count as missing — otherwise it would suppress the
      // error tile AND render an empty credit box (no text, no links),
      // exactly the unattributed state this gate exists to prevent.
      const credit = (this.getAttribute('credit') || '').trim();
      const attrError = !!(!credit && !this._userUrl && srcAttr && isUnsplashHost(srcAttr));
      this.toggleAttribute('data-attribution-error', attrError);
      if (url && !attrError) {
        const prev = this._img.getAttribute('src');
        if (prev !== url) {
          // Replacing an already-shown image: mark the swap BEFORE setting
          // src so the stale frame is never revealed (see the data-swapping
          // stylesheet rules). First fill (prev empty) keeps the existing
          // placeholder-until-load behavior — no spinner. _hidShowing
          // covers the pick path's transient attribution-error wipe: prev
          // is gone, but an image WAS showing, so this is a replacement.
          if (prev || this._hidShowing) this.setAttribute('data-swapping', '');
          // Mark the swap BEFORE assigning src: complete keeps reporting
          // the old settled request until the browser's
          // update-the-image-data microtask runs, so same-task re-renders
          // (the pick path's credit/credit-href setAttributes) need this
          // flag, not complete, to know a load is in flight.
          this._loadPending = true;
          this._img.src = url;
          this._ghost.src = url;
        } else {
          // Same-src re-render — release if settled, so an ingest-set
          // spinner can't stick after a byte-identical re-upload (same
          // data URL, no further load event ever fires).
          this._releaseMask();
        }
        this._hidShowing = false;
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this.removeAttribute('data-swapping');
        // The src is being removed — no load/error will ever fire for it.
        this._loadPending = false;
        // A transient attribution-error wipe of a showing image happens on
        // the pick path: the host sets src one setAttribute before credit,
        // so render N hides the old image (attrError) and render N+1
        // restores a URL. Remember the wipe so that restore renders as a
        // replacement (spinner), not a first fill (blank frame).
        this._hidShowing = attrError && !!this._img.getAttribute('src');
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        // The error tile owns the blocked-photo state; .empty stays for
        // the genuinely-empty slot.
        this._empty.style.display = attrError ? 'none' : 'flex';
        this.removeAttribute('data-filled');
      }

      // Credit belongs to the author src, so a user drop hides it.
      // textContent + the http(s)-only funnel keep external strings inert.
      const showCredit = !!(url && credit && !this._userUrl && !attrError);
      this._credit.textContent = '';
      if (showCredit) {
        // Validate once (resolved against the document, http(s) only),
        // then append the terms-required utm referral params to links
        // that point back at unsplash.com.
        let href = '';
        const rawHref = this.getAttribute('credit-href') || '';
        if (rawHref) {
          try {
            const u = new URL(rawHref, document.baseURI);
            if (u.protocol === 'http:' || u.protocol === 'https:') {
              href = withReferral(u.href);
            }
          } catch {}
        }
        const mkLink = (text, linkHref) => {
          const a = document.createElement('a');
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          a.setAttribute('href', linkHref);
          a.textContent = text;
          return a;
        };
        // Unsplash's prescribed credit is TWO links — the photographer's
        // name to their profile (credit-href) and 'Unsplash' to the
        // homepage. Render that split whenever the text has the canonical
        // shape; other text keeps the legacy single-link rendering.
        const m = /^Photo by (.+) on Unsplash$/.exec(credit);
        if (m) {
          this._credit.appendChild(document.createTextNode('Photo by '));
          this._credit.appendChild(href ? mkLink(m[1], href) : document.createTextNode(m[1]));
          this._credit.appendChild(document.createTextNode(' on '));
          this._credit.appendChild(mkLink('Unsplash', UNSPLASH_HOMEPAGE_HREF));
        } else if (href) {
          this._credit.appendChild(mkLink(credit, href));
        } else {
          this._credit.textContent = credit;
        }
      }
      this.toggleAttribute('data-credit', showCredit);
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tech-ar/image-slot.js", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.BeatIcon = __ds_scope.BeatIcon;

__ds_ns.BookingTicket = __ds_scope.BookingTicket;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.ToastStack = __ds_scope.ToastStack;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
