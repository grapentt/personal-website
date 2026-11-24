/** The site mark: a Hopf fibre, two linked circles. */
const Mark = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <ellipse cx="9.5" cy="12" rx="6.5" ry="4.2" transform="rotate(-30 9.5 12)" />
    <ellipse cx="14.5" cy="12" rx="6.5" ry="4.2" transform="rotate(30 14.5 12)" opacity="0.6" />
  </svg>
);

export default Mark;
