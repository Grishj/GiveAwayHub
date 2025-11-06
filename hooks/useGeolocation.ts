
import { useState, useEffect } from 'react';
import { GeolocationState } from '../types';

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    error: null,
    position: null,
  });

  useEffect(() => {
    const fetchLocation = () => {
      if (!navigator.geolocation) {
        setState({
          loading: false,
          error: {
            code: 0,
            message: "Geolocation is not supported by your browser.",
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3,
          },
          position: null,
        });
        return;
      }

      setState(prevState => ({ ...prevState, loading: true }));
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState({
            loading: false,
            error: null,
            position,
          });
        },
        (error) => {
          setState({
            loading: false,
            error,
            position: null,
          });
        }
      );
    };

    fetchLocation();
    
    // No dependency array to re-fetch if permissions change, but for this app, once is fine.
    // If we wanted a "refresh location" button, we'd wrap fetchLocation in a useCallback and expose it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
};
