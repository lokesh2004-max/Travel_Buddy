import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * SwipeMatch is superseded by the real BuddyMatch page.
 * Redirect all visitors to the canonical matching flow.
 */
const SwipeMatch = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate('/buddy-match', { replace: true }); }, [navigate]);
  return null;
};

export default SwipeMatch;
