const RatingPill = ({ value }) => (
  <span className="rating-pill">
    <span className="rating-pill-star">★</span>
    {parseFloat(value || 0).toFixed(1)}
  </span>
);

export default RatingPill;
