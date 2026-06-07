import { useState } from 'react';

const StarRating = ({ value = 0, onRate, size = 'md' }) => {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div
      className={`stars stars--${size}`}
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star ${display >= star ? 'filled' : ''}`}
          onMouseEnter={() => setHover(star)}
          onClick={() => onRate(star)}
          aria-label={`Rate ${star} stars`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRating;
